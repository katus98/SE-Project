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
                    if (result === "1") {
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
                                        stock.convertStockToFrozenStock(result0.personId, req.body.stockId, parseInt(req.body.stockNum), function (result) {
                                            if (result === true) {
                                                instructions.addTempInstructions('sell', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                    if (result.status === false) {
                                                        res0.remark = "指令存在问题：" + result.info;
                                                    } else {
                                                        res0.result = true;
                                                        res0.remark = "股票出售指令发布成功!";
                                                    }
                                                    resolve(res0);
                                                });
                                            } else {
                                                res0.remark = "股票冻结失败!";
                                                resolve(res0);
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            capitalAccount.getCapitalByCapitalAccountId(parseInt(req.body.userId), function (result) {
                                if (result.result === false) {
                                    res0.remark = result.remark;
                                    resolve(res0);
                                } else {
                                    let availableMoney = result.availableMoney;
                                    let moneyThisTime = parseInt(req.body.stockNum)*parseFloat(req.body.pricePer);
                                    if (availableMoney < moneyThisTime) {
                                        res0.remark = "资金账户可用资金不足, 仅剩" + availableMoney + "元!";
                                        resolve(res0);
                                    } else {
                                        // 买家资金流水记录
                                        capitalAccount.ioAndInterest(parseInt(req.body.userId), -moneyThisTime, "股票购买支出", function (result) {
                                            if (result === true) {
                                                capitalAccount.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), moneyThisTime, function (result) {
                                                    if (result === true) {
                                                        instructions.addTempInstructions('buy', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result.status === false) {
                                                                res0.remark = "指令存在问题：" + result.info;
                                                            } else {
                                                                res0.result = true;
                                                                res0.remark = "股票出售指令发布成功!";
                                                            }
                                                            resolve(res0);
                                                        });
                                                    } else {
                                                        res0.remark = "转账失败！";
                                                        resolve(res0);
                                                    }
                                                });
                                            } else {
                                                res0.remark = "Error: 买家资金流水记录失败！";
                                                console.log(res0.remark);
                                                resolve(res0);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else if (result === "0") {
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
            console.log("指令加入缓存成功！");
        }
    });
});

router.post('/querySell', function (req, res) {
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

router.post('/queryTemp', function (req, res) {
    let getSql = "SELECT * FROM tempinstructions";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

router.post('/start', function (req, res) {
    let match = new Match();
    match.startMatching(function (result) {
        res.end("Start successfully!");
        match.convertTempInstructionsToInstructions(function (result) {
            //res.end(result.remark);
        });
    });
});

router.post('/stop', function (req, res) {
    let match = new Match();
    match.stopMatching(function (result) {
        res.end("Stop successfully!");
    });
});

module.exports = router;
