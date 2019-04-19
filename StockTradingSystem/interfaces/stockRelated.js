// 数据库连接
var dbConnection = require('../database/MySQLconnection');

function Stock() {
    this.getStockNumberByPersonidAndStockid = function (personid, stockid, callback) {
        let getSql = "SELECT stocknum FROM stockhold WHERE personid = " + personid + " AND stockid = " + stockid;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].stocknum);
            } else {
                callback('Not found!');
            }
        });
    }
}

module.exports = Stock;
