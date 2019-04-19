// 数据库连接
var dbConnection = require('../database/MySQLconnection');

function Money() {
    this.getAvailableMoneyByCapitalAccountid = function (capitalAccountid, callback) {
        let getSql = "SELECT availablemoney FROM capitalaccount WHERE capitalaccountid = " + capitalAccountid;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].availablemoney);
            } else {
                callback('Not found!');
            }
        });
    };
    this.convertAvailableMoneyToFrozenMoney = function (capitalAccountid, useMoney, callback) {
        let modSql = "UPDATE capitalaccount SET availablemoney = availablemoney - ?, frozenmoney = frozenmoney + ? WHERE capitalaccountid = ?";
        let modSqlParams = [useMoney, useMoney, capitalAccountid];
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                callback('Error!');
                return;
            }
            callback('Good!');
        });
    };
}

module.exports = Money;
