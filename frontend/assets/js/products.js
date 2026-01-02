// Products page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadAllProducts();
    setupFilters();
});

// Load all products
function loadAllProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const allProducts = [
        ...products,
        {
            id: 5,
            name: "RIMAN Backpack",
            description: "Waterproof laptop backpack",
            price: 59.99,
            image: "assets/images/backpack.jpg",
            category: "accessories"
        },
        {
            id: 6,
            name: "RIMAN Desk Lamp",
            description: "LED adjustable desk lamp",
            price: 34.99,
            image: "assets/images/lamp.jpg",
            category: "home"
        },
        {
            id: 7,
            name: "RIMAN Water Bottle",
            description: "Insulated stainless steel bottle",
            price: 24.99,
            image: "assets/images/bottle.jpg",
            category: "home"
        }
    ];
    
    container.innerHTML = allProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}'">
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button onclick="addToCart(${product.id})" class="btn btn-primary">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

// Filter products
function filterProducts() {
    console.log('Filtering products...');
    // Filter logic here
}

// Import products from main.js
const products = window.products || [];
