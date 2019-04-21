// 数据库连接
let dbConnection = require('../database/MySQLconnection');

/*
* Instructions类：包含对数据库表格bids、asks、matchs、dealsbid、dealsask的直接SQL操作
* 维护小组：D组
* */
function Instructions() {
    /****查询方法****/
    //Info查询
    /*
    方法名称：getInstructionsInfoByPersonId
    实现功能：通过personid获取股票指令发布信息
    传入参数：tradeType（'sell', 'buy'）、personId（整数）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要判断结果length>0；按时间从新到旧的顺序排列
    * */
    this.getInstructionsInfoByPersonId = function (tradeType, personId, callback) {
        let getSql = "SELECT * FROM ";
        if (tradeType === "sell") {
            getSql += "asks WHERE uid = ? ORDER BY time desc";
        } else {
            getSql += "bids WHERE uid = ? ORDER BY time desc";
        }
        let getSqlParams = [personId];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    //单项查询
    /*
    方法名称：getTheMostMatch
    实现功能：获取最可能撮合的指令
    传入参数：tradeType（'sell', 'buy'）、stockId（字符串）、priceThreshold（浮点数）、回调函数
    回调参数：res = {result: false, id: 0, shares2trade: 0, price: 0, shares: 0}
    编程者：孙克染
    * */
    this.getTheMostMatch = function (tradeType, stockId, priceThreshold, callback) {
        let res = {result: false, id: 0, shares2trade: 0, price: 0, shares: 0};
        let getSql = "SELECT id, shares2trade FROM ";
        if (tradeType === "sell") {
            getSql += "asks WHERE code = ? AND status = 'partial' AND price <= ? ORDER BY price asc, time asc limit 1";
        } else {
            getSql += "bids WHERE code = ? AND status = 'partial' AND price >= ? ORDER BY price desc, time asc limit 1";
        }
        let getSqlParams = [stockId, priceThreshold];
        dbConnection.query(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                callback(res);
                return;
            }
            if (result.length > 0) {
                res.result = true;
                res.id = result.id;
                res.price = result.price;
                res.shares = result.shares;
                res.shares2trade = result.shares2trade;
                callback(res);
            } else {
                callback(res);
            }
        });
    };
    /****插入方法****/
    /*
    方法名称：addInstructions
    实现功能：插入交易指令
    传入参数：tradeType（'sell', 'buy'）、personid（整数）、stockid（字符串）、shares（整数）、pricePer（浮点数）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染、陈玮烨
    * */
    this.addInstructions = function (tradeType, personid, stockid, shares, pricePer, callback) {
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'asks(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'bids(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [personid, stockid, shares, pricePer, shares];
        //// cwy修改：添加参数
        dbConnection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                callback(false);
                return;
            }
            const istID = result.insertId;    // 需要记录刚刚插入的指令的编号
            //console.log('INSERT ID:', result);
            callback(true);
            //matchOnInsertion(istID, tradeType, shares, pricePer, code);
        });
    };
    /*
    方法名称：addMatchs
    实现功能：插入撮合记录
    传入参数：askId、bidId、shares（整数）、askPrice（浮点数）、bidPrice（浮点数）、matchPrice（浮点数）、stockId（字符串）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染
    * */
    this.addMatchs = function (askId, bidId, shares, askPrice, bidPrice, matchPrice, stockId, callback) {
        let addSql = "INSERT INTO matchs(askid, bidid, shares, askprice, bidprice, matchprice, code) VALUES(?,?,?,?,?,?,?)";
        let addSqlParams = [askId, bidId, shares, askPrice, bidPrice, matchPrice, stockId];
        dbConnection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：addDeals
    实现功能：插入撮合记录
    传入参数：askId、bidId、shares（整数）、askPrice（浮点数）、bidPrice（浮点数）、matchPrice（浮点数）、stockId（字符串）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染
    * */
    this.addDeals = function (tradeType, instructionId, shares, sharesDealed, price, stockId, callback) {
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'dealsask(id, shares, sharesdealed, price, code) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'dealsbid(id, shares, sharesdealed, price, code) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [instructionId, shares, sharesDealed, price, stockId];
        dbConnection.query(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /****更新方法****/
    /*
    方法名称：modifyShares2Trade
    实现功能：更新撮合的指令信息
    传入参数：tradeType（'sell', 'buy'）、instructionId（整数）、deltaShares（整数）、回调函数
    回调参数：true（更新成功）, false（更新失败）
    编程者：孙克染
    * */
    this.modifyShares2TradeByInstructionId = function (tradeType, instructionId, deltaShares, callback) {
        let modSql = "UPDATE ";
        let modSqlParams = [deltaShares, instructionId];
        if (tradeType === "sell") {
            modSql += 'asks SET shares2trade = shares2trade - ? WHERE id = ?';
        } else {
            modSql += 'bids SET shares2trade = shares2trade - ? WHERE id = ?';
        }
        dbConnection.query(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            Instructions.completeInstructions(function (result) {
                console.log(result);
            });
            callback(true);
        });
    };
    /*
    方法名称：completeInstructions
    实现功能：完成指令状态更新
    传入参数：回调函数
    回调参数：true（更新成功）, false（更新失败）
    编程者：孙克染
    备注：类成员函数，仅限于类内调用
    * */
    Instructions.completeInstructions = function (callback) {
        let modSql1 = "UPDATE asks SET status = 'complete' WHERE shares2trade = 0";
        let modSql2 = "UPDATE bids SET status = 'complete' WHERE shares2trade = 0";
        dbConnection.query(modSql1, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            dbConnection.query(modSql2, function (err, result) {
                if (err) {
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                callback(true);
            });
        });
    };
}

module.exports = Instructions;
