// 数据库连接
let dbConnection = require('../database/MySQLconnection');

// B自定义模块类
let CalculateInterest = require('../publicFunctionInterfaces/calculateInterest');

/*
* CapitalAccount类：包含对数据库表格capitalaccount、jobberworker、capitalaccountio的直接SQL操作
* 维护小组：B组
* */
function CapitalAccount() {
    /****查询方法****/
    //Info查询
    /*
    方法名称：getCapitalAccountInfoByCapitalAccountId
    实现功能：通过资金账户ID获取资金账户信息
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getCapitalAccountInfoByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT * FROM capitalaccount WHERE capitalaccountid = " + capitalAccountId;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getCapitalAccountInfoByCapitalAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    //单项查询
    /*
    方法名称：getCapitalAccountStateByCapitalAccountId
    实现功能：通过资金账户ID获取资金账户状态
    传入参数：capitalAccountId（整数）、回调函数
    回调参数：字符串：'normal', 'frozen', 'logout', 'notFound'
    编程者：孙克染
    * */
    this.getCapitalAccountStateByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT capitalaccountstate FROM capitalaccount WHERE capitalaccountid = ?";
        let getSqlParams = [capitalAccountId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getCapitalAccountStateByCapitalAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].capitalaccountstate);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getCapitalByCapitalAccountId
    实现功能：通过资金账户ID获取资金情况
    传入参数：capitalAccountId（整数）、回调函数
    回调参数：res = {result: false, availableMoney: 0.0, frozenMoney: 0.0, remark: ""};
    编程者：孙克染
    备注：调用时需要先判断返回的result是否是true
    * */
    this.getCapitalByCapitalAccountId = function (capitalAccountId, callback) {
        let res = {result: false, availableMoney: 0.0, frozenMoney: 0.0, remark: ""};
        let getSql = "SELECT * FROM capitalaccount WHERE capitalaccountid = ?";
        let getSqlParams = [capitalAccountId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getCapitalByCapitalAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                res.result = true;
                res.availableMoney = parseFloat(result[0].availablemoney);
                res.frozenMoney = parseFloat(result[0].frozenmoney);
                res.remark = "获取成功！";
            } else {
                res.remark = "没有找到相应的证券账户！";
            }
            callback(res);
        });
    };
    /*
    方法名称：getCapitalByPersonId
    实现功能：通过证券的personid查找对应资金账户的资金信息
    传入参数：personId（整数）、回调函数
    回调参数：object（类json）：res = {result: bool（是否成功）, availableMoney: 可用资金, frozenMoney：冻结资金, remark: "备注说明"};
    编程者：王宜霖、孙克染
    * */
    this.getCapitalByPersonId = function (personId, callback) {
        let res = {result: false, availableMoney: 0.0, frozenMoney: 0.0, remark: ""};
        let getSql = "SELECT * FROM idreference, capitalaccount WHERE capitalaccount.relatedsecuritiesaccountid = idreference.accountid";
        getSql += " AND idreference.personid = ? AND capitalaccount.capitalaccountstate = ?";
        let getSqlParams = [personId, 'normal'];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getCapitalByPersonId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length === 0) {
                res.result = false;
                res.remark = "查询失败：不存在对应的资金账户，或资金账户状态异常！";
            } else {
                res.result = true;
                res.remark = "查询成功！";
                res.availableMoney = parseFloat(result[0].availablemoney);
                res.frozenMoney = parseFloat(result[0].frozenmoney);
            }
            callback(res);
        });
    };
    /*
    方法名称：getSecuritiesAccountIdByCapitalAccountId
    实现功能：通过资金账户ID获取关联的证券账户ID
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：字符串：证券账户ID字符串或者'notFound'
    编程者：孙克染
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getSecuritiesAccountIdByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT relatedsecuritiesaccountid FROM capitalaccount WHERE capitalaccountid = ?";
        let getSqlParams = [parseInt(capitalAccountId)];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getSecuritiesAccountIdByCapitalAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].relatedsecuritiesaccountid);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getCapitalIdBySecuritiesAccountId
    实现功能：通过证券账户ID获取关联的资金账户ID
    传入参数：securitiesAccountId（整数）、回调函数
    回调参数：字符串：资金账户ID字符串或者'notFound'
    编程者：孙克染
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getCapitalIdBySecuritiesAccountId = function (securitiesAccountId, callback) {
        let getSql = "SELECT capitalaccountid FROM capitalaccount WHERE relatedsecuritiesaccountid = ? AND capitalaccountstate = ?";
        let getSqlParams = [securitiesAccountId, 'normal'];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: getCapitalIdBySecuritiesAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].capitalaccountid);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getTradePasswordByCapitalAccountId
    实现功能：通过资金账户ID获取其密码
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：
    编程者：
    备注：
    * */
    this.getTradePasswordByCapitalAccountId = function (capitalAccountId, callback) {

    };
    /****插入方法****/
    //todo: 这里自己写就好了，应该没有其他小组会调用
    /****更新方法****/
    /*
    方法名称：convertAvailableMoneyToFrozenMoney
    实现功能：通过资金账户ID将特定数量的可用资金转化为冻结资金
    传入参数：capitalAccountId（整数）、回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：孙克染
    * */
    this.convertAvailableMoneyToFrozenMoney = function (capitalAccountId, useMoney, callback) {
        let modSql = "UPDATE capitalaccount SET availablemoney = availablemoney - ?, frozenmoney = frozenmoney + ? WHERE capitalaccountid = ?";
        let modSqlParams = [useMoney, useMoney, capitalAccountId];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: convertAvailableMoneyToFrozenMoney");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：convertFrozenMoneyToAvailableMoney
    实现功能：通过资金账户ID将特定数量的冻结资金转化为可用资金
    传入参数：capitalAccountId（整数）、回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：孙克染
    * */
    this.convertFrozenMoneyToAvailableMoney = function (capitalAccountId, drawbackMoney, callback) {
        let modSql = "UPDATE capitalaccount SET availablemoney = availablemoney + ?, frozenmoney = frozenmoney - ? WHERE capitalaccountid = ?";
        let modSqlParams = [drawbackMoney, drawbackMoney, capitalAccountId];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: convertFrozenMoneyToAvailableMoney");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：modifyTradePasswordByCapitalAccountId
    实现功能：通过资金账户ID修改其密码
    传入参数：capitalAccountId（整数或者数字字符串）、newPassword（字符串）回调函数
    回调参数：
    编程者：
    备注：
    * */
    this.modifyTradePasswordByCapitalAccountId = function (capitalAccountId, newPassword, callback) {

    };
    /*
    方法名称：ioAndInterest
    实现功能：买卖股票、资金变动时，给定资金账户ID、收支金额(收入为正，支出为负)、描述信息，
    进行计算利息、插入收支表记录  ！！！请C/D/E组在指令有效性检查之后、【变动可用资金【之前】】务必调用，谢谢！！！
    传入参数：资金账户ID、收支金额(有正有负！)、描述信息、回调函数
    回调参数：bool: true, false
    编程者：苏彬、王宜霖、孙克染
    * */
    this.ioAndInterest = function (capitalAccountId, amount, ioDescription, callback) {
        let calculateInterest = new CalculateInterest();
        calculateInterest.calculate(capitalAccountId, function (tempInterest) {
            //更新利息余额
            let modSql = "Update capitalaccount set interestremained = interestremained + ? where capitalaccount.capitalaccountid = ? and capitalaccount.capitalaccountstate = ?";
            let modSqlParams = [tempInterest, capitalAccountId, 'normal'];
            dbConnection.query(modSql, modSqlParams, function (err, result) {
                if (err) {
                    console.log("ERROR: CapitalAccount: ioAndInterest1");
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                //在资金账户收支记录io表中写入信息
                let addSql = "Insert into capitalaccountio(capitalaccountid, ioamount, iodescription) VALUES(?,?,?)";
                let addSqlParams = [capitalAccountId, amount, ioDescription];
                dbConnection.query(addSql, addSqlParams, function (err, result) {
                    if (err) {
                        console.log("ERROR: CapitalAccount: ioAndInterest2");
                        console.log('[INSERT ERROR] - ', err.message);
                        callback(false);
                        return;
                    }
                    callback(true);
                });
            });
        });
    };
    /*
    方法名称：pay
    实现功能：转账
    传入参数：支出方资金账户ID、收入方资金账户ID、使用的金额、回调函数
    回调参数：bool: true, false
    编程者：孙克染
    * */
    this.pay = function (fromCapitalAccountId, toCapitalAccountId, useMoney, callback) {
        let modSql1 = "UPDATE capitalaccount SET frozenmoney = frozenmoney - ? WHERE capitalaccountid = ?";
        let modSqlParams1 = [useMoney, fromCapitalAccountId];
        dbConnection.query(modSql1, modSqlParams1, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: pay1");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            let modSql2 = "UPDATE capitalaccount SET availablemoney = availablemoney + ? WHERE capitalaccountid = ?";
            let modSqlParams2 = [useMoney, toCapitalAccountId];
            dbConnection.query(modSql2, modSqlParams2, function (err, result) {
                if (err) {
                    console.log("ERROR: CapitalAccount: pay2");
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                callback(true);
            });
        });
    };
    /*
    方法名称：recoverFrozenCapital
    实现功能：恢复全部的冻结资金
    传入参数：回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：孙克染（Debugged with CWY）
    备注：调用此函数之前无需调用流水记录；自求多福吧！
    * */
    this.recoverFrozenCapital = function (callback) {
        let getSql = "SELECT * FROM capitalaccount WHERE frozenmoney > ?";
        let getSqlParams = [0];
        let CapAcc = new CapitalAccount();
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: CapitalAccount: recoverFrozenCapital1");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            let promise = new Promise(function (resolve, reject) {
                let i = 0, len = result.length;
                let manipulateIO = function () {
                    if (i < len)
                    {
                        CapAcc.ioAndInterest(result[i].capitalaccountid, result[i].frozenmoney, "未完成交易资金回退", function (result) {
                            if (result === false) {
                                console.log(result[i].capitalaccountid + "资金回退流水记录失败！");
                            }
                            i++;
                            manipulateIO()
                        });
                    }
                    else
                    {
                        resolve(true);
                    }
                };
                manipulateIO();
            });
            promise.then(function (result) {
                let modSql = "UPDATE capitalaccount SET availablemoney = availablemoney + frozenmoney, frozenmoney = ?";
                let modSqlParams = [0];
                dbConnection.query(modSql, modSqlParams, function (err, result) {
                    if (err) {
                        console.log("ERROR: Stock: recoverFrozenCapital");
                        console.log('[UPDATE ERROR] - ', err.message);
                        callback(false);
                        return;
                    }
                    callback(true);
                });
            });
        });
    };
}

module.exports = CapitalAccount;
