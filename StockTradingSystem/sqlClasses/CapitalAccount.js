// 数据库连接
let dbConnection = require('../database/MySQLconnection');

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
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getCapitalAccountInfoByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT * FROM capitalaccount WHERE capitalaccountid = " + capitalAccountId;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
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
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：字符串：'normal', 'frozen', 'logout', 'notFound'
    编程者：孙克染（demo）
    * */
    this.getCapitalAccountStateByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT capitalaccountstate FROM capitalaccount WHERE capitalaccountid = " + capitalAccountId;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
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
    方法名称：getAvailableMoneyByCapitalAccountId
    实现功能：通过资金账户ID获取可用资金
    传入参数：capitalAccountId（整数）、回调函数
    回调参数：字符串：可用资金数字字符串或者'notFound'
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getAvailableMoneyByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT availablemoney FROM capitalaccount WHERE capitalaccountid = ?";
        let getSqlParams = [capitalAccountId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].availablemoney);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getSecuritiesAccountIdByCapitalAccountId
    实现功能：通过资金账户ID获取关联的证券账户ID
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：字符串：证券账户ID字符串或者'notFound'
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getSecuritiesAccountIdByCapitalAccountId = function (capitalAccountId, callback) {
        let getSql = "SELECT relatedsecuritiesaccountid FROM capitalaccount WHERE capitalaccountid = " + capitalAccountId;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
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
    方法名称：modifyTradePasswordByCapitalAccountId
    实现功能：通过资金账户ID修改其密码
    传入参数：capitalAccountId（整数或者数字字符串）、newPassword（字符串）回调函数
    回调参数：
    编程者：
    备注：
    * */
    this.modifyTradePasswordByCapitalAccountId = function (capitalAccountId, newPassword, callback) {

    };
}

module.exports = CapitalAccount;
