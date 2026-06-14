/**
 * Unified Navigation Bar — World International
 * Merges both "World International" (hotel/cafe) and "Traveloop" (travel planning)
 * into one consistent top navbar across the entire app.
 *
 * Usage: Add <script src="../nav.js"></script> or <script src="nav.js"></script>
 * The script auto-detects path depth and highlights the active page.
 */
(function () {
  // Determine if we're in a subdirectory (stitch_screens/)
  const inSubdir = window.location.pathname.includes('/stitch_screens/');
  const base = inSubdir ? '../' : '';

  // Detect current page for active highlighting
  const path = window.location.pathname;
  const isActive = (href) => {
    const page = href.split('/').pop().split('?')[0];
    return path.endsWith(page) ? 'nav-active' : '';
  };

  const html = `
  <style>
    #wi-navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 60px;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid #DEE2E6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 1px 12px rgba(0,0,0,0.06);
    }
    #wi-navbar .wi-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      flex-shrink: 0;
    }
    #wi-navbar .wi-brand-icon {
      width: 34px; height: 34px;
      background: #714B67;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    }
    #wi-navbar .wi-brand-name {
      font-size: 17px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.3px;
      white-space: nowrap;
    }
    #wi-navbar .wi-brand-name span {
      color: #714B67;
    }
    #wi-navbar .wi-links {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
      justify-content: center;
    }
    #wi-navbar .wi-links a {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      border-radius: 10px;
      font-size: 13.5px;
      font-weight: 600;
      color: #374151;
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      white-space: nowrap;
    }
    #wi-navbar .wi-links a:hover {
      background: #f3f4f6;
      color: #111827;
    }
    #wi-navbar .wi-links a.nav-active {
      background: #714B67;
      color: white;
    }
    #wi-navbar .wi-links a .material-symbols-outlined {
      font-size: 17px;
      line-height: 1;
    }
    #wi-navbar .wi-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    #wi-navbar .wi-icon-btn {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: #374151;
      cursor: pointer;
      transition: background 0.15s;
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      line-height: 1;
    }
    #wi-navbar .wi-icon-btn:hover { background: #f3f4f6; }
    #wi-navbar .wi-login-btn {
      padding: 7px 18px;
      background: #714B67;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
      text-decoration: none;
      display: flex; align-items: center; gap: 6px;
    }
    #wi-navbar .wi-login-btn:hover { background: #5A3C52; }
    #wi-navbar .wi-divider {
      width: 1px; height: 20px;
      background: #DEE2E6;
      margin: 0 4px;
    }
    /* Offset page content below fixed nav */
    body { padding-top: 60px !important; }
    /* Mobile: hide text labels, show icons only */
    @media (max-width: 900px) {
      #wi-navbar .wi-links a span:last-child { display: none; }
      #wi-navbar .wi-brand-name { display: none; }
      #wi-navbar .wi-links { gap: 0; }
    }
    @media (max-width: 600px) {
      #wi-navbar { padding: 0 12px; }
      #wi-navbar .wi-links a { padding: 7px 8px; }
    }
  </style>

  <nav id="wi-navbar">
    <!-- Brand -->
    <a class="wi-brand" href="${base}hero.html">
      <div class="wi-brand-icon">
        <span class="material-symbols-outlined" style="font-size:18px;color:white;font-variation-settings:'FILL' 1">hotel_class</span>
      </div>
      <span class="wi-brand-name">World <span>International</span></span>
    </a>

    <!-- Navigation Links -->
    <div class="wi-links">
      <a href="${base}traveloop_dashboard.html" class="${isActive('traveloop_dashboard.html')}">
        <span class="material-symbols-outlined">home</span>
        <span>Hub</span>
      </a>
      <a href="${base}my_trips.html" class="${isActive('my_trips.html')} ${isActive('plan_a_new_trip.html')} ${isActive('itinerary_builder.html')}">
        <span class="material-symbols-outlined">luggage</span>
        <span>My Trips</span>
      </a>
      <a href="${base}explore.html" class="${isActive('explore.html')}">
        <span class="material-symbols-outlined">explore</span>
        <span>Explore</span>
      </a>
      <a href="${base}budget_planner.html" class="${isActive('budget_planner.html')}">
        <span class="material-symbols-outlined">payments</span>
        <span>Budget</span>
      </a>
      <div class="wi-divider"></div>
      <a href="${base}stitch_screens/floor_plan_table_selection.html" class="${isActive('floor_plan_table_selection.html')} ${isActive('pos_order_view_terminal.html')} ${isActive('kitchen_display_system.html')} ${isActive('admin_dashboard.html')}">
        <span class="material-symbols-outlined">restaurant</span>
        <span>Cafe POS</span>
      </a>
    </div>

    <!-- Right Actions -->
    <div class="wi-actions">
      <button class="wi-icon-btn theme-toggle-btn" title="Toggle theme">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 0">dark_mode</span>
      </button>
      <button class="wi-icon-btn" title="Notifications" onclick="alert('No new notifications!')">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 0">notifications</span>
      </button>
      <a href="${base}profile.html" class="wi-icon-btn" title="Profile" style="text-decoration:none">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 0">person</span>
      </a>
      <div class="wi-divider"></div>
      <a href="${base}auth.html" class="wi-login-btn">
        <span class="material-symbols-outlined" style="font-size:15px">login</span>
        Login
      </a>
    </div>
  </nav>
  `;

  // Inject before any body content
  document.body.insertAdjacentHTML('afterbegin', html);

  // Fix any existing sticky/fixed headers that would now clash with the unified nav
  // Mark them for removal after DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    // Remove old page-level headers (they have class patterns we look for)
    const oldHeaders = document.querySelectorAll(
      'header:not(#wi-navbar), .old-nav, nav.fixed.top-0:not(#wi-navbar)'
    );
    oldHeaders.forEach(el => {
      // Only remove if it's a direct page header, not the cafe POS step nav
      if (el.id !== 'wi-navbar' && !el.closest('#wi-navbar')) {
        el.style.display = 'none';
      }
    });
  });
})();
