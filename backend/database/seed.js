// Database seeding script
const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = [
    {
        id: 1,
        name: "RIMAN Smart Watch Pro",
        description: "Advanced smartwatch with health monitoring",
        price: 249.99,
        category: "electronics",
        image: "assets/images/watch.jpg",
        stock: 50,
        featured: true
    },
    {
        id: 2,
        name: "RIMAN Wireless Earbuds",
        description: "Noise-cancelling true wireless earbuds",
        price: 129.99,
        category: "electronics",
        image: "assets/images/earbuds.jpg",
        stock: 75,
        featured: true
    },
    {
        id: 3,
        name: "RIMAN Power Bank 10000mAh",
        description: "Fast charging portable power bank",
        price: 39.99,
        category: "electronics",
        image: "assets/images/powerbank.jpg",
        stock: 100,
        featured: false
    },
    {
        id: 4,
        name: "RIMAN Premium T-Shirt",
        description: "100% cotton premium fit t-shirt",
        price: 29.99,
        category: "fashion",
        image: "assets/images/tshirt.jpg",
        stock: 200,
        featured: true
    },
    {
        id: 5,
        name: "RIMAN Backpack",
        description: "Waterproof laptop backpack",
        price: 59.99,
        category: "accessories",
        image: "assets/images/backpack.jpg",
        stock: 60,
        featured: false
    },
    {
        id: 6,
        name: "RIMAN Desk Lamp",
        description: "LED adjustable desk lamp",
        price: 34.99,
        category: "home",
        image: "assets/images/lamp.jpg",
        stock: 80,
        featured: true
    },
    {
        id: 7,
        name: "RIMAN Water Bottle",
        description: "Insulated stainless steel bottle",
        price: 24.99,
        category: "home",
        image: "assets/images/bottle.jpg",
        stock: 150,
        featured: false
    },
    {
        id: 8,
        name: "RIMAN Bluetooth Speaker",
        description: "Portable waterproof speaker",
        price: 79.99,
        category: "electronics",
        image: "assets/images/speaker.jpg",
        stock: 45,
        featured: true
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/riman-shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to database for seeding...');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert seed data
        await Product.insertMany(seedProducts);
        console.log('Products seeded successfully!');
        
        // Disconnect
        await mongoose.disconnect();
        console.log('Database seeding completed.');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

console.log('✅ Seed script loaded');
console.log('⚠️  No database seeding needed for now - using in-memory data');

// Run the seed function
seedDatabase();