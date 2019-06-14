var express = require('express');
// Router-level middleware
var router = express.Router();


router.get('/', function(req, res, next) {
    if(req.session.user)
    //if(1)
    {
        res.render('home');
    }
    else
    {
        res.redirect('login')
    }


});

module.exports = router;
