// Define all database models in one place

const mongoose = require('mongoose');

// Product Model
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Order Model
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    products: [{
        productId: Number,
        productName: String,
        quantity: Number,
        price: Number,
        subtotal: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: { type: String, default: 'cash_on_delivery' },
    shippingAddress: String,
    notes: String,
    orderType: { type: String, enum: ['website', 'sms', 'phone'], default: 'website' },
    createdAt: { type: Date, default: Date.now }
});

// Customer Model (optional, for future expansion)
const customerSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    email: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    createdAt: { type: Date, default: Date.now }
});

// SMS Log Model
const smsLogSchema = new mongoose.Schema({
    phoneNumber: String,
    direction: { type: String, enum: ['incoming', 'outgoing'] },
    message: String,
    status: String,
    relatedOrder: String,
    createdAt: { type: Date, default: Date.now }
});

// Create models
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Customer = mongoose.model('Customer', customerSchema);
const SMSLog = mongoose.model('SMSLog', smsLogSchema);

module.exports = {
    Product,
    Order,
    Customer,
    SMSLog
};