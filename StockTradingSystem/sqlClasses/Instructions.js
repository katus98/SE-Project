// 数据库连接
let dbConnection = require('../database/MySQLconnection');

/*
* Instructions类：包含对数据库表格bids、asks、matchs、dealsbid、dealsask的直接SQL操作
* 维护小组：D组
* */
function Instructions() {
    /****查询方法****/
    //Info查询
    //单项查询
    /****插入方法****/
    /*
    方法名称：addInstructions
    实现功能：插入交易指令
    传入参数：tradeType（'sell', 'buy'）、personid（整数）、stockid（字符串）、shares（整数）、pricePer（浮点数）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染（demo）、陈玮烨
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
            callback(true);
        });
    };
}

module.exports = Instructions;
