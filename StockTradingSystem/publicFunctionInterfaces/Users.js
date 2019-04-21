// 引用的自定义模块类
let SecuritiesAccount = require('../sqlClasses/SecuritiesAccount');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let Instructions = require('../sqlClasses/Instructions');
let Stock = require('../sqlClasses/Stock');

/*
* User类：包含方法：检查全账户有效性
* 维护小组：A、B组
* 总负责人：孙克染
* */
function User() {
    /*
    方法名称：checkAllAccountValidity
    实现功能：通过资金账户ID检查全账户有效性（即账户是否允许交易）
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：object（类json）：res = {result: bool（是否有效）, remark: ""（无效原因）}
    编程者：孙克染（demo）
    * */
    this.checkAllAccountValidity = function (capitalAccountId, callback) {
        let res = {result: false, remark: "", personId: 0, capitalAccountId: capitalAccountId, securitiesAccountId: 0};
        let capitalAccount = new CapitalAccount();
        capitalAccount.getCapitalAccountStateByCapitalAccountId(capitalAccountId, function (result) {
            if (result === 'normal') {
                capitalAccount.getSecuritiesAccountIdByCapitalAccountId(capitalAccountId, function (result) {
                    if (result === 'notFound') {
                        res.remark = "该资金账户尚未关联证券账户！";
                        callback(res);
                    } else {
                        res.securitiesAccountId = parseInt(result);
                        let securitiesAccount = new SecuritiesAccount();
                        securitiesAccount.getSecuritiesAccountStateBySecuritiesAccountId(parseInt(result), function (result) {
                            if (result === 'normal') {
                                securitiesAccount.getPersonIdBySecuritiesAccountId(parseInt(result), function (result) {
                                    if (result === 'notFound') {
                                        res.remark = "证券账户存在问题！";
                                        callback(res);
                                    } else {
                                        res.result = true;
                                        res.remark = "验证成功！";
                                        res.personId = parseInt(result);
                                        callback(res);
                                    }
                                });
                            } else if (result === 'frozen') {
                                res.remark = "相关联的证券账户已被冻结！";
                                callback(res);
                            } else if (result === 'logout') {
                                res.remark = "相关联的证券账户已注销！";
                                callback(res);
                            } else {
                                res.remark = "未找到关联的证券账户！";
                                callback(res);
                            }
                        });
                    }
                });
            } else if (result === 'frozen') {
                res.remark = "资金账户已被冻结！";
                callback(res);
            } else if (result === 'logout') {
                res.remark = "资金账户已注销！";
                callback(res);
            } else {
                res.remark = "未找到相应的资金账户！";
                callback(res);
            }
        });
    };
    /*
    方法名称：getPersonIdByCapitalAccountId
    实现功能：通过资金账户ID获取personId（持股id）
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：object（类json）：res = {result: bool（是否获取成功）, personId: 整数（结果，不成功的结果没有意义）, remark: ""（备注与失败原因）}
    编程者：孙克染（demo）
    备注：调用前请先使用checkAllAccountValidity方法检查账户有效性
    * */
    this.getPersonIdByCapitalAccountId = function (capitalAccountId, callback) {
        let res = {result: false, personId: 0, remark: ""};
        let capitalAccount = new CapitalAccount();
        capitalAccount.getSecuritiesAccountIdByCapitalAccountId(capitalAccountId, function (result) {
            if (result === 'notFound') {
                res.remark = "该资金账户尚未关联证券账户！";
                callback(res);
            } else {
                let securitiesAccount = new SecuritiesAccount();
                securitiesAccount.getPersonIdBySecuritiesAccountId(parseInt(result), function (result) {
                    if (result === 'notFound') {
                        res.remark = "证券账户存在问题！";
                        callback(res);
                    } else {
                        res.result = true;
                        res.personId = parseInt(result);
                        res.remark = "获取成功！";
                        callback(res);
                    }
                });
            }
        });
    };
    /*
    方法名称：match
    实现功能：撮合新加入的交易指令
    传入参数：istID、tradeType、shares、price、code、personId、回调函数
    回调参数：bool: true, false
    编程者：孙克染
    备注：类成员函数，仅限于加入指令时调用！串行调用！
    * */
    User.match = function (istID, tradeType, shares, price, code, personId, callback) {
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
                    User.match(istID, tradeType, result.remainShares, price, code, personId, callback);
                } else {
                    console.log("撮合完成！");
                    callback(true);
                }
            }
        });
    };
}

module.exports = User;
