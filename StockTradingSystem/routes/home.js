var express = require('express');
var router = express.Router();

// 数据库连接
var dbConnection = require('../database/MySQLconnection');

// 引入自定义模块接口
let SecuritiesAccount = require('../sqlClasses/SecuritiesAccount');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let Stock = require('../sqlClasses/Stock');
let Instructions = require('../sqlClasses/Instructions');

let User = require('../publicFunctionInterfaces/Users');
let Match = require('../publicFunctionInterfaces/Match');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
    let match = new Match();
    setInterval(match.convertTempInstructionsToInstructions(function (result) {
        if (result === true) {
            console.log("加入成功！撮合成功！");
        } else {
            console.log("加入或者撮合失败！");
        }
    }), 5000);
});

router.get('/index', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/orderSubmit', function (req, res) {
    let promise1 = new Promise(function (resolve, reject) {
        let res0 = {result: false, remark: ""};
        let user = new User();
        user.checkAllAccountValidity(parseInt(req.body.userId), function (result0) {
            if (result0.result === true) {
                let stock = new Stock();
                stock.getStockPermissionByStockId(req.body.stockId, function (result) {
                    if (result === "true") {
                        let instructions = new Instructions();
                        let capitalAccount = new CapitalAccount();
                        if (req.body.tradeType === "sell") {
                            stock.getStockNumberByPersonIdAndStockId(result0.personId, req.body.stockId, function (result) {
                                if (result === 'notFound') {
                                    res0.remark = "证券账户持股存在问题！";
                                    resolve(res0);
                                } else {
                                    let stockNum = parseInt(result);
                                    if (stockNum < parseInt(req.body.stockNum)) {
                                        res0.remark = "证券账户对应股票持股数不足, 仅持有" + stockNum + "股!";
                                        resolve(res0);
                                    } else {
                                        instructions.addTempInstructions('sell', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                            if (result === false) {
                                                res0.remark = "指令插入数据库时出现异常!";
                                            } else {
                                                res0.result = true;
                                                res0.remark = "股票出售指令发布成功!";
                                            }
                                            resolve(res0);
                                        });
                                    }
                                }
                            });
                        } else {
                            capitalAccount.getAvailableMoneyByCapitalAccountId(parseInt(req.body.userId), function (result) {
                                if (result === 'notFound') {
                                    res0.remark = "资金账户可用资金存在问题！";
                                    resolve(res0);
                                } else {
                                    let availableMoney = parseFloat(result);
                                    let moneyThisTime = parseInt(req.body.stockNum)*parseFloat(req.body.pricePer);
                                    if (availableMoney < moneyThisTime) {
                                        res0.remark = "资金账户可用资金不足, 仅剩" + availableMoney + "元!";
                                        resolve(res0);
                                    } else {
                                        capitalAccount.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), moneyThisTime, function (result) {
                                            if (result === true) {
                                                instructions.addTempInstructions('buy', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                    if (result === false) {
                                                        res0.remark = "指令插入数据库时出现异常!";
                                                    } else {
                                                        res0.result = true;
                                                        res0.remark = "股票购买指令发布成功!";
                                                    }
                                                    resolve(res0);
                                                });
                                            } else {
                                                res0.remark = "转账失败！";
                                                resolve(res0);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else if (result === "false") {
                        res0.remark = "该股票不允许交易！";
                        resolve(res0);
                    } else {
                        res0.result = "股票不存在！";
                        resolve(res0);
                    }
                });
            } else {
                res0.remark = result0.remark;
                resolve(res0);
            }
        });
    });
    promise1.then(function (res0) {
        res.end(res0.remark);
        if (res0.result === true) {
            //todo: 撮合系统唤醒
            console.log("指令加入缓存成功！");
        }
    });
});

router.post('/queryCell', function (req, res) {
    let getSql = "select * from asks";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

router.post('/queryBuy', function (req, res) {
    let getSql = "SELECT * FROM bids";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

router.post('/test', function (req, res) {
    // var accounts = new Accounts();
    // accounts.getAccountidByPersonid(parseInt(req.body.userId), function (result) {
    //     let returnText = "" + result;
    //     res.end(returnText);
    // });
});

module.exports = router;
