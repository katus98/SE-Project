var express = require('express');
var router = express.Router();

// 数据库连接
var dbConnection = require('../database/MySQLquery');

// 引入自定义模块接口
var capitalUsers = require('../interfaces/capitalUsers');
var capitalAccountUsers = require('../interfaces/capitalAccountUsers');

// 登录页面
router.get('/', function(req, res, next) {
    res.render('userLogin');
});

// 用户主页
router.get('/userHome', function(req, res, next) {
    if (req.session.islogin) {
        let getSql = 'SELECT * FROM capitalaccount WHERE capitalaccountid = ' + req.session.capitalaccountid;
        dbConnection(getSql,[], function(err, result){
            res.render('userHome',{ all: ("" + (result[0].availablemoney+result[0].interestremained+result[0].frozenmoney).toFixed(2)) , interest: ("" + result[0].interestremained.toFixed(2)) , frozen:("" + result[0].frozenmoney.toFixed(2)), remained: ("" + result[0].availablemoney.toFixed(2)), accountid: ("" + result[0].capitalaccountid)});
        });
    } else {
        res.redirect("/userLogin");
    }
});

// 各种操作页面
router.get('/userHome/Deposit', function(req, res, next) {
    if (req.session.islogin) {
        res.render('userDeposit', {
            capitalaccountid : req.session.capitalaccountid, 
            accountid : ("" + req.session.capitalaccountid)
        });
    } else {
        res.redirect("/userLogin");
    }
});

router.get('/userHome/Withdraw', function(req, res, next) {
    if (req.session.islogin) {
        res.render('userWithdraw', {
            capitalaccountid : req.session.capitalaccountid,
            accountid : ("" + req.session.capitalaccountid)
        });
    }
    else{
        res.redirect("/userLogin");
    }
});

router.get('/userHome/CapitalDetails',function(req, res, next){
    if(req.session.islogin) {
        res.render('userCapitalDetails', {
            capitalaccountid: req.session.capitalaccountid,
            accountid: ("" + req.session.capitalaccountid)
        });
    }
    else{
        res.redirect("/userLogin");
    }
});

// 资金账户用户登录
router.post('/capitalUsersLogin', function (req, res) {
    try {
        var users = new capitalUsers();
        users.login(parseInt(req.body.capitalaccountid),req.body.cashpassWord, function (result) {
            let returnText = "" + result;
            req.session.islogin=true;
            req.session.capitalaccountid =req.body.capitalaccountid;
            res.end(returnText);
        });
    }
    catch (error) {
        let returnMessage = ""+ error.message;
        res.end(returnMessage);
    }
});

// 资金转入
router.post('/capitalAccountFundIn', function (req, res) {
    try {
        var users = new capitalAccountUsers();
        var param = req.session.capitalaccountid;
        /*
        var type=req.body.currencytype;
        var amount=req.body.depositamount;
        switch(type){
            case "RMB":
                amount=amount*1.0000;
                break;
            case "USD":
                amount=amount*6.8217;
                break;
            case "CAD":
                amount=amount*5.0863;
                break;
            case "AUD":
                amount=amount*4.7752;
                break;
            case "EUR":
                amount=amount*7.6628;
                break;
            case "GBP":
                amount=amount*8.8634;
                break;
            case "HKD":
                amount=amount*0.8692;
                break;
            case "JPY":
                amount=amount*0.0620;
                break;
            default:
                console.log("Default!");
        }
        */
        users.FundIn(param,req.body.cashpassWord,req.body.currencytype,parseFloat(req.body.depositamount), function (result) {
            let returnText = "" + result;
            res.end(returnText);
        });
    }
    catch (error) {
        let returnMessage = ""+ error.message;
        res.end(returnMessage);
    }
});

// 资金转出
router.post('/capitalAccountFundOut', function (req, res) {
    try {
        var users = new capitalAccountUsers();
        // 注意下参数
        users.FundOut(parseInt(req.session.capitalaccountid),req.body.cashpassWord,parseFloat(req.body.withdrawamount), function (result) {
            let returnText = "" + result;
            res.end(returnText);
        });
    }
    catch (error) {
        let returnMessage = ""+ error.message;
        res.end(returnMessage);
    }
});

// 查询收支记录
router.post('/capitalDetails', function (req, res) {

    try {
        var param=req.session.capitalaccountid;
        var users = new capitalAccountUsers();
        // 注意下参数
        users.ViewAcountIOInformation(param, function (result) {
            console.log(result);
            res.end(JSON.stringify(result));
        });
    }
    catch (error) {
        let returnMessage = ""+ error.message;
        res.end(returnMessage);
    }
});

// 资金账户用户退出
router.post('/capitalUsersLogout', function (req, res) {
    console.log("ok");
    /*
    req.session.destroy(function(err) {
        if(err){
            return;
        }        
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        //res.redirect('/');
        res.end("退出资金账户系统成功！");
    });
    */
    req.session.islogin = false;
    res.end("退出资金账户系统成功！");
});

module.exports = router;
