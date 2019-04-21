// 引用的自定义模块类
let Instructions = require('../sqlClasses/Instructions');
let Stock = require('../sqlClasses/Stock');

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
                instructions.addInstructions(result[0].tradetype, result[0].uid, result[0].code, result[0].shares, result[0].price, function (result) {
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
    方法名称：match
    实现功能：撮合新加入的交易指令
    传入参数：istID、tradeType、shares、price、code、personId、回调函数
    回调参数：bool: true, false
    编程者：孙克染、杨清杰、张梓欣、陈玮烨
    备注：仅限于加入指令时调用！串行调用！
    * */
    this.match = function (istID, tradeType, shares, price, code, personId, callback) {
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
                        //添加到match表中
                        instruction.addMatchs(askId, bidId, hasDoneShares, askPrice, bidPrice, matchPrice, code, function (result) {
                            if (result === true) {
                                instruction.modifyShares2TradeByInstructionId(tradeType, istID, hasDoneShares, function (result) {
                                    if (result === true) {
                                        instruction.modifyShares2TradeByInstructionId(tradeType1, res.id, hasDoneShares, function (result) {
                                            if (result === true) {
                                                //已经完成的项目更新到用户表中
                                                //卖家账户
                                                stock.modifyStockHoldNumber(sellPersonId, code, -hasDoneShares, function (result) {
                                                    if (result === true) {
                                                        //买家账户
                                                        stock.modifyStockHoldNumber(buyPersonId, code, hasDoneShares, function (result) {
                                                            if (result === true) {
                                                                resu.remark = "本次撮合成功！";
                                                                resu.result = true;
                                                                if (shares > hasDoneShares) {
                                                                    resu.continueOrNot = true;
                                                                    resu.remainShares = shares - hasDoneShares;
                                                                }
                                                                resolve(resu);
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
                                                resu.remark = "Error: 指令表2更新失败！"+tradeType1;
                                                resolve(resu);
                                            }
                                        });
                                    } else {
                                        resu.remark = "Error: 指令表1更新失败！"+tradeType;
                                        resolve(resu);
                                    }
                                });
                            } else {
                                resu.remark = "Error: 撮合表更新失败！";
                                resolve(resu);
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
                    this.match(istID, tradeType, result.remainShares, price, code, personId, callback);
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
