var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('registeration');
});

router.get('/success', function (req, res, next) {
    res.render('registerSuccess');
});

module.exports = router;
