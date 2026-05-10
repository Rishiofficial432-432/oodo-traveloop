# 🌍 Traveloop - Premium AI Travel Planner

Traveloop is a high-performance, full-stack travel discovery and planning application. It combines a luxury user interface with real-time data from global search APIs to provide an immersive trip-planning experience.

## 🚀 Key Features

### 1. Immersive Hero Landing
*   **4K Video Background:** A web-optimized, high-resolution video loop for a premium first impression.
*   **Animated macOS Dock:** A custom-built, vanilla JS navigation dock with real-time magnification and hover effects.

### 2. Intelligent Exploration
*   **Web Search (SerpAPI):** Real-time web search integration to find travel blogs, news, and hidden gems.
*   **POI Discovery (OpenTripMap):** Find points of interest (museums, parks, historical sites) in any city with detailed categories.
*   **Interactive UI:** Seamless toggle between web search and city discovery modes.

### 3. Advanced Authentication
*   **Firebase Google Auth:** Secure, one-click login using Google accounts.
*   **Dynamic Profiles:** Automatically fetches and displays user profile pictures and names from Google across all app screens.
*   **Redirect Logic:** Optimized for mobile and strict browsers to bypass popup blockers.


### 4. Travel Management
*   **Itinerary Builder:** Plan your days with a modern, structured layout.
*   **My Trips Hub:** A central location to view upcoming and past adventures.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | TailwindCSS (via CDN), Google Fonts (Inter) |
| **Backend** | Node.js, Express (API Proxy) |
| **Auth** | Firebase Authentication (v9 Compat) |
| **Search APIs** | SerpAPI (Google Search), OpenTripMap |
| **Deployment** | Vercel (Serverless Functions + Static Assets) |

## 🏗️ Project Architecture

*   **`server.js`**: The Node.js entry point. It handles API requests securely, keeping secret keys hidden from the frontend.
*   **`global.js`**: The "brain" of the frontend. It handles navigation animations (Dock), Firebase initialization, and global UI updates.
*   **`/assets`**: Stores optimized media files like the 18MB background video.
*   **`vercel.json`**: Configures the cloud deployment rules for hosting the backend and frontend together.

## 🛠️ Setup & Configuration

To run Traveloop locally:
1. Clone the repository.
2. Run `npm install`.
3. Add your API keys (SerpAPI, OpenTripMap) to your environment variables.
4. Update the `firebaseConfig` in `global.js` with your Firebase project keys.
5. Run `node server.js` to start the backend proxy.

---
*Created with ❤️ by the Traveloop Team.*
