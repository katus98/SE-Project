var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('registeration');
});

router.get('/success', function (req, res, next) {
    res.render('registerSuccess', {result: true, securitiesAccountId: '0000000001', capitalAccountId: 2019101, personId: '00000000001', name: '王章野', type: '自然人'});
});

router.post('/register', function (req, res, next) {
    let result0 = {result: true, securitiesAccountId: '0000000001', capitalAccountId: 2019101, personId: '00000000001', name: '王章野', type: '自然人'};
    //todo
    res.end(JSON.stringify(result0));
    //res.redirect('/success');
});

module.exports = router;
