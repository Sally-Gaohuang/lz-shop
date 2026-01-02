// Main JavaScript for RIMAN Shop
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    updateCartCount();
});

// Sample products
const products = [
    {
        id: 1,
        name: "RIMAN Smart Watch Pro",
        description: "Advanced smartwatch with health monitoring",
        price: 249.99,
        image: "assets/images/watch.jpg",
        featured: true
    },
    {
        id: 2,
        name: "RIMAN Wireless Earbuds",
        description: "Noise-cancelling true wireless earbuds",
        price: 129.99,
        image: "assets/images/earbuds.jpg",
        featured: true
    },
    {
        id: 3,
        name: "RIMAN Power Bank",
        description: "Fast charging portable power bank",
        price: 39.99,
        image: "assets/images/powerbank.jpg",
        featured: false
    },
    {
        id: 4,
        name: "RIMAN Premium T-Shirt",
        description: "100% cotton premium fit t-shirt",
        price: 29.99,
        image: "assets/images/tshirt.jpg",
        featured: true
    }
];

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featured = products.filter(p => p.featured);
    
    container.innerHTML = featured.map(product => `
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

// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count, #cart-count');
    countElements.forEach(el => {
        el.textContent = cart.length;
    });
}

function showNotification(message) {
    alert(message); // Simple alert for now
}

// SMS function
function sendSMS() {
    const phoneNumber = "+15551234567";
    const message = "Hello! I want to order from RIMAN Shop";
    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    } else {
        alert(`Text "${message}" to ${phoneNumber}`);
    }
}

// Make functions global
window.addToCart = addToCart;
window.sendSMS = sendSMS;
window.showNotification = showNotification;
