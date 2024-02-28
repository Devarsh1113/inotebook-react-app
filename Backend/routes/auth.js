const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const User = require('../models/User');
//Create a User using:POST "/api/auth". DOes not require authentication.
router.post('/createuser',[
    body('email','Enter a Valid Email!').isEmail(), 
    body('name','Enter a Valid Name!').isLength({min:3}),
    body('password', 'Password must be atleast 5 letters!!').isLength({min:5})
   
], async (req,res)=>{
    // If there are errors, returns Bad Request and the Errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // Check whether the user with the same email exists already
    try{
        let user = await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({error: "User with this Email already Exists!!"})
        }
        // Create a New User!
    user = await  User.create({
        name: req.body.name,
        password:req.body.password,
        email: req.body.email,
    })
    res.json(user)
    }
    catch(error){
      console.error(error.message); 
      res.status(500).send("Some Error has Occured!!");   
    }
})
module.exports = router