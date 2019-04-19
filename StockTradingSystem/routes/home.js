var express = require('express');
var router = express.Router();

// 数据库连接
var dbConnection = require('../database/MySQLconnection');

// 引入自定义模块接口
var Accounts = require('../interfaces/accountsRelated');
var Money = require('../interfaces/moneyRelated');
var Stock = require('../interfaces/stockRelated');
var Instructions = require('../interfaces/instructionsRelated');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

router.get('/index', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/orderSubmit', function (req, res) {
    // 步骤一 检验指令和账户的有效性然后插入有效的指令数据
    var promise1 = new Promise(function (resolve, reject) {
        let returnState = false;
        let returnMessage = "";
        console.log(req.body);
        var accounts = new Accounts();
        accounts.getCapitalAccountState(parseInt(req.body.userId), function (result) {
            if (result !== 'normal') {
                returnMessage = "资金账户异常或不存在!";
                res.end(returnMessage);
                resolve(returnState);
            } else {
                accounts.getAccountidByCapitalAccountid(parseInt(req.body.userId), function (result) {
                    try {
                        let accountid = parseInt(result);
                        accounts.getAccountidState(accountid, function (result) {
                            if (result !== 'normal') {
                                returnMessage = "证券账户异常或不存在!";
                                res.end(returnMessage);
                                resolve(returnState);
                            } else {
                                var instructions = new Instructions();
                                if (req.body.tradeType === "sell") {
                                    accounts.getPersonidByAccountid(accountid, function (result) {
                                        try {
                                            let personid = parseInt(result);
                                            var stock = new Stock();
                                            stock.getStockNumberByPersonidAndStockid(personid, req.body.stockId, function (result) {
                                                try {
                                                    let stockNum = parseInt(result);
                                                    if (stockNum < parseInt(req.body.stockNum)) {
                                                        returnMessage = "证券账户对应股票持股数不足, 仅持有" + stockNum + "股!";
                                                        res.end(returnMessage);
                                                        resolve(returnState);
                                                    } else {
                                                        instructions.addInstructions("sell", personid, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result === "Add Failed!") {
                                                                returnMessage = "指令插入数据库时出现异常!";
                                                            } else {
                                                                returnState = true;
                                                                returnMessage = "股票出售指令发布成功!";
                                                            }
                                                            res.end(returnMessage);
                                                            resolve(returnState);
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.log(error.message);
                                                    returnMessage = "证券账户持股存在问题!";
                                                    res.end(returnMessage);
                                                    resolve(returnState);
                                                }
                                            });
                                        } catch (error) {
                                            console.log(error.message);
                                            returnMessage = "证券账户存在问题!";
                                            res.end(returnMessage);
                                            resolve(returnState);
                                        }
                                    });
                                } else {
                                    var money = new Money();
                                    money.getAvailableMoneyByCapitalAccountid(parseInt(req.body.userId), function (result) {
                                        try {
                                            let haveMoney = parseFloat(result);
                                            if (haveMoney < parseInt(req.body.stockNum)*parseFloat(req.body.pricePer)) {
                                                returnMessage = "资金账户可用资金不足, 仅剩" + haveMoney + "元!";
                                                res.end(returnMessage);
                                                resolve(returnState);
                                            } else {
                                                money.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), parseInt(req.body.stockNum)*parseFloat(req.body.pricePer), function (result) {
                                                    if (result === "Error!") {
                                                        returnMessage = "转账时出现异常!";
                                                        res.end(returnMessage);
                                                        resolve(returnState);
                                                    } else {
                                                        instructions.addInstructions("sell", personid, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result === "Add Failed!") {
                                                                returnMessage = "指令插入数据库时出现异常!";
                                                            } else {
                                                                returnState = true;
                                                                returnMessage = "股票购买指令发布成功!";
                                                            }
                                                            res.end(returnMessage);
                                                            resolve(returnState);
                                                        });
                                                    }
                                                });
                                            }
                                        } catch (error) {
                                            console.log(error.message);
                                            returnMessage = "资金账户可用资金存在问题!";
                                            res.end(returnMessage);
                                            resolve(returnState);
                                        }
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        console.log(error.message);
                        returnMessage = "资金账户不存在对应的证券账户!";
                        res.end(returnMessage);
                        resolve(returnState);
                    }
                });
            }
        });
    });
    // 步骤二 查询新入指令对应股票的全部出售指令
    var promise2 = new Promise(function (resolve, reject) {
        var instructions = new Instructions();
        instructions.getPartialInstructionsByStockid("sell", req.body.stockId, function (result) {
            resolve(result);
        });
    });
    // 步骤三 查询新入指令对应股票的全部购买指令
    var promise3 = new Promise(function (resolve, reject) {
        var instructions = new Instructions();
        instructions.getPartialInstructionsByStockid("buy", req.body.stockId, function (result) {
            resolve(result);
        });
    });
    // 执行代码
    promise1.then(function (reState) {
        if (reState) {
            promise2.then(function (result) {
                let asks = result;
                promise3.then(function (result) {
                    let bids = result;
                    console.log(asks);
                    console.log(bids);
                    //todo: 股票撮合代码填充处 建议使用promise强制执行顺序
                });
            });
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
    var accounts = new Accounts();
    accounts.getAccountidByPersonid(parseInt(req.body.userId), function (result) {
        let returnText = "" + result;
        res.end(returnText);
    });
});

module.exports = router;
