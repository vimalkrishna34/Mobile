const express = require('express');
const router = express.Router();
const mobile = require('../models/mobile');

// GET all mobiles
router.get('/', async (req, res) => {
    try {
        const data = await mobile.find({});
        return res.render('home.ejs', { data: data });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

// ADD new mobile
router.post('/add', async (req, res) => {
    try {
        const { name, brand, prise } = req.body;
        if (!name || !brand || !prise) return res.send('Something is missing');

        await mobile.create({ name, brand, prise });
        return res.send('Done');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

// UPDATE a mobile
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, prise } = req.body;

        const updatedMobile = await mobile.findByIdAndUpdate(id, { name, brand, prise }, { new: true });
        if (!updatedMobile) return res.send('Mobile not found');

        return res.send('Updated successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

// DELETE a mobile
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMobile = await mobile.findByIdAndDelete(id);
        if (!deletedMobile) return res.send('Mobile not found');

        return res.send('Deleted successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

// GET mobile by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mobileData = await mobile.findById(id);
        if (!mobileData) return res.send('Mobile not found');

        return res.render('details.ejs', { data: mobileData });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server error');
    }
});

module.exports = router;