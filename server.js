const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'trips.json');

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

app.listen(PORT, () => {
    console.log(`Backend API and Frontend Server running at http://localhost:${PORT}`);
});
