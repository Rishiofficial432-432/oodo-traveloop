// Database Operations using Supabase
async function getTrips() {
    try {
        // Get the current user
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (!user) return [];

        const { data, error } = await window.supabaseClient
            .from('trips')
            .select('*')
            .eq('user_id', user.id) // Explicitly filter by your unique ID
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Failed to fetch trips from Supabase:', err);
        return [];
    }
}

// Generic Realtime Subscription Engine
function subscribeToTable(tableName, callback) {
    return window.supabaseClient
        .channel(`${tableName}-realtime`)
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: tableName 
        }, (payload) => {
            console.log(`Realtime change in ${tableName}:`, payload);
            if (callback) callback(payload);
        })
        .subscribe();
}

async function saveTrip(trip) {
    try {
        // Get current user ID for ownership
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (!user) throw new Error('You must be logged in to save trips');

        const { data, error } = await window.supabaseClient
            .from('trips')
            .insert([{ ...trip, user_id: user.id }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error('Failed to save trip to Supabase:', err);
        alert('Error saving trip: ' + err.message);
    }
}

async function uploadMedia(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await window.supabaseClient.storage
            .from('trip-media')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = window.supabaseClient.storage
            .from('trip-media')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Upload failed:', err);
        throw err;
    }
}

// Logic for plan_a_new_trip page
function initCreateTrip() {
    const createBtn = document.getElementById('create-trip-btn');
    const mediaInput = document.getElementById('media-input');
    const uploadArea = document.getElementById('upload-area');
    const imgPreview = document.getElementById('image-preview');
    const videoPreview = document.getElementById('video-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const dateRangeLabel = document.getElementById('selected-date-range');

    if (!createBtn) return;

    // Handle Upload Click
    if (uploadArea && mediaInput) {
        uploadArea.addEventListener('click', () => mediaInput.click());
        
        mediaInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const isVideo = file.type.startsWith('video/');
            const url = URL.createObjectURL(file);

            if (isVideo) {
                videoPreview.src = url;
                videoPreview.classList.remove('hidden');
                imgPreview.classList.add('hidden');
            } else {
                imgPreview.src = url;
                imgPreview.classList.remove('hidden');
                videoPreview.classList.add('hidden');
            }
            uploadPlaceholder.classList.add('hidden');
        });
    }

    // Handle Date Changes
    function updateDateRange() {
        if (!startDateInput.value || !endDateInput.value) return;
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        const options = { month: 'short', day: 'numeric' };
        const year = start.getFullYear();
        dateRangeLabel.innerText = `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${year}`;
    }

    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', updateDateRange);
        endDateInput.addEventListener('change', updateDateRange);
    }

    createBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('trip-name');
        const descInput = document.getElementById('trip-desc');
        
        if (!nameInput.value.trim()) {
            alert('Please enter a trip name');
            return;
        }

        const originalText = createBtn.innerHTML;
        createBtn.disabled = true;

        try {
            let imageUrl = '';
            let videoUrl = '';

            // 1. Upload media if present
            if (mediaInput.files.length > 0) {
                createBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">cloud_upload</span> <span>Uploading Media...</span>';
                const file = mediaInput.files[0];
                const publicUrl = await uploadMedia(file);
                if (file.type.startsWith('video/')) {
                    videoUrl = publicUrl;
                } else {
                    imageUrl = publicUrl;
                }
                console.log("Media uploaded successfully:", publicUrl);
            }

            // 2. Save trip data
            createBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> <span>Syncing Trip...</span>';
            console.log("Attempting to save trip to Supabase...");
            
            const tripData = {
                name: nameInput.value,
                description: descInput ? descInput.value : '',
                status: 'Upcoming',
                date: dateRangeLabel ? dateRangeLabel.innerText : 'TBD',
                image_url: imageUrl,
                video_url: videoUrl
            };

            const result = await saveTrip(tripData);
            
            if (result) {
                console.log("Trip saved successfully:", result);
                createBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> <span>Success!</span>';
                setTimeout(() => {
                    window.location.href = '../my_trips/code.html';
                }, 1000);
            } else {
                throw new Error("Database returned no data. Check your RLS policies.");
            }

        } catch (err) {
            console.error('CRITICAL ERROR during trip creation:', err);
            alert('Failed to create trip: ' + err.message + '\n\nCheck the browser console (F12) for details.');
            createBtn.innerHTML = originalText;
            createBtn.disabled = false;
        }
    });
}

