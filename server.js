const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use('/uploads', express.static(uploadDir));

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle File Uploads
app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

app.listen(PORT, () => {
    console.log(`🚀 Traveloop Upload Server running at http://localhost:${PORT}`);
    console.log(`📁 Media will be saved to: ${uploadDir}`);
});
