const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'trips.json');
const SERP_API_KEY = '7dd91fb973c8dc0a5fa88ac14b77d5cb40cd3ac7db265b0838cc37ed224dfd01';

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

app.listen(PORT, () => {
    console.log(`Backend API and Frontend Server running at http://localhost:${PORT}`);
});

module.exports = app;
