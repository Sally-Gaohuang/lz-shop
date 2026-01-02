const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/riman-shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected');
}).catch(err => {
    console.log('❌ MongoDB Connection Error:', err);
});

// Sample product data
const products = [
    {
        id: 1,
        name: "RIMAN Smart Watch Pro",
        description: "Advanced smartwatch with health monitoring",
        price: 249.99,
        category: "electronics",
        image: "assets/images/watch.jpg",
        featured: true
    },
    {
        id: 2,
        name: "RIMAN Wireless Earbuds",
        description: "Noise-cancelling true wireless earbuds",
        price: 129.99,
        category: "electronics",
        image: "assets/images/earbuds.jpg",
        featured: true
    },
    {
        id: 3,
        name: "RIMAN Power Bank",
        description: "Fast charging portable power bank",
        price: 39.99,
        category: "electronics",
        image: "assets/images/powerbank.jpg",
        featured: false
    }
];

// API Routes
// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
    const featured = products.filter(p => p.featured);
    res.json(featured);
});

// Create order
app.post('/api/orders', (req, res) => {
    const order = req.body;
    console.log('New order received:', order);
    
    // Generate order ID
    const orderId = 'RIMAN-' + Date.now();
    
    res.json({
        success: true,
        message: 'Order received',
        orderId: orderId
    });
});

// Handle SMS webhook
app.post('/api/sms-webhook', (req, res) => {
    const { phoneNumber, message } = req.body;
    console.log('SMS received from', phoneNumber, ':', message);
    
    res.json({
        success: true,
        message: 'SMS received'
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Open: http://localhost:${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api/products`);
});