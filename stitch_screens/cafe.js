// =========================================================
// World International — Cafe POS shared data layer
// Extends the Dexie ("TraveloopDB") database from global.js
// with cafe_tables, cafe_menu, cafe_orders.
// All 4 POS screens (Table View, POS Terminal, KDS, Admin)
// read/write this same local DB and stay in sync via
// localDataEvents (already defined in global.js).
// =========================================================

// Bump Dexie schema version to add cafe tables
db.version(3).stores({
    trips: '++id, user_id, name, date, created_at',
    bookings: '++id, user_id, room_type, checkin, checkout, guests, status, created_at',
    cafe_tables: '++id, number, zone, capacity',
    cafe_menu: '++id, name, category, price, available',
    cafe_orders: '++id, table_id, order_type, source, status, created_at'
});

// ---------------------------------------------------------
// SEED DATA (runs once — checks if tables are empty first)
// ---------------------------------------------------------
async function seedCafeData() {
    const tableCount = await db.cafe_tables.count();
    if (tableCount === 0) {
        const zones = {
            'Ground Floor': [1,2,3,4,5,6],
            'Rooftop': [7,8,9,10],
            'Outdoor': [11,12]
        };
        const rows = [];
        Object.entries(zones).forEach(([zone, numbers]) => {
            numbers.forEach(n => {
                rows.push({ number: n, zone, capacity: [2,2,4,4,6,8][Math.floor(Math.random()*6)] || 4 });
            });
        });
        await db.cafe_tables.bulkAdd(rows);
        console.log('Seeded cafe_tables');
    }

    const menuCount = await db.cafe_menu.count();
    if (menuCount === 0) {
        await db.cafe_menu.bulkAdd([
            { name: 'Classic Latte', category: 'Beverages', price: 120, available: true },
            { name: 'Cold Brew', category: 'Beverages', price: 140, available: true },
            { name: 'Iced Americano', category: 'Beverages', price: 110, available: true },
            { name: 'Flat White', category: 'Beverages', price: 130, available: true },
            { name: 'Filter Coffee', category: 'Beverages', price: 90, available: true },
            { name: 'Avocado Toast', category: 'Mains', price: 280, available: true },
            { name: 'Club Sandwich', category: 'Mains', price: 280, available: true },
            { name: 'Margherita Pizza', category: 'Mains', price: 420, available: true },
            { name: 'Veggie Burger', category: 'Mains', price: 320, available: true },
            { name: 'Blueberry Muffin', category: 'Desserts', price: 150, available: true },
            { name: 'Almond Croissant', category: 'Desserts', price: 160, available: true },
            { name: 'Chocolate Brownie', category: 'Desserts', price: 180, available: true },
            { name: 'Truffle Fries', category: 'Sides', price: 200, available: true },
            { name: 'Garlic Bread', category: 'Sides', price: 150, available: true }
        ]);
        console.log('Seeded cafe_menu');
    }
}

// ---------------------------------------------------------
// EVENTS — reuse localDataEvents from global.js
// ---------------------------------------------------------
function emitCafeChange() {
    localDataEvents.dispatchEvent(new Event('cafeChanged'));
}

function subscribeCafe(callback) {
    localDataEvents.addEventListener('cafeChanged', callback);
    return { unsubscribe: () => localDataEvents.removeEventListener('cafeChanged', callback) };
}

// ---------------------------------------------------------
// TABLES
// ---------------------------------------------------------
async function getTables() {
    return await db.cafe_tables.orderBy('number').toArray();
}

// Returns tables enriched with open-order status & running total
async function getTablesWithStatus() {
    const tables = await getTables();
    const openOrders = await db.cafe_orders
        .where('status').anyOf(['open', 'preparing', 'ready'])
        .toArray();

    const byTable = {};
    openOrders.forEach(o => {
        if (!byTable[o.table_id]) byTable[o.table_id] = [];
        byTable[o.table_id].push(o);
    });

    return tables.map(t => {
        const orders = byTable[t.id] || [];
        const total = orders.reduce((sum, o) => {
            const orderTotal = (o.items || []).reduce((s, it) => s + (it.price * it.qty), 0);
            return sum + orderTotal;
        }, 0);
        return {
            ...t,
            occupied: orders.length > 0,
            total,
            openOrderId: orders.length > 0 ? orders[0].id : null
        };
    });
}

// ---------------------------------------------------------
// MENU
// ---------------------------------------------------------
async function getMenu() {
    return await db.cafe_menu.orderBy('category').toArray();
}

async function getMenuByCategory() {
    const items = await getMenu();
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });
    return grouped;
}

// ---------------------------------------------------------
// ORDERS
// ---------------------------------------------------------

