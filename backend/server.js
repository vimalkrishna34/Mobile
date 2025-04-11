const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

// Initialize Express app
const app = express();
console.log("🚀 MobileHub server starting...");

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gadgetTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mobilehub_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

// Models
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, default: 1 }
    }],
    createdAt: { type: Date, default: Date.now }
});
const Cart = mongoose.model('Cart', cartSchema);

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Import routes
const routes = require('../backend/routes/routes')(app, {
    User,
    Cart,
    ContactMessage,
    bcrypt,
    requireAuth
});

// Error Handlers
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found - MobileHub', 
        user: req.session.user 
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { 
        title: 'MobileHub Server Error', 
        user: req.session.user 
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MobileHub server running on http://localhost:${PORT}`);
});

module.exports = {
    User,
    Cart,
    ContactMessage
};