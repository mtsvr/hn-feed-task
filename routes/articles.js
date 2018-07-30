const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Article = require('../models/Article');

router.delete('/:id',function(req,res){
    console.log('this is supposed to delete stuff');
})

module.exports = router;