const express = require('express');
const app = express();
const port = 3009;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');

// Database connection
async function databaseConnection(url) {
    try {
        await mongoose.connect(url);
        console.log('Database connected successfully');
    } catch (err) {
        console.log(err);
    }
}
databaseConnection('mongodb://localhost:27017/connect1');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'assests')));

// Routes
const staticRoutes = require('./routes/staticRoutes');
app.use('/', staticRoutes);

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`Server running on port: ${port}`);
});