// Logic for my_trips page
async function initMyTrips() {
    const tripsContainer = document.getElementById('trips-container');
    if (!tripsContainer) return;

    async function renderTrips() {
        const trips = await getTrips();
        if (trips.length === 0) return;

        // Clear and render newest first
        tripsContainer.innerHTML = '';
        trips.forEach(trip => {
            const card = createTripCard(trip);
            tripsContainer.appendChild(card);
        });
    }

    // Initial render
    await renderTrips();

    // Subscribe to realtime changes on the 'trips' table
    subscribeToTable('trips', () => {
        console.log('Refreshing trips due to realtime change...');
        renderTrips();
    });
}

// Helper to create a trip card (Premium UI)
function createTripCard(trip) {
    const div = document.createElement('div');
    div.className = "group bg-white rounded-2xl border border-divider-gray overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer mb-6";
    
    const mediaHtml = trip.video_url 
        ? `<video src="${trip.video_url}" class="w-full h-48 object-cover" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>`
        : `<img src="${trip.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500">`;

    div.innerHTML = `
        <div class="relative">
            ${mediaHtml}
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-heritage">
                ${trip.status || 'Upcoming'}
            </div>
        </div>
        <div class="p-5">
            <h3 class="text-lg font-bold text-deep-charcoal mb-1">${trip.name}</h3>
            <p class="text-sm text-neutral-charcoal line-clamp-2 mb-4">${trip.description || 'No description provided.'}</p>
            <div class="flex items-center justify-between pt-4 border-t border-divider-gray">
                <div class="flex items-center gap-2 text-outline">
                    <span class="material-symbols-outlined text-sm">calendar_today</span>
                    <span class="text-xs font-medium">${trip.date || 'TBD'}</span>
                </div>
                <button class="text-purple-heritage text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    `;
    return div;
}

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // 1. Initialize Page Features
    if (path.includes('plan_a_new_trip')) {
        initCreateTrip();
    } else if (path.includes('my_trips')) {
        initMyTrips();
    }

    // 2. Initialize UI Components
    if (typeof initThemeToggler === 'function') initThemeToggler();
    if (typeof initMacDock === 'function') initMacDock();

    // 3. Refresh avatar logic
    if (window.supabaseClient) {
        window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                const metadata = session.user.user_metadata;
                const profileImages = document.querySelectorAll('.bg-center.bg-no-repeat.aspect-square.bg-cover.rounded-full');
                profileImages.forEach(img => {
                    if (metadata.avatar_url) img.style.backgroundImage = `url('${metadata.avatar_url}')`;
                });
            }
        });
    }
});

// Add basic fade-in animation to all pages
const style = document.createElement('style');
style.innerHTML = `
    body {
        animation: fadeIn 0.4s ease-out forwards;
        opacity: 0;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);


function polygonCollapsed(cx, cy, vertexCount) {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`
  ).join(", ")
  return `polygon(${pairs})`
}

function getThemeTransitionClipPaths(variant, cx, cy, maxRadius, viewportWidth, viewportHeight) {
  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ]
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx)
      const halfH = Math.max(cy, viewportHeight - cy)
      const halfSide = Math.max(halfW, halfH) * 1.05
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "triangle": {
      const scale = maxRadius * 2.2
      const dx = (Math.sqrt(3) / 2) * scale
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`]
    }
    case "diamond": {
      const R = maxRadius * Math.SQRT2
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2
      const verts = []
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`)
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`]
    }
    case "rectangle": {
      const halfW = Math.max(cx, viewportWidth - cx)
      const halfH = Math.max(cy, viewportHeight - cy)
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.03
      const innerRatio = 0.42
      const starPolygon = (radius) => {
        const verts = []
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`
          )
          const innerA = outerA + Math.PI / 5
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
          )
        }
        return `polygon(${verts.join(", ")})`
      }
      const startR = Math.max(2, R * 0.025)
      return [starPolygon(startR), starPolygon(R)]
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ]
  }
}

