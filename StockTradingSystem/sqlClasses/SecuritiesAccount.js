// 数据库连接
let dbConnection = require('../database/MySQLconnection');

/*
* SecuritiesAccount类：包含对数据库表格idreference、personalaccount、corporateaccount的直接SQL操作
* 维护小组：A组
* */
function SecuritiesAccount() {
    /****查询方法****/
    //Info查询
    /*
    方法名称：getSecuritiesAccountInfoBySecuritiesAccountId
    实现功能：通过证券账户ID获取证券账户信息
    传入参数：securitiesAccountId（整数或者数字字符串）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getSecuritiesAccountInfoBySecuritiesAccountId = function (securitiesAccountId, callback) {
        let getSql = "SELECT * FROM ";
        if (parseInt(securitiesAccountId) < 1000000000) {
            getSql += "personalaccount WHERE accountid = " + securitiesAccountId;
        } else {
            getSql += "corporateaccount WHERE accountid = " + securitiesAccountId;
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: SecuritiesAccount: getSecuritiesAccountInfoBySecuritiesAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    //单项查询
    /*
    方法名称：getSecuritiesAccountStateBySecuritiesAccountId
    实现功能：通过证券账户ID获取证券账户状态
    传入参数：securitiesAccountId（整数或者数字字符串）、回调函数
    回调参数：字符串：'normal', 'frozen', 'logout', 'notFound'
    编程者：孙克染（demo）
    * */
    this.getSecuritiesAccountStateBySecuritiesAccountId = function (securitiesAccountId, callback) {
        let getSql = "SELECT capitalaccountstate FROM ";
        if (parseInt(securitiesAccountId) < 1000000000) {
            getSql += "personalaccount WHERE accountid = " + securitiesAccountId;
        } else {
            getSql += "corporateaccount WHERE accountid = " + securitiesAccountId;
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: SecuritiesAccount: getSecuritiesAccountStateBySecuritiesAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback('' + result[0].capitalaccountstate);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getPersonIdBySecuritiesAccountId
    实现功能：通过资金账户ID获取关联的personID
    传入参数：securitiesAccountId（整数或者数字字符串）、回调函数
    回调参数：字符串：personID字符串或者'notFound'
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getPersonIdBySecuritiesAccountId = function (securitiesAccountId, callback) {
        let getSql = "SELECT personid FROM ";
        if (parseInt(securitiesAccountId) < 1000000000) {
            getSql += "personalaccount WHERE accountid = " + securitiesAccountId;
        } else {
            getSql += "corporateaccount WHERE accountid = " + securitiesAccountId;
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: SecuritiesAccount: getPersonIdBySecuritiesAccountId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback('' + result[0].personid);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getSecuritiesAccountIdByPersonId
    实现功能：通过personID获取关联的资金账户ID
    传入参数：personId（整数或者数字字符串）、回调函数
    回调参数：字符串：securitiesAccountId字符串或者'notFound'
    编程者：孙克染（demo）
    备注：调用时需要先判断返回的结果是否是'notFound'
    * */
    this.getSecuritiesAccountIdByPersonId = function (personId, callback) {
        let getSql = "SELECT MAX(accountid) AS acc FROM idreference WHERE personid = " + personId;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: SecuritiesAccount: getSecuritiesAccountIdByPersonId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback('' + result[0].acc);
            } else {
                callback('notFound');
            }
        });
    };
    /****插入方法****/
    //todo: 这里自己写就好了，应该没有其他小组会调用
    /****更新方法****/
    //todo: 这里自己写就好了，应该没有其他小组会调用
}

module.exports = SecuritiesAccount;
