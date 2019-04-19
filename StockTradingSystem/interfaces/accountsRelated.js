// 数据库连接
var dbConnection = require('../database/MySQLconnection');

function Accounts() {
    this.getCapitalAccountState = function (capitalAccountid, callback) {
        let getSql = "SELECT capitalaccountstate FROM capitalaccount WHERE capitalaccountid = " + capitalAccountid;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].capitalaccountstate);
            } else {
                callback('Not found!');
            }
        });
    };
    this.getAccountidByCapitalAccountid = function (capitalAccountid, callback) {
        let getSql = "SELECT relatedsecuritiesaccountid FROM capitalaccount WHERE capitalaccountid = " + capitalAccountid;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].relatedsecuritiesaccountid);
            } else {
                callback('Not found!');
            }
        });
    };
    this.getAccountidByPersonid = function (personid, callback) {
        let getSql = "SELECT MAX(accountid) AS acc FROM idreference WHERE personid = " + personid;
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].acc);
            } else {
                callback('Not found!');
            }
        });
    };
    this.getAccountidState = function (accountid, callback) {
        let getSql = "SELECT state FROM ";
        if (accountid < 1000000000) {
            getSql += "personalaccount WHERE accountid = " + accountid;
        } else {
            getSql += "corporateaccount WHERE accountid = " + accountid;
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].state);
            } else {
                callback('Not found!');
            }
        });
    };
    this.getPersonidByAccountid = function (accountid, callback) {
        var re = "";
        let getSql = "SELECT personid FROM ";
        if (accountid < 1000000000) {
            getSql += "personalaccount WHERE accountid = " + accountid;
        } else {
            getSql += "corporateaccount WHERE accountid = " + accountid;
        }
        dbConnection.query(getSql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("" + result[0].personid);
            } else {
                callback('Not found!');
            }
        });
    };
}

module.exports = Accounts;