function initThemeToggler() {
    const shape = "star"; // Using star as demo
    const duration = 600;
    const fromCenter = false;

    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
    }

    const buttons = document.querySelectorAll('.theme-toggle-btn');
    
    const updateIcons = () => {
        const isDark = document.documentElement.classList.contains("dark");
        buttons.forEach(btn => {
            const icon = btn.querySelector('.material-symbols-outlined');
            if(icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        });
    }
    
    updateIcons();

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains("dark");
            const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
            const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

            let x, y;
            if (fromCenter) {
                x = viewportWidth / 2;
                y = viewportHeight / 2;
            } else {
                const { top, left, width, height } = button.getBoundingClientRect();
                x = left + width / 2;
                y = top + height / 2;
            }

            const maxRadius = Math.hypot(
                Math.max(x, viewportWidth - x),
                Math.max(y, viewportHeight - y)
            );

            const applyTheme = () => {
                const newTheme = !isDark;
                if (newTheme) {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
                localStorage.setItem("theme", newTheme ? "dark" : "light");
                updateIcons();
            };

            if (typeof document.startViewTransition !== "function") {
                applyTheme();
                return;
            }

            const root = document.documentElement;
            root.dataset.magicuiThemeVt = "active";
            root.style.setProperty("--magicui-theme-toggle-vt-duration", `${duration}ms`);
            
            const cleanup = () => {
                delete root.dataset.magicuiThemeVt;
                root.style.removeProperty("--magicui-theme-toggle-vt-duration");
            };

            const transition = document.startViewTransition(() => {
                applyTheme();
            });

            if (typeof transition.finished?.finally === "function") {
                transition.finished.finally(cleanup);
            } else {
                cleanup();
            }

            const ready = transition.ready;
            if (ready && typeof ready.then === "function") {
                const clipPath = getThemeTransitionClipPaths(
                    shape,
                    x,
                    y,
                    maxRadius,
                    viewportWidth,
                    viewportHeight
                );
                ready.then(() => {
                    document.documentElement.animate(
                        { clipPath },
                        {
                            duration,
                            easing: shape === "star" ? "linear" : "ease-in-out",
                            fill: "forwards",
                            pseudoElement: "::view-transition-new(root)",
                        }
                    );
                });
            }
        });
    });
}



// MacOS Dock Magnification Logic
function initMacDock() {
    const dock = document.querySelector('.mac-dock');
    if (!dock) return;
    
    const dockItems = Array.from(dock.querySelectorAll('.dock-item'));
    const defaultSize = 40;
    const magnification = 60;
    const distanceLimit = 140;

    dockItems.forEach(item => {
        item.style.width = `${defaultSize}px`;
        item.style.height = `${defaultSize}px`;
        item.style.transition = 'width 0.15s ease-out, height 0.15s ease-out';
        
        const icon = item.querySelector('.material-symbols-outlined');
        if(icon) {
            icon.style.transition = 'transform 0.15s ease-out';
        }
    });

    dock.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;

        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - itemCenterX);

            let newSize = defaultSize;
            if (distance < distanceLimit) {
                const scale = 1 - (distance / distanceLimit);
                const easeScale = Math.sin(scale * Math.PI / 2);
                newSize = defaultSize + (magnification - defaultSize) * easeScale;
            }

            item.style.width = `${newSize}px`;
            item.style.height = `${newSize}px`;
            
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) {
                const iconScale = newSize / defaultSize;
                icon.style.transform = `scale(${iconScale})`;
            }
        });
    });

    dock.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
            item.style.width = `${defaultSize}px`;
            item.style.height = `${defaultSize}px`;
            
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// === SUPABASE CONFIGURATION ===
const SUPABASE_URL = "https://nbsxsoqcvwwjvcjykmce.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ic3hzb3Fjdnd3anZjanlrbWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTgwMDMsImV4cCI6MjA5Mzk3NDAwM30.eDOAWdOxLmlD_1902eSl75zeKk1M-evtPkrEUCyUSCY";

// 1. DYNAMICALLY LOAD SUPABASE SCRIPT (if not already present)
function loadSupabaseScript(callback) {
    if (window.supabase) { callback(); return; }
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = callback;
    document.head.appendChild(script);
}

// 2. INITIALIZE SUPABASE & AUTH LISTENER
loadSupabaseScript(() => {
    if (SUPABASE_URL !== "YOUR_SUPABASE_URL") {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Listen for user login state
        window.supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                const user = session.user;
                const metadata = user.user_metadata;
                
                // Update UI elements automatically (Avatars)
                const profileImages = document.querySelectorAll('.bg-center.bg-no-repeat.aspect-square.bg-cover.rounded-full');
                profileImages.forEach(img => {
                    if (metadata.avatar_url) {
                        img.style.backgroundImage = `url('${metadata.avatar_url}')`;
                    }
                });
                
                // Update Name on Profile page
                const profileNameHeader = document.querySelector('.text-2xl.font-bold');
                if (profileNameHeader && window.location.pathname.includes('profile')) {
                    profileNameHeader.innerText = metadata.full_name || user.email;
                }
            }
        });
    } else {
        console.warn("⚠️ Traveloop: Supabase is not configured yet! Please add your URL and Key in global.js");
    }
});
