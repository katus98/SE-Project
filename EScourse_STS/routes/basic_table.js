var express = require('express');
var router = express.Router();
var dbConnetion = require('../database/db');

// just render
router.get('/', (req, res, next) => {
    if(req.session.user){
        res.render('basic_table');
    }
    else
    {
        res.redirect('login')
    }
});


String.prototype.format =function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};




module.exports = router;