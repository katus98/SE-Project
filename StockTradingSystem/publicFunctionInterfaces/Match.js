// 数据库连接
let dbConnection = require('../database/MySQLconnection');

// 引用的自定义模块类
let Instructions = require('../sqlClasses/Instructions');
let Stock = require('../sqlClasses/Stock');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let User = require('../publicFunctionInterfaces/Users');

/*
* Match类：包含方法：指令撮合
* 维护小组：D组
* 总负责人：孙克染
* 备注：禁止D组外其他小组调用！
* */
function Match() {
    /*
    方法名称：convertTempInstructionsToInstructions
    实现功能：将缓存的优先级最高的指令加入指令表
    传入参数：回调函数
    回调参数：res = {result: false, remark: ""}
    编程者：孙克染
    备注：串行调用！
    * */
    this.convertTempInstructionsToInstructions = function (callback) {
        let res = {result: false, remark: ""};
        let instructions = new Instructions();
        instructions.getTheFirstTempInstructionInfo(function (result) {
            if (result.length > 0) {
                Match.addInstructions(result[0].tradetype, result[0].uid, result[0].code, result[0].shares, result[0].price, function (result) {
                    if (result.addResult === true) {
                        res.remark = "加入指令完成！";
                    } else {
                        res.remark = "加入指令失败！";
                    }
                    if (result.matchResult === true) {
                        res.remark += "撮合成功！";
                    } else {
                        res.remark += "撮合失败！";
                    }
                    res.result = result.addResult && result.matchResult;
                    callback(res);
                });
            } else {
                res.remark = "没有缓存指令！";
                res.result = true;
                callback(res);
            }
        });
    };
    /*
    方法名称：addInstructions
    实现功能：插入交易指令
    传入参数：tradeType（'sell', 'buy'）、personId（整数）、stockId（字符串）、shares（整数）、pricePer（浮点数）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染、陈玮烨
    * */
    Match.addInstructions = function (tradeType, personId, stockId, shares, price, callback) {
        let res = {addResult: false, matchResult: false};
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'asks(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'bids(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [personId, stockId, shares, price, shares];
        //// cwy修改：添加参数
        dbConnection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: addInstructions");
                console.log('[INSERT ERROR] - ', err.message);
                callback(res);
                return;
            }
            const istID = result.insertId;    // 需要记录刚刚插入的指令的编号
            res.addResult = true;
            Match.match(istID, tradeType, shares, price, stockId, personId, function (result) {
                res.matchResult = result;
                callback(res);
            });
        });
    };
    /*
    方法名称：match
    实现功能：撮合新加入的交易指令
    传入参数：istID、tradeType、shares、price、code、personId、回调函数
    回调参数：bool: true, false
    编程者：孙克染、杨清杰、张梓欣、陈玮烨
    备注：仅限于加入指令时调用！串行调用！
    * */
    Match.match = function (istID, tradeType, shares, price, code, personId, callback) {
        let promise = new Promise(function (resolve, reject) {
            let resu = {result: false, continueOrNot: false, remark: "", remainShares: 0};
            let instruction = new Instructions();
            let hasDoneShares = 0;
            //由于传入的指令是买/卖，要将其转换成相反的来匹配getthemostmatch中的tradetype
            let  tradeType1;
            if (tradeType === 'sell') {
                tradeType1 = 'buy';
            } else {
                tradeType1 = 'sell';
            }
            //涨跌停限制
            let stock = new Stock();
            let capitalAccount = new CapitalAccount();
            let user = new User();
            instruction.getTheMostMatch(tradeType1, code, price, function (res) {
                stock.getStockInfoByStockId(code,function (res2) {
                    if (res.result !== false) {
                        let bidId, askId;
                        let bidPrice, askPrice;
                        let matchPrice;

                        //sellid永远是卖，buyid永远是买
                        let sellPersonId, buyPersonId;

                        //撮合价格
                        matchPrice = (price + res.price) / 2;

                        //已经完成的股票
                        hasDoneShares = Math.min(res.shares2trade, shares);

                        //股票交易上下线，涨跌停限制res2[0].percentagepricechange以内的可以成交
                        let high = (res2[0].last_endprice) * (res2[0].percentagepricechange + 1);
                        let low = res2[0].last_endprice * (1 - res2[0].percentagepricechange);

                        //股票撮合价格要求在上下限内
                        if (matchPrice > high) {
                            matchPrice = high;
                        } else if (matchPrice < low) {
                            matchPrice = low;
                        }

                        if (tradeType === 'sell') {
                            //传入指令是卖
                            sellPersonId = personId;
                            buyPersonId = res.personId;
                            askId =  istID;
                            bidId =  res.id;
                            askPrice = price;
                            bidPrice = res.price;

                        } else {
                            //传入指令是买
                            sellPersonId = res.personId;
                            buyPersonId = istID;
                            askId = res.id;
                            bidId = istID;
                            askPrice = res.price;
                            bidPrice = price;
                        }
                        let buyCapitalAccountId, sellCapitalAccountId;
                        // 获取买家资金账户ID
                        user.getCapitalAccountIdByPersonId(buyPersonId, function (result) {
                            if (result.result === true) {
                                buyCapitalAccountId = result.capitalAccountId;
                                // 获取卖家资金账户ID
                                user.getCapitalAccountIdByPersonId(sellPersonId, function (result) {
                                    if (result.result === true) {
                                        sellCapitalAccountId = result.capitalAccountId;
                                        // 添加到撮合表中
                                        instruction.addMatchs(askId, bidId, hasDoneShares, askPrice, bidPrice, matchPrice, code, function (result) {
                                            if (result === true) {
                                                // 修改购买指令表相关指令状态
                                                instruction.modifyShares2TradeByInstructionId('buy', bidId, hasDoneShares, function (result) {
                                                    if (result === true) {
                                                        // 修改出售指令表相关指令状态
                                                        instruction.modifyShares2TradeByInstructionId('sell', askId, hasDoneShares, function (result) {
                                                            if (result === true) {
                                                                let amount = matchPrice * hasDoneShares;
                                                                // 买家资金流水记录
                                                                capitalAccount.ioAndInterest(buyCapitalAccountId, -amount, "股票购买支出", function (result) {
                                                                    if (result === true) {
                                                                        // 卖家资金流水记录
                                                                        capitalAccount.ioAndInterest(sellCapitalAccountId, amount, "股票出售收入", function (result) {
                                                                            if (result === true) {
                                                                                // 转账操作
                                                                                capitalAccount.pay(buyCapitalAccountId, sellCapitalAccountId, amount, function (result) {
                                                                                    if (result === true) {
                                                                                        // 更新用户持股表 - 卖家账户
                                                                                        stock.modifyStockHoldNumber(sellPersonId, code, -hasDoneShares, function (result) {
                                                                                            if (result === true) {
                                                                                                // 更新用户持股表 - 买家账户
                                                                                                stock.modifyStockHoldNumber(buyPersonId, code, hasDoneShares, function (result) {
                                                                                                    if (result === true) {
                                                                                                        resu.result = true;
                                                                                                        if (shares > hasDoneShares) {
                                                                                                            resu.continueOrNot = true;
                                                                                                            resu.remainShares = shares - hasDoneShares;
                                                                                                        }
                                                                                                        // 更新股票实时价格
                                                                                                        stock.updateStockPrice(code, matchPrice, function (result) {
                                                                                                            if (result === true) {
                                                                                                                resu.remark = "本次撮合成功！";
                                                                                                                console.log("撮合价格：" + matchPrice);
                                                                                                                console.log("撮合股数：" + hasDoneShares);
                                                                                                            } else {
                                                                                                                resu.remark = "Error: 股票实时价格更新失败！";
                                                                                                                console.log(resu.remark);
                                                                                                            }
                                                                                                            resolve(resu);
                                                                                                        });
                                                                                                    } else {
                                                                                                        resu.remark = "Error: 买家持股表更新失败！";
                                                                                                        console.log(resu.remark);
                                                                                                        resolve(resu);
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                resu.remark = "Error: 卖家持股表更新失败！";
                                                                                                console.log(resu.remark);
                                                                                                resolve(resu);
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        resu.remark = "Error: 转账失败！";
                                                                                        console.log(resu.remark);
                                                                                        callback(resu);
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                resu.remark = "Error: 卖家资金流水记录失败！";
                                                                                console.log(resu.remark);
                                                                                callback(resu);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        resu.remark = "Error: 买家资金流水记录失败！";
                                                                        console.log(resu.remark);
                                                                        callback(resu);
                                                                    }
                                                                });
                                                            } else {
                                                                resu.remark = "Error: 指令表2更新失败！"+tradeType1;
                                                                console.log(resu.remark);
                                                                resolve(resu);
                                                            }
                                                        });
                                                    } else {
                                                        resu.remark = "Error: 指令表1更新失败！"+tradeType;
                                                        console.log(resu.remark);
                                                        resolve(resu);
                                                    }
                                                });
                                            } else {
                                                resu.remark = "Error: 撮合表更新失败！";
                                                console.log(resu.remark);
                                                resolve(resu);
                                            }
                                        });
                                    } else {
                                        // 卖家资金账户ID获取失败
                                        resu.remark = result.remark + "卖家";
                                        console.log(resu.remark);
                                        callback(resu);
                                    }
                                });
                            } else {
                                // 买家资金账户ID获取失败
                                resu.remark = result.remark + "买家";
                                console.log(resu.remark);
                                callback(resu);
                            }
                        });
                    } else {
                        resu.remark = "无可撮合！";
                        console.log(resu.remark);
                        resu.result = true;
                        resolve(resu);
                    }
                });
            });
        });
        promise.then(function (result) {
            console.log(result.remark);
            if (result.result === true) {
                if (result.continueOrNot === true) {
                    Match.match(istID, tradeType, result.remainShares, price, code, personId, callback);
                } else {
                    console.log("撮合完成！");
                    callback(true);
                }
            } else {
                callback(false);
            }
        });
    };
}

module.exports = Match;
