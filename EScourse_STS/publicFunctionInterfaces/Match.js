// 数据库连接
let dbQuery = require('../database/MySQLquery');

// 引用的自定义模块类
let Instructions = require('../sqlClasses/Instructions');
let Stock = require('../sqlClasses/Stock');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let User = require('../publicFunctionInterfaces/Users');

// 临时：控制开闭盘的全局变量
let start = false;
let flag = false;

/*
* Match类：包含方法：指令撮合
* 维护小组：D组
* 总负责人：孙克染
* 备注：禁止D组外其他小组调用！
* */
function Match() {
    /*
    方法名称：getAllMatch
    实现功能：获取全部的撮合信息
    传入参数：回调函数
    回调参数：直接承接result
    编程者：孙克染
    备注：调用后需要先判断length是否大于0
    * */
    this.getAllMatch = function (callback) {
        let getSql = "SELECT * FROM matchs";
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getAllMatch");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };

    /*
    方法名称：convertTempInstructionsToInstructions
    实现功能：将缓存的优先级最高的指令加入指令表
    传入参数：回调函数
    回调参数：res = {result: false, remark: ""}
    编程者：孙克染、陈玮烨、杨清杰
    备注：串行调用！
    * */
    this.convertTempInstructionsToInstructions = function (callback) {
        let match = this;

        let promise = new Promise(function (resolve, reject) {
            let res = {result: false, remark: ""};
            let instructions = new Instructions();
            // 获取优先级最高的缓存交易指令信息
            instructions.getTheFirstTempInstructionInfo(function (result) {
                if (result.length > 0) {
                    // 调用类成员函数，实现将上述缓存指令插入到正式指令表中的操作，连带执行删除该条缓存和股票撮合功能
                    Match.addInstructions(result[0].tradetype, result[0].uid, result[0].code, result[0].shares, result[0].price, result[0].time, function (result) {
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
                        resolve(res);
                    });
                    flag = true;
                } else {
                    flag = false;
                    res.remark = "没有缓存指令！";
                    res.result = true;
                    resolve(res);
                }
            });
        });
        promise.then(function (result) {
            if (result.result === true && (start || flag)) {
                if (flag) {
                    console.log("Success: 本次撮合成功！即将进入下一次！");
                }
                match.convertTempInstructionsToInstructions(callback);
            } else {
                callback(result);
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
    Match.addInstructions = function (tradeType, personId, stockId, shares, price, time, callback) {
        let res = {addResult: false, matchResult: false};
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'asks(time, uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?,?)';
        } else {
            addSql += 'bids(time, uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?,?)';
        }
        let addSqlParams = [time, personId, stockId, shares, price, shares];
        // 将优先级最高的缓存指令信息插入正式指令表
        dbQuery(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Match: addInstructions");
                console.log('[INSERT ERROR] - ', err.message);
                callback(res);
                return;
            }
            const istID = result.insertId;    // 需要记录刚刚插入的指令的编号
            res.addResult = true;
            // 删除原先的最优先缓存指令
            let instructions = new Instructions();
            instructions.deleteTheFirstTempInstruction(function (result) {
                // 调用类成员函数：实现指令撮合
                Match.match(istID, tradeType, shares, price, stockId, personId, function (result) {
                    res.matchResult = result;
                    callback(res);
                });
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

            // 本次撮合结果存储在resu结构变量中
            let resu = {result: false, continueOrNot: false, remark: "", remainShares: 0};

            // 撮合过程中需要用的的自定义方法类
            let stock = new Stock();
            let capitalAccount = new CapitalAccount();
            let user = new User();
            let instruction = new Instructions();

            // 获取最优先的匹配指令
            instruction.getCorInstructionHiPriority(tradeType, code, price, function (res) {
                // 获取本次撮合涉及股票的详细信息
                stock.getStockInfoByStockId(code,function (res2) {
                    if (res.result !== false) {
                        // 变量群
                        let bidId, askId;// 交易指令ID
                        let bidPrice, askPrice;// 交易初始标价
                        let matchPrice;// 初始撮合价格
                        let sellPersonId, buyPersonId;// 指令发出的用户ID
                        let hasDoneShares = Math.min(res.shares2trade, shares);// 本次撮合完成的交易股数
                        let buyCapitalAccountId, sellCapitalAccountId;// 买卖双方资金账户ID

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
                            buyPersonId = personId;
                            askId = res.id;
                            bidId = istID;
                            askPrice = res.price;
                            bidPrice = price;
                        }

                        // 初始撮合价格为买卖双方出价平均值
                        matchPrice = (askPrice + bidPrice) / 2;

                        // 股票交易上下线，涨跌停限制res2[0].percentagepricechange以内的可以成交
                        let high = (res2[0].last_endprice) * (res2[0].percentagepricechange + 1);
                        let low = res2[0].last_endprice * (1 - res2[0].percentagepricechange);

                        //股票撮合价格要求在上下限内
                        matchPrice = matchPrice > high ? high : matchPrice;
                        matchPrice = matchPrice < low ? low :matchPrice;

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
                                                                let drawback = (bidPrice - matchPrice) * hasDoneShares;
                                                                capitalAccount.ioAndInterest(buyCapitalAccountId, drawback, "额外出价退回", function (result) {
                                                                    if (result === true) {
                                                                        capitalAccount.convertFrozenMoneyToAvailableMoney(buyCapitalAccountId, drawback, function (result) {
                                                                            if (result === true) {
                                                                                // 卖家资金流水记录
                                                                                capitalAccount.ioAndInterest(sellCapitalAccountId, amount*0.995, "股票出售收入", function (result) {
                                                                                    if (result === true) {
                                                                                        // 转账操作
                                                                                        capitalAccount.pay(buyCapitalAccountId, sellCapitalAccountId, amount*0.995, function (result) {
                                                                                            if (result === true) {
                                                                                                // 手续费流水记录
                                                                                                capitalAccount.ioAndInterest('2019007', amount*0.01, '手续费收入', function (result) {
                                                                                                    if (result) {
                                                                                                        // 买家支付手续费
                                                                                                        capitalAccount.pay(buyCapitalAccountId, '2019007', amount*0.005, function (result) {
                                                                                                            if (result) {
                                                                                                                // 卖家支付手续费
                                                                                                                capitalAccount.enrichSkr(amount*0.005, function (result) {
                                                                                                                    if (result) {
                                                                                                                        // 更新用户持股表 - 卖家账户
                                                                                                                        stock.modifyFrozenStockHoldNumber(sellPersonId, code, -hasDoneShares, function (result) {
                                                                                                                            if (result === true) {
                                                                                                                                // 更新用户持股表 - 买家账户
                                                                                                                                stock.finishStockChange(buyPersonId, code, hasDoneShares, matchPrice, function (result) {
                                                                                                                                    if (result === true) {
                                                                                                                                        resu.result = true;
                                                                                                                                        if (shares > hasDoneShares) {
                                                                                                                                            resu.continueOrNot = true;
                                                                                                                                            resu.remainShares = shares - hasDoneShares;
                                                                                                                                        }
                                                                                                                                        // 更新股票实时价格
                                                                                                                                        stock.updateStockPrice(code, matchPrice, function (result) {
                                                                                                                                            if (result === true) {
                                                                                                                                                resu.remark = "本次撮合完成！";
                                                                                                                                                console.log("撮合价格：" + matchPrice);
                                                                                                                                                console.log("撮合股数：" + hasDoneShares);
                                                                                                                                            } else {
                                                                                                                                                resu.remark = "Error: 股票实时价格更新失败！";
                                                                                                                                            }
                                                                                                                                            resolve(resu);
                                                                                                                                        });
                                                                                                                                    } else {
                                                                                                                                        resu.remark = "Error: 买家持股表更新失败！";
                                                                                                                                        resolve(resu);
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            } else {
                                                                                                                                resu.remark = "Error: 卖家持股表更新失败！";
                                                                                                                                resolve(resu);
                                                                                                                            }
                                                                                                                        });
                                                                                                                    } else {
                                                                                                                        resu.remark = "Error: 卖家手续费支付失败！";
                                                                                                                        callback(resu);
                                                                                                                    }
                                                                                                                });
                                                                                                            } else {
                                                                                                                resu.remark = "Error: 买家手续费支付失败！";
                                                                                                                callback(resu);
                                                                                                            }
                                                                                                        });
                                                                                                    } else {
                                                                                                        resu.remark = "Error: 手续费流水记录失败！";
                                                                                                        callback(resu);
                                                                                                    }
                                                                                                });
                                                                                            } else {
                                                                                                resu.remark = "Error: 转账失败！";
                                                                                                callback(resu);
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        resu.remark = "Error: 卖家资金流水记录失败！";
                                                                                        callback(resu);
                                                                                    }
                                                                                });
                                                                            } else {
                                                                                resu.remark = "Error: 退钱失败！";
                                                                                callback(resu);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        resu.remark = "Error: 退钱流水记录失败！";
                                                                        callback(resu);
                                                                    }
                                                                });
                                                            } else {
                                                                resu.remark = "Error: 指令表asks更新失败！";
                                                                resolve(resu);
                                                            }
                                                        });
                                                    } else {
                                                        resu.remark = "Error: 指令表bids更新失败！";
                                                        resolve(resu);
                                                    }
                                                });
                                            } else {
                                                resu.remark = "Error: 撮合表更新失败！";
                                                resolve(resu);
                                            }
                                        });
                                    } else {
                                        // 卖家资金账户ID获取失败
                                        resu.remark = result.remark + "卖家";
                                        callback(resu);
                                    }
                                });
                            } else {
                                // 买家资金账户ID获取失败
                                resu.remark = result.remark + "买家";
                                callback(resu);
                            }
                        });
                    } else {
                        resu.remark = "无可撮合！";
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
                    console.log("本条指令撮合完成！");
                    callback(true);
                }
            } else {
                callback(false);
            }
        });
    };
    /*
    方法名称：startMatching与stopMatching
    实现功能：开始撮合与停止撮合
    传入参数：回调函数
    编程者：孙克染、陈玮烨、杨清杰
    * */
    this.startMatching = function (callback) {
        start = true;
        Match.startMatchInSQL(function (result) {
            callback(result);
        });
    };
    // todo:
    // Note: Repetitive stopping matching in a day would invoke a bug due to a constraint on the table stock_history
    // which only allows 1 record per code per day.
    this.stopMatching = function (callback) {
        start = false;
        Match.stopMatchInSQL(function (result) {
            console.log('stop in sql');
        });
        let capitalAccount = new CapitalAccount();
        let stocks= new Stock();
        let instruction = new Instructions();
        instruction.expireInstructions(function (result) {
            let stock = new Stock();
            stock.updateStockHistoryAtClosing(function (result) {
                stock.updateStockPriceAtClosing(function (result) {
                    capitalAccount.recoverFrozenCapital(function (result) {
                        if(result === false)
                        {
                            console.log("冻结资金回退失败");
                            callback(false);
                            return;
                        }
                        else
                        {
                            stocks.recoverFrozenStockHold(function (result) {
                                if(result === false){
                                    console.log("冻结股票退回失败");
                                    callback(false);
                                    return;
                                }
                                callback(true);
                            });
                        }
                    });
                });
            });
        });
    };
    /*
    方法名称：getStateOfMatch
    实现功能：获取撮合系统运行状态
    传入参数：回调函数
    编程者：孙克染
    * */
    this.getStateOfMatch = function (callback) {
        let result0 = {start: false, flag: false};
        let sql = 'SELECT status FROM matchstate';
        dbQuery(sql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Match: getStateOfMatch");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            result0.start = result[0].status;
            result0.flag = flag;
            callback(result0);
        });
    };
    Match.stopMatchInSQL = function (callback) {
        let sql = 'UPDATE matchstate SET status = false';
        dbQuery(sql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Match: stopMatchInSQL");
                console.log('[SELECT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    Match.startMatchInSQL = function (callback) {
        let sql = 'UPDATE matchstate SET status = true';
        dbQuery(sql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Match: startMatchInSQL");
                console.log('[SELECT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
}

module.exports = Match;
