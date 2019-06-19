var express = require('express');
// Router-level middleware
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/login');
});

module.exports = router;
