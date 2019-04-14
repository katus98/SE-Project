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
        dbConnection.query(addSql, addSqlParams, function () {
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
}

module.exports = Instructions;
