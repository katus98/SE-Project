// 数据库连接
var dbConnection = require('../database/MySQLconnection');

function Instructions() {
    this.addInstructions = function (tradeType, personid, stockid, shares, pricePer, callback) {
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'asks(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'bids(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [personid, stockid, shares, pricePer, shares];
        let returnText = "";
        dbConnection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                returnText = "Add Failed!";
                callback(returnText);
                return;
            }
            //console.log('INSERT ID:', result);
            returnText = "Add Successfully!";
            callback(returnText);
        });
    };
    this.getPartialInstructionsByStockid = function (tradeType, stockid, callback) {
        let getSql = "SELECT * FROM ";
        if (tradeType === "sell") {
            getSql += "asks WHERE status = 'partial' and code = '" + stockid + "'";
        } else {
            getSql += "bids WHERE status = 'partial' and code = '" + stockid + "'";
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
}

module.exports = Instructions;
