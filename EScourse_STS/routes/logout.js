var express = require('express');
var router = express.Router();
// var dbConnetion = require('../database/db');
// var session = require('express-session');



router.post('/', (req, res, next) => {
    req.session.destroy(function(){
        res.send({ status: 1, session:req.session});

    });
    console.log('session destroyed!!!');
});


module.exports = router;
