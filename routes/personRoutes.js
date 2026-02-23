const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware,generateToken} = require('../jwt');

router.post('/signup', async (req,res) => {
    try{
        const data = req.body;
        const newPerson = Person(data);
        const response = await newPerson.save();

        console.log('Data saved', response);
        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload);
        res.status(200).json({response:response, token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Interval server error'});
    }
});

router.post('/login', async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await Person.findOne({username: username});

        if(!user ||! (await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid username or password'});
        }

        const payload = {
            id: user.id,
            username: user.username
        };

        const token = generateToken(payload);
        res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Interval server error'});
    }
})

router.get('/profile',jwtAuthMiddleware, async(req,res) => {
    try{
        const userData = req.user;
        const userId = userData.id;

        const response = await Person.findById(userId);
        res.status(200).json({response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Interval server error'});
    }
})

router.get('/',jwtAuthMiddleware, async (req,res) => {
    try{
        const data = await Person.find();
        console.log('Data fetched');
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
});

router.get('/:workType', async (req,res) => {
    try{
        const workType = req.params.workType;
        if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){
            const response = await Person.find({work: workType});
            console.log('Response fetched');
            res.status(200).json(response);
        }
        else{
            res.status(404).json({error : 'Invalid work type'});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
});

router.put('/:id', async (req,res) => {
    try{
        const personId = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId,updatedPersonData, {
            new: true,
            runValidators: true,
        });

        if(!response){
            res.status(404).json({error: 'Person not found'});
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
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);

        if(!response){
            res.status(404).json({error: 'Person not found'});
        }

        console.log('Data deleted');
        res.status(200).json({message: 'Person deleted successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
})

module.exports = router;