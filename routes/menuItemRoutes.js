const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.post('/', async (req,res) => {
    try{
        const data = req.body;
        const newMenuItem = MenuItem(data);
        const response = await newMenuItem.save();

        console.log('Data saved', response);
        res.status(200).json(response);        
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : "Internal server error"});
    }
});

router.get('/', async (req,res) => {
    try{
        const data = await MenuItem.find();
        console.log('Data fetched');
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
});

router.get('/:taste', async (req,res) => {
    try{
        const taste = req.params.taste;
        if(taste == 'sweet' || taste == 'sour' || taste == 'spicy'){
            const data = await MenuItem.find({taste: taste});
            console.log('Data fetched');
            res.status(200).json(data);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
});

router.put('/:id', async (req,res) => {
    try{
        const menuId = req.params.id;
        const updatedData = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuId,updatedData, {
            new: true,
            runValidator: true,
        });

        if(!response){
            res.status(404).json({error: 'Menu Item not found'});
        }

        console.log('Data Updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    } 
});

router.delete('/:id', async (req,res) => {
    try{
        const menuId = req.params.id;

        const response = await MenuItem.findByIdAndDelete(menuId);

        if(!response){
            res.status(404).json({error: 'Menu Item not found'});
        }

        console.log('Data deleted');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
})

module.exports = router;