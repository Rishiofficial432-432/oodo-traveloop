const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'trips.json');
const SERP_API_KEY = '7dd91fb973c8dc0a5fa88ac14b77d5cb40cd3ac7db265b0838cc37ed224dfd01';
const OTM_API_KEY = '5ae2e3f221c38a28845f05b6f1f08f53d3b955c5ec623e42c4be2fd6';

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Backend API Routes
app.get('/api/trips', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: 'Failed to read trips' });
    }
});

app.post('/api/trips', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const trips = JSON.parse(data);
        const newTrip = { ...req.body, id: Date.now().toString() };
        trips.push(newTrip);
        fs.writeFileSync(DB_FILE, JSON.stringify(trips, null, 2));
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save trip' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query is required' });
        
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                q: query,
                engine: 'google',
                api_key: SERP_API_KEY
            }
        });
        
        res.json(response.data);
    } catch (err) {
        console.error('Search error:', err.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/api/poi', async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) return res.status(400).json({ error: 'City is required' });

        // Step 1: Geocoding
        const geoResponse = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname`, {
            params: { name: city, apikey: OTM_API_KEY }
        });
        
        if (geoResponse.data.error || !geoResponse.data.lat) {
             return res.status(404).json({ error: 'City not found' });
        }
        
        const { lat, lon, name, country } = geoResponse.data;

        // Step 2: Get POIs
        const poiResponse = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
            params: {
                radius: 10000,
                lon: lon,
                lat: lat,
                rate: 3, // Popularity (1 to 3)
                limit: 12,
                format: 'json',
                apikey: OTM_API_KEY
            }
        });
        
        res.json({ city: name, country, pois: poiResponse.data });
    } catch (err) {
        console.error('OTM API error:', err.message);
        res.status(500).json({ error: 'Failed to fetch POIs' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend API and Frontend Server running at http://localhost:${PORT}`);
});

module.exports = app;
