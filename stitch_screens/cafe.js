// =========================================================
// World International — Cafe POS shared data layer
// Extends the Dexie ("TraveloopDB") database from global.js
// with cafe_tables, cafe_menu, cafe_orders.
// All 4 POS screens (Table View, POS Terminal, KDS, Admin)
// read/write this same local DB and stay in sync via
// localDataEvents (already defined in global.js).
// =========================================================

// Bump Dexie schema version to add robust financial fields
db.version(4).stores({
    trips: '++id, user_id, name, date, created_at',
    bookings: '++id, user_id, room_type, checkin, checkout, guests, status, created_at',
    cafe_tables: '++id, number, zone, capacity',
    cafe_menu: '++id, name, category, price, available',
    cafe_orders: '++id, table_id, order_type, source, status, payment_status, created_at'
}).upgrade(tx => {
    // Schema upgrades if necessary
    return tx.cafe_orders.toCollection().modify(order => {
        if (!order.payment_status) order.payment_status = 'pending';
        if (order.subtotal === undefined) order.subtotal = 0;
        if (order.tax === undefined) order.tax = 0;
        if (order.total_amount === undefined) order.total_amount = 0;
    });
});

const CAFE_TAX_RATE = 0.05;

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

    // Force re-seed if menu is stale (fewer than 60 items means old seed)
    const menuCount = await db.cafe_menu.count();
    if (menuCount < 60) {
        await db.cafe_menu.clear();
        await db.cafe_menu.bulkAdd([
            // ── BEVERAGES (COFFEE & TEA) ──────────────────────────
            { name: 'Classic Latte',         category: 'Beverages',   price: 120, available: true,  image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80' },
            { name: 'Cappuccino',            category: 'Beverages',   price: 130, available: true,  image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80' },
            { name: 'Flat White',            category: 'Beverages',   price: 130, available: true,  image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?w=400&q=80' },
            { name: 'Espresso Shot',         category: 'Beverages',   price: 80,  available: true,  image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80' },
            { name: 'Cold Brew',             category: 'Beverages',   price: 150, available: true,  image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80' },
            { name: 'Iced Americano',        category: 'Beverages',   price: 110, available: true,  image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&q=80' },
            { name: 'Filter Coffee',         category: 'Beverages',   price: 90,  available: true,  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80' },
            { name: 'Masala Chai',           category: 'Beverages',   price: 70,  available: true,  image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&q=80' },
            { name: 'Earl Grey Tea',         category: 'Beverages',   price: 80,  available: true,  image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80' },
            { name: 'Green Tea',             category: 'Beverages',   price: 80,  available: true,  image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&q=80' },
            { name: 'Matcha Latte',          category: 'Beverages',   price: 160, available: true,  image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80' },
            { name: 'Hot Chocolate',         category: 'Beverages',   price: 140, available: true,  image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80' },
            
            // ── COLD DRINKS & MOCKTAILS ──────────────────────────
            { name: 'Mango Smoothie',        category: 'Cold Drinks', price: 180, available: true,  image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80' },
            { name: 'Strawberry Shake',      category: 'Cold Drinks', price: 190, available: true,  image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80' },
            { name: 'Fresh Lime Soda',       category: 'Cold Drinks', price: 80,  available: true,  image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80' },
            { name: 'Virgin Mojito',         category: 'Cold Drinks', price: 140, available: true,  image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
            { name: 'Blue Lagoon',           category: 'Cold Drinks', price: 150, available: true,  image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
            { name: 'Watermelon Cooler',     category: 'Cold Drinks', price: 130, available: true,  image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80' },
            { name: 'Peach Iced Tea',        category: 'Cold Drinks', price: 120, available: true,  image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
            { name: 'Cold Coffee',           category: 'Cold Drinks', price: 160, available: true,  image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80' },

            // ── BREAKFAST ──────────────────────────────────────────
            { name: 'Masala Omelette',       category: 'Breakfast',   price: 160, available: true,  image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=80' },
            { name: 'Avocado Toast',         category: 'Breakfast',   price: 280, available: true,  image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80' },
            { name: 'Pancakes (3 pcs)',      category: 'Breakfast',   price: 220, available: true,  image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80' },
            { name: 'Eggs Benedict',         category: 'Breakfast',   price: 320, available: true,  image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80' },
            { name: 'Granola Bowl',          category: 'Breakfast',   price: 200, available: true,  image: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400&q=80' },
            { name: 'French Toast',          category: 'Breakfast',   price: 240, available: true,  image: 'https://images.unsplash.com/photo-1484723091739-30anf5-0a3b?w=400&q=80' },
            { name: 'Poha',                  category: 'Breakfast',   price: 110, available: true,  image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80' },
            { name: 'Idli Sambar',           category: 'Breakfast',   price: 120, available: true,  image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&q=80' },

            // ── CONTINENTAL MAINS ──────────────────────────────────
            { name: 'Club Sandwich',         category: 'Continental', price: 280, available: true,  image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80' },
            { name: 'Margherita Pizza',      category: 'Continental', price: 420, available: true,  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80' },
            { name: 'Veggie Burger',         category: 'Continental', price: 320, available: true,  image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80' },
            { name: 'Pasta Arrabbiata',      category: 'Continental', price: 360, available: true,  image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80' },
            { name: 'Mac & Cheese',          category: 'Continental', price: 340, available: true,  image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80' },
            { name: 'Grilled Chicken Wrap',  category: 'Continental', price: 300, available: true,  image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80' },
            { name: 'BLT Ciabatta',          category: 'Continental', price: 340, available: true,  image: 'https://images.unsplash.com/photo-1484723091739-30anf5-0a3b?w=400&q=80' },
            { name: 'Mushroom Risotto',      category: 'Continental', price: 400, available: true,  image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80' },

            // ── INDIAN MAINS ───────────────────────────────────────
            { name: 'Paneer Butter Masala',  category: 'Indian',      price: 350, available: true,  image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=400&q=80' },
            { name: 'Dal Makhani',           category: 'Indian',      price: 280, available: true,  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80' },
            { name: 'Chicken Tikka Masala',  category: 'Indian',      price: 450, available: true,  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
            { name: 'Mutton Rogan Josh',     category: 'Indian',      price: 520, available: true,  image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80' },
            { name: 'Vegetable Biryani',     category: 'Indian',      price: 300, available: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
            { name: 'Chicken Biryani',       category: 'Indian',      price: 380, available: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },
            { name: 'Garlic Naan',           category: 'Indian',      price: 60,  available: true,  image: 'https://images.unsplash.com/photo-1626200419109-38290bc98375?w=400&q=80' },
            { name: 'Butter Roti',           category: 'Indian',      price: 40,  available: true,  image: 'https://images.unsplash.com/photo-1626200419109-38290bc98375?w=400&q=80' },
            { name: 'Jeera Rice',            category: 'Indian',      price: 150, available: true,  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80' },

            // ── SIDES & SNACKS ─────────────────────────────────────
            { name: 'Truffle Fries',         category: 'Snacks',      price: 200, available: true,  image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80' },
            { name: 'Garlic Bread',          category: 'Snacks',      price: 150, available: true,  image: 'https://images.unsplash.com/photo-1619531040576-f9416740661d?w=400&q=80' },
            { name: 'Caesar Salad',          category: 'Snacks',      price: 220, available: true,  image: 'https://images.unsplash.com/photo-1512852939750-1305098529bf?w=400&q=80' },
            { name: 'Onion Rings',           category: 'Snacks',      price: 170, available: true,  image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80' },
            { name: 'Nachos with Salsa',     category: 'Snacks',      price: 240, available: true,  image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80' },
            { name: 'Chicken Wings (6 pcs)', category: 'Snacks',      price: 280, available: true,  image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&q=80' },
            { name: 'Paneer Tikka',          category: 'Snacks',      price: 260, available: true,  image: 'https://images.unsplash.com/photo-1599487405620-1e5b12da2231?w=400&q=80' },
            { name: 'Samosa (2 pcs)',        category: 'Snacks',      price: 80,  available: true,  image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80' },

            // ── DESSERTS ───────────────────────────────────────────
            { name: 'Almond Croissant',      category: 'Desserts',    price: 160, available: true,  image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
            { name: 'Blueberry Muffin',      category: 'Desserts',    price: 150, available: true,  image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80' },
            { name: 'Chocolate Brownie',     category: 'Desserts',    price: 180, available: true,  image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80' },
            { name: 'Tiramisu',              category: 'Desserts',    price: 240, available: true,  image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80' },
            { name: 'Cheesecake Slice',      category: 'Desserts',    price: 220, available: true,  image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80' },
            { name: 'Gulab Jamun (2 pcs)',   category: 'Desserts',    price: 100, available: true,  image: 'https://images.unsplash.com/photo-1593701460309-9fc6a44c5387?w=400&q=80' },
            { name: 'Rasmalai (2 pcs)',      category: 'Desserts',    price: 140, available: true,  image: 'https://images.unsplash.com/photo-1593701460309-9fc6a44c5387?w=400&q=80' },

            // ── SPECIALS ───────────────────────────────────────────
            { name: 'Chef Special Thali',    category: 'Specials',    price: 480, available: true,  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80' },
            { name: 'WI Signature Burger',   category: 'Specials',    price: 420, available: true,  image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
            { name: 'Truffle Mushroom Pizza', category: 'Specials',   price: 520, available: true,  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80' },
            { name: 'Sunday Brunch Plate',   category: 'Specials',    price: 550, available: false, image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80' },
        ]);
        console.log('Seeded cafe_menu with enhanced catalog (>60 items)');
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
        const total = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
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

// ---------------------------------------------------------
// BACKEND LOGIC: ORDERS
// ---------------------------------------------------------

// Internal helper to enforce strict financial logic
function recalculateOrderTotals(order) {
    const subtotal = (order.items || []).reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * CAFE_TAX_RATE;
    const total_amount = subtotal + tax;

    order.subtotal = subtotal;
    order.tax = tax;
    order.total_amount = total_amount;
    return order;
}

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
        payment_status: 'pending',
        items: [],
        subtotal: 0,
        tax: 0,
        total_amount: 0,
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
    if (!order) throw new Error("Order not found");
    if (order.status === 'completed' || order.payment_status === 'paid') {
        throw new Error("Cannot modify a paid or completed order.");
    }

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

    order.items = items;
    recalculateOrderTotals(order);
    await db.cafe_orders.put(order);
    
    emitCafeChange();
    return order;
}

// Adjust quantity of an item (delta = +1 / -1). Removes item if qty hits 0.
async function adjustItemQty(orderId, itemIndex, delta) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) throw new Error("Order not found");
    if (order.status === 'completed' || order.payment_status === 'paid') {
        throw new Error("Cannot modify a paid or completed order.");
    }

    const items = order.items || [];
    if (!items[itemIndex]) return order;

    items[itemIndex].qty += delta;
    if (items[itemIndex].qty <= 0) {
        items.splice(itemIndex, 1);
    }

    order.items = items;
    recalculateOrderTotals(order);
    await db.cafe_orders.put(order);
    
    emitCafeChange();
    return order;
}

async function removeItemFromOrder(orderId, itemIndex) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) throw new Error("Order not found");
    if (order.status === 'completed' || order.payment_status === 'paid') {
        throw new Error("Cannot modify a paid or completed order.");
    }

    const items = order.items || [];
    items.splice(itemIndex, 1);

    order.items = items;
    recalculateOrderTotals(order);
    await db.cafe_orders.put(order);

    emitCafeChange();
    return order;
}

// Send order to kitchen — status becomes "preparing"
async function sendOrderToKitchen(orderId) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) throw new Error("Order not found");
    if (order.items.length === 0) throw new Error("Cannot send empty order to kitchen.");

    order.status = 'preparing';
    order.sent_at = new Date().toISOString();
    await db.cafe_orders.put(order);
    
    emitCafeChange();
    return order;
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
    order.status = allDone ? 'ready' : 'preparing';
    order.items = items;

    await db.cafe_orders.put(order);
    emitCafeChange();
    return order;
}

// Complete an order (paid / closed) — frees up the table
async function completeOrder(orderId) {
    const order = await db.cafe_orders.get(Number(orderId));
    if (!order) throw new Error("Order not found");

    order.status = 'completed';
    order.completed_at = new Date().toISOString();
    
    await db.cafe_orders.put(order);
    emitCafeChange();
    return order;
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

async function getAdminMetrics() {
    const completed = await db.cafe_orders.where('status').equals('completed').toArray();

    let revenue = 0;
    const categoryTotals = {};
    const productTotals = {};

    for (const order of completed) {
        revenue += (order.subtotal || 0); // Using strict subtotal from robust backend

        for (const item of (order.items || [])) {
            const lineTotal = item.price * item.qty;
            
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
            day.total += (order.subtotal || 0); // Use the pre-calculated robust subtotal
        }
    });

    return days;
}

// Initialize seed data on load
seedCafeData();
