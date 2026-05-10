// Database Operations using Supabase
async function getTrips() {
    try {
        const { data, error } = await window.supabaseClient
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Failed to fetch trips from Supabase:', err);
        return [];
    }
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

        // Change button to show loading state
        const originalText = createBtn.innerHTML;
        createBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> <span>Saving...</span>';
        createBtn.disabled = true;

        try {
            let imageUrl = '';
            let videoUrl = '';

            // 1. Upload media if present
            if (mediaInput.files.length > 0) {
                const file = mediaInput.files[0];
                const publicUrl = await uploadMedia(file);
                if (file.type.startsWith('video/')) {
                    videoUrl = publicUrl;
                } else {
                    imageUrl = publicUrl;
                }
            }

            // 2. Save trip data
            await saveTrip({
                name: nameInput.value,
                description: descInput ? descInput.value : '',
                status: 'Upcoming',
                date: dateRangeLabel.innerText,
                image_url: imageUrl,
                video_url: videoUrl
            });

            alert('Trip created successfully!');
            window.location.href = '../my_trips/code.html';
        } catch (err) {
            console.error('Error creating trip:', err);
            alert('Failed to create trip: ' + err.message);
        } finally {
            createBtn.innerHTML = originalText;
            createBtn.disabled = false;
        }
    });
}

// Logic for my_trips page
async function initMyTrips() {
    const tripsContainer = document.getElementById('trips-container');
    if (!tripsContainer) return;

    const trips = await getTrips();
    if (trips.length === 0) {
        return; // Use default hardcoded trips
    }

    // Append new trips to the container
    let html = '';
    // Reverse array to show newest first
    trips.slice().reverse().forEach(trip => {
        html += `
        <div class="bg-white rounded-xl border border-divider-gray shadow-[0px_3px_6px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.08)] mb-4" style="animation: fadeIn 0.5s ease-out forwards;">
            <div class="md:w-1/3 h-48 md:h-auto relative bg-pale-gray">
                <div class="absolute inset-0 bg-center bg-cover" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgbuAgBFgn56-QqFSl0ROg2JFO3KxIbZfHI0YeSksGnJpy1R09-3YGA-r-6q9QVa36vw-drNbQvepGX4sk2Bpx86x6Man3k4gauvU2DnsJ1ZHpLZng3soR1g-bSuCAamlVbfndpWidsawbiUgNjnGWvEpjNL860y75k2HRAUelqOiYn5M4tVyK8BRos3PUONQ5FtGQy0J4FCAqmkVMCr7rqB9XdgMpz-W1hC7t66UvjTugeF8LYB-M47Fb61qlqKjEW6Bs9Ta7PzI");'></div>
            </div>
            <div class="p-lg flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <h3 class="text-xl font-bold text-deep-charcoal">${trip.name}</h3>
                        <span class="bg-purple-heritage/10 text-purple-heritage px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">${trip.status}</span>
                    </div>
                    <p class="text-neutral-charcoal mt-2 flex items-center gap-2 text-sm">
                        <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                        ${trip.date}
                    </p>
                    <p class="text-neutral-charcoal mt-4 text-sm line-clamp-2">${trip.description || 'No description provided.'}</p>
                </div>
                <div class="mt-lg flex gap-3">
                    <button onclick="window.location.href='../itinerary_builder/code.html'" class="flex-1 bg-pale-gray text-purple-heritage font-bold py-2 rounded hover:bg-divider-gray transition-colors text-sm">Edit</button>
                    <button onclick="window.location.href='../traveloop_dashboard/code.html'" class="flex-1 bg-purple-heritage text-white font-bold py-2 rounded hover:bg-purple-dark transition-colors shadow-sm text-sm">View</button>
                </div>
            </div>
        </div>
        `;
    });
    // Add new trips to the top of the container
    tripsContainer.insertAdjacentHTML('afterbegin', html);
}

document.addEventListener('DOMContentLoaded', () => {
    initCreateTrip();
    initMyTrips();
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

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggler();
});

// MacOS Dock Magnification Logic
document.addEventListener('DOMContentLoaded', () => {
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
});

// === SUPABASE CONFIGURATION ===
const SUPABASE_URL = "https://nbsxsoqcvwwjvcjykmce.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0pbHnA-R_xySPtvY3uGZCA_nlzUefvq";

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
});// 3. AUTO-INITIALIZE FEATURES ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('plan_a_new_trip')) {
        initCreateTrip();
    } else if (path.includes('my_trips')) {
        initMyTrips();
    }
    
    // Refresh avatar logic if auth script already loaded
    if (window.supabaseClient) {
        window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                // Update UI elements manually once if listener missed it
                const metadata = session.user.user_metadata;
                const profileImages = document.querySelectorAll('.bg-center.bg-no-repeat.aspect-square.bg-cover.rounded-full');
                profileImages.forEach(img => {
                    if (metadata.avatar_url) img.style.backgroundImage = `url('${metadata.avatar_url}')`;
                });
            }
        });
    }
});
