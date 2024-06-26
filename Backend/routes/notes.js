const express = require('express');
const router = express.Router();

const fetchuser = require("../middleware/fetchuser")
const Notes = require('../models/Notes')
//ROUTE-1:  Get all the Notes from the Logged In User using : GET "/api/auth/fetchallnotes".
router.get('/fetchallnotes', fetchuser , async (req,res)=>
{
    const notes = await Notes.find({user:req.user.id});
    
    res.json(notes)
})
module.exports = router 