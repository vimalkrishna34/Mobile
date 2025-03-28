const express = require('express');
const router = express.Router();
const mobile = require('../models/mobile');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// Add method override middleware
router.use(methodOverride('_method'));

// GET home page with all mobiles
router.get('/', async (req, res) => {
    try {
        const data = await mobile.find({});
        return res.render('home.ejs', { data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, brand, prise } = req.body;
        if (!name || !brand || !prise) {
            return res.status(400).render('add.ejs', { 
                error: 'All fields are required',
                formData: req.body
            });
        }

        await mobile.create({ name, brand, prise });
        return res.redirect('/');

} catch (err) {
module.exports = router;