// Get or create the active (open/preparing/ready) order for a table
async function getActiveOrderForTable(tableId) {
    const existing = await db.cafe_orders
        .where('table_id').equals(tableId)
        .and(o => ['open', 'preparing', 'ready'].includes(o.status))
        .first();
    if (existing) return existing;

    const id = await db.cafe_orders.add({
        table_id: tableId,
        order_type: 'dine-in',
        source: 'walk-in',
        status: 'open',
        items: [],
        created_at: new Date().toISOString()
    });
    emitCafeChange();
    return await db.cafe_orders.get(id);
}

async function getOrder(orderId) {
    return await db.cafe_orders.get(Number(orderId));
}

// Add item to an order (or increment qty if same item+notes already present)
async function addItemToOrder(orderId, menuItem, notes = '') {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) return null;

    const items = order.items || [];
    const existingIdx = items.findIndex(it => it.menu_id === menuItem.id && it.notes === notes);

    if (existingIdx >= 0) {
        items[existingIdx].qty += 1;
    } else {
        items.push({
            menu_id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            qty: 1,
            notes,
            done: false
        });
    }

    await db.cafe_orders.update(Number(orderId), { items });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

// Adjust quantity of an item (delta = +1 / -1). Removes item if qty hits 0.
async function adjustItemQty(orderId, itemIndex, delta) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) return null;

    const items = order.items || [];
    if (!items[itemIndex]) return order;

    items[itemIndex].qty += delta;
    if (items[itemIndex].qty <= 0) {
        items.splice(itemIndex, 1);
    }

    await db.cafe_orders.update(Number(orderId), { items });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

async function removeItemFromOrder(orderId, itemIndex) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) return null;

    const items = order.items || [];
    items.splice(itemIndex, 1);

    await db.cafe_orders.update(Number(orderId), { items });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

// Send order to kitchen — status becomes "preparing"
async function sendOrderToKitchen(orderId) {
    await db.cafe_orders.update(Number(orderId), { status: 'preparing', sent_at: new Date().toISOString() });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

// Mark an individual item as done/not-done within an order (KDS checkbox)
async function toggleOrderItemDone(orderId, itemIndex) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) return null;

    const items = order.items || [];
    if (!items[itemIndex]) return order;

    items[itemIndex].done = !items[itemIndex].done;

    // If all items done, mark order as ready
    const allDone = items.length > 0 && items.every(it => it.done);
    const status = allDone ? 'ready' : 'preparing';

    await db.cafe_orders.update(Number(orderId), { items, status });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

// Complete an order (paid / closed) — frees up the table
async function completeOrder(orderId) {
    await db.cafe_orders.update(Number(orderId), { status: 'completed', completed_at: new Date().toISOString() });
    emitCafeChange();
    return await db.cafe_orders.get(Number(orderId));
}

// Get all orders currently in "preparing" or "ready" (for KDS)
async function getActiveKitchenOrders() {
    return await db.cafe_orders
        .where('status').anyOf(['preparing', 'ready'])
        .toArray();
}

// ---------------------------------------------------------
// ADMIN ANALYTICS
// ---------------------------------------------------------

// Compute dashboard metrics from completed orders
async function getAdminMetrics() {
    const completed = await db.cafe_orders.where('status').equals('completed').toArray();

    let revenue = 0;
    const categoryTotals = {};
    const productTotals = {};

    for (const order of completed) {
        for (const item of (order.items || [])) {
            const lineTotal = item.price * item.qty;
            revenue += lineTotal;

            // Look up category from menu
            const menuItem = await db.cafe_menu.get(item.menu_id);
            const category = menuItem ? menuItem.category : 'Other';

            categoryTotals[category] = (categoryTotals[category] || 0) + lineTotal;

            if (!productTotals[item.name]) {
                productTotals[item.name] = { name: item.name, category, qty: 0, revenue: 0 };
            }
            productTotals[item.name].qty += item.qty;
            productTotals[item.name].revenue += lineTotal;
        }
    }

    const totalOrders = completed.length;
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

    const topProducts = Object.values(productTotals)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6);

    return {
        revenue,
        totalOrders,
        avgOrderValue,
        categoryTotals,
        topProducts,
        activeOrders: await db.cafe_orders.where('status').anyOf(['open', 'preparing', 'ready']).count()
    };
}

// Sales trend for last 7 days (by completed_at date)
async function getSalesTrend() {
    const completed = await db.cafe_orders.where('status').equals('completed').toArray();
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push({ date: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short' }), total: 0 });
    }

    completed.forEach(order => {
        if (!order.completed_at) return;
        const orderDate = order.completed_at.split('T')[0];
        const day = days.find(d => d.date === orderDate);
        if (day) {
            const orderTotal = (order.items || []).reduce((s, it) => s + (it.price * it.qty), 0);
            day.total += orderTotal;
        }
    });

    return days;
}

// Initialize seed data on load
seedCafeData();
