// 数据库连接
var dbQuery = require('../database/MySQLquery');
// 计算利息类
var calculateInterest = require('../publicFunctionInterfaces/CalculateInterest');
// 资金账户管理类
function capitalAccountUsers () {
    // 存款
    this.FundIn = function (capitalaccountid, cashpassWord, type, amount0, callback) {
        // 确认密码正确
        var test = new calculateInterest();
        test.test();
        var amount;
        // 外币换算成人民币
        switch (type) {
            case "RMB":
                amount=amount0*1.0000;
                break;
            case "USD":
                amount=amount0*6.8217;
                break;
            case "CAD":
                amount=amount0*5.0863;
                break;
            case "AUD":
                amount=amount0*4.7752;
                break;
            case "EUR":
                amount=amount0*7.6628;
                break;
            case "GBP":
                amount=amount0*8.8634;
                break;
            case "HKD":
                amount=amount0*0.8692;
                break;
            case "JPY":
                amount=amount0*0.0620;
                break;
        }
        let FundInSqlOne = "select capitalaccount.capitalaccountid from capitalaccount where capitalaccount.capitalaccountid = "
                            + capitalaccountid + " and capitalaccount.cashpassWord = \'" + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
        // 资金变动即更新一遍利息，建议新增表
        dbQuery(FundInSqlOne, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else if (result.length == 0) {
                callback("资金账户密码错误或者账户状态异常！");
            } else {
                test.calculate(capitalaccountid, function(tempinterest){
                    let InterestSql = "Update capitalaccount set interestremained = interestremained + "+ tempinterest +
                                    " where capitalaccount.capitalaccountid = "+ capitalaccountid +" and capitalaccount.cashpassWord = \'"
                                    + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
                    dbQuery(InterestSql,[], function (err, result) {
                        if (err) {
                            console.log('[UPDATE ERROR] - ', err.message);
                            return;
                        } else {
                            let FundInSqlTwo = "Update capitalaccount set availablemoney = availablemoney + "+ amount +
                                " where capitalaccount.capitalaccountid = "+ capitalaccountid +" and capitalaccount.cashpassWord = \'"
                                + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
                            dbQuery(FundInSqlTwo, [], function (err, result) {
                                if (err) {
                                    console.log('[UPDATE ERROR] - ', err.message);
                                    return;
                                } else {
                                    let FundInSqlThree = "Insert into capitalaccountio (capitalaccountid,ioamount,moneytype,iodescription)\
                                                        values ("+capitalaccountid+","+amount0+",\'"+type+"\',\'存款\')";
                                    dbQuery(FundInSqlThree,[], function (err, result) {
                                        if (err) {
                                            console.log('[INSERT ERROR] - ', err.message);
                                            return;
                                        } else {
                                            callback('账户存款成功！');
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    // 取款
    this.FundOut = function (capitalaccountid, cashpassWord, amount, callback) {
        var test = new calculateInterest();
        let FundOutSqlOne = "select capitalaccountid,availablemoney from capitalaccount where capitalaccount.capitalaccountid = "
                            + capitalaccountid + " and capitalaccount.cashpassWord = \'" + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
        dbQuery(FundOutSqlOne, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else if (result.length == 0) {
                callback("资金账户密码错误或者账户状态异常！");
            } else if (result[0].availablemoney < amount) {
                callback("账户余额不足，取款失败！");
            } else {
                test.calculate(capitalaccountid, function (tempinterest) {
                    let InterestSql = "Update capitalaccount set interestremained = interestremained + " + tempinterest +
                                    " where capitalaccount.capitalaccountid = " + capitalaccountid + " and capitalaccount.cashpassWord = \'"
                                    + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
                    dbQuery(InterestSql, [], function (err, result) {
                        if (err) {
                            console.log('[UPDATE ERROR1] - ', err.message);
                            return;
                        } else {
                            let FundOutSqlTwo = "select availablemoney,interestremained from capitalaccount where capitalaccount.capitalaccountid = "
                                + capitalaccountid + " and capitalaccount.cashpassWord = \'" + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
                            dbQuery(FundOutSqlTwo,[], function (err, result) {
                                if (err) {
                                    console.log('[SELECT ERROR] - ', err.message);
                                    return;
                                } else {
                                    let availablemoney = result[0].availablemoney;
                                    let interestremained = result[0].interestremained;
                                    // 账户内余额大于所取金额
                                    if (availablemoney > amount) {
                                        let amount1 = -amount;
                                        let FundOutSqlThree = "Update capitalaccount set availablemoney = availablemoney + "+ amount1 +
                                                            " where capitalaccount.capitalaccountid = "+ capitalaccountid +" and capitalaccount.cashpassWord = \'"
                                                            + cashpassWord + "\' and capitalaccount.capitalaccountstate = \'normal\'";
                                        dbQuery(FundOutSqlThree, [], function (err, result) {
                                            if (err) {
                                                console.log('[Update ERROR2] - ', err.message);
                                                return;
                                            } else {
                                                let current_date=new Date();
                                                let current_time=current_date.toLocaleTimeString();
                                                let FundOutSqlFour = "Insert into capitalaccountio (capitalaccountid,ioamount,iodescription) values ("+capitalaccountid+","+amount1+",\'"
                                                                    +"取款"+"\')";
                                                dbQuery(FundOutSqlFour,[], function (err, result) {
                                                    if (err) {
                                                        console.log('[INSERT ERROR] - ', err.message);
                                                        return;
                                                    }
                                                    else {
                                                        callback("账户取款成功！");
                                                    }
                                                });
                                            }
                                        });
                                    } else {   // 账户内余额等于所取金额
                                        let FundOutSqlFive = "Update capitalaccount set availablemoney = 0,interestremained =0 where capitalaccount.capitalaccountid = "
                                                            + capitalaccountid +" and capitalaccount.cashpassWord = \'" + cashpassWord +
                                                            "\' and capitalaccount.capitalaccountstate = \'normal\'";
                                        dbQuery(FundOutSqlFive,[], function (err, result) {
                                            if (err) {
                                                console.log('[Update ERROR3] - ', err.message);
                                                return;
                                            } else {
                                                let current_date=new Date();
                                                let current_time=current_date.toLocaleTimeString();
                                                let FundOutSqlSix = "Insert into capitalaccountio (capitalaccountid,ioamount,iodescription) values ("+capitalaccountid+","
                                                                    + (amount+interestremained)+",\'"+"全部取款"+"\')";
                                                dbQuery(FundOutSqlSix,[], function (err, result) {
                                                    if (err) {
                                                        console.log('[INSERT ERROR] - ', err.message);
                                                        return;
                                                    } else {
                                                        callback("账户取款成功！");
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    // 资金账户流水查看
    this.ViewAcountIOInformation = function (capitalaccountid, callback) {
        /*let ViewAcountIOInfoSql = "SELECT capitalaccountid,iotime,ioamount,moneytype,iodescription FROM capitalaccountio WHERE capitalaccountid = " 
        + capitalaccountid +" order by capitalaccountio.id desc";*/
        let ViewAcountIOInfoSql = "SELECT capitalaccountid,DATE_FORMAT(iotime,'%Y-%m-%d %H:%i:%s') As iotime,ioamount,moneytype,iodescription FROM capitalaccountio WHERE capitalaccountid = " 
                                    + capitalaccountid +" order by capitalaccountio.id desc limit 100";
        dbQuery(ViewAcountIOInfoSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length == 0) {
                callback("账号信息异常！");
            } else {
                callback(result);
                // 注意回调函数应用
            }
        });
    };
}

module.exports = capitalAccountUsers;
