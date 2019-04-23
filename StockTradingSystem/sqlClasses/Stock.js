// 数据库连接
let dbConnection = require('../database/MySQLconnection');

/*
* Stock类：包含对数据库表格stock、stock_history、stockhold的直接SQL操作
* 维护小组：A、E组
* */
function Stock() {
    /****查询方法****/
    //Info查询
    /*
    方法名称：getAllStockInfo
    实现功能：查询上市的全部股票信息
    传入参数：回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getAllStockInfo = function (callback) {
        let getSql = "SELECT * FROM stock";
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getAllStockInfo");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    /*
    方法名称：getStockHoldInfoByPersonId
    实现功能：通过personID获取持股信息（仅返回持股数不为0的记录）
    传入参数：personId（整数或者数字字符串）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getStockHoldInfoByPersonId = function (personId, callback) {
        let getSql = "SELECT * FROM stockhold WHERE stocknum > 0 AND personid = ?";
        let getSqlParams = [personId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getStockHoldInfoByPersonId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    /*
    方法名称：getStockInfoByStockId
    实现功能：通过stockId获取股票详细信息
    传入参数：stockId（字符串）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要先判断返回的结果length>0
    * */
    this.getStockInfoByStockId = function (stockId, callback) {
        let getSql = "SELECT * FROM stock WHERE code = ?";
        let getSqlParams = [stockId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getStockInfoByStockId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    //单项查询
    /*
    方法名称：getStockNumberByPersonIdAndStockId
    实现功能：通过personId, stockId获取持股数量
    传入参数：personId（整数）, stockId（字符串）、回调函数
    回调参数：字符串：持股数数字字符串
    编程者：孙克染
    备注：需要先判断结果是否为'notFound'
    * */
    this.getStockNumberByPersonIdAndStockId = function (personId, stockId, callback) {
        let getSql = "SELECT stocknum FROM stockhold WHERE personid = ? AND stockid = ?";
        let getSqlParams = [personId, stockId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getStockNumberByPersonIdAndStockId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].stocknum);
            } else {
                callback('notFound');
            }
        });
    };
    /*
    方法名称：getStockPermissionByStockId
    实现功能：通过stockId查询对应股票是否允许交易
    传入参数：stockId（字符串）、回调函数
    回调参数：字符串：'true''false''notFound'
    编程者：孙克染
    * */
    this.getStockPermissionByStockId = function (stockId, callback) {
        let getSql = "SELECT permission FROM stock WHERE code = ?";
        let getSqlParams = [stockId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: getStockPermissionByStockId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].permission);
            } else {
                callback('notFound');
            }
        });
    };
    /****插入方法****/
    //todo: 这里自己写就好了，应该没有其他小组会调用
    /****更新方法****/
    /*
    方法名称：modifyStockHoldNumber
    实现功能：通过personId, stockId修改对应的持股数量
    传入参数：personId（整数）, stockId（字符串）、变更的股票数deltaNum（整数、允许正负、负数表示减少）、回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：黄欣雨、孙克染
    备注：如果是股份减少，则操作冻结股数
    * */
    this.modifyStockHoldNumber = function (personId, stockId, deltaNum, callback) {
        let modSql="UPDATE stockhold SET ";
        let modSqlParams = [deltaNum, personId, stockId];
        if (deltaNum >= 0) {
            modSql += "stocknum = stocknum + ?, updatetime = current_timestamp WHERE personid = ? and stockid = ?";
        } else {
            modSql += "frozenstocknum = frozenstocknum + ?, updatetime = current_timestamp WHERE personid = ? and stockid = ?";
        }
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: modifyStockHoldNumber");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：recoverFrozenStockHold
    实现功能：恢复全部的冻结股份
    传入参数：回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：孙克染
    * */
    this.recoverFrozenStockHold = function (callback) {
        let modSql="UPDATE stockhold SET stocknum = stocknum + frozenstocknum, frozenstocknum = ?";
        let modSqlParams = [0];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: recoverFrozenStockHold");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：updateStockPrice
    实现功能：更新股票实时价格
    传入参数：stockId（字符串）、newPrice（浮点数，最新股价）、回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：黄欣雨、孙克染
    * */
    this.updateStockPrice = function (stockId, newPrice, callback) {
        let modSql="UPDATE stock SET current_price = ? WHERE code = ?";
        let modSqlParams = [newPrice, stockId];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: updateStockPrice");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：convertStockToFrozenStock
    实现功能：冻结股票数量
    传入参数：personId（整数）、stockId（字符串）、stockNum（整数）、回调函数
    回调参数：bool：true（修改成功）、false（修改失败）
    编程者：孙克染
    * */
    this.convertStockToFrozenStock = function (personId, stockId, stockNum, callback) {
        let modSql="UPDATE stockhold SET frozenstocknum = frozenstocknum + ?, stocknum = stocknum - ? WHERE personid = ? AND stockid = ?";
        let modSqlParams = [stockNum, stockNum, personId, stockId];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Stock: convertStockToFrozenStock");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
}

module.exports = Stock;
