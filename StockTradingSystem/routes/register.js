var express = require('express');
var router = express.Router();

var OpenSecuritiesAccount = require('../sqlClasses/OpenSecuritiesAccount');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('registeration');
});

router.get('/success', function (req, res, next) {
    res.locals.securitiesAccountId = req.query.securitiesAccountId;
    res.locals.capitalAccountId = req.query.capitalAccountId;
    res.locals.personId = req.query.personId;
    res.locals.name = req.query.name;
    res.locals.type = req.query.type;
    res.render('registerSuccess');
});

router.post('/register', function (req, res, next) {
    let result0 = {result: false, securitiesAccountId: '', capitalAccountId: 2019101, personId: '', name: '', type: '自然人', remark: ''};
    let openSecuritiesAccount = new OpenSecuritiesAccount();
    openSecuritiesAccount.currentpaccount(function (result) {
        openSecuritiesAccount.insertpaccount(result, req, function (result2) {
            if (result2 === -1) {
                result0.remark = '您的证券账户已经冻结，可以补办，但不能够重复开户；如有补办需求，请到线下证券交易事务所进行。';
            } else if (result2 === -2) {
                result0.remark = '您已经具有证券账户，不能够重新开户';
            } else {
                console.log("cc");
                openSecuritiesAccount.initstockhold(result.p, function(result3){
                    //res.end("开户成功。"+"\n"+"您的股票账户号码为："+result.a+"\n");
                    result0.securitiesAccountId = result.a;
                    result0.personId = result.p;
                    result0.name = req.body.name;
                    //todo
                    result0.result = true;
                    result0.remark = '开户成功，2秒后页面跳转!';
                });
            }
            res.end(JSON.stringify(result0));
        });
    });
    //res.end(JSON.stringify(result0));
});

module.exports = router;
