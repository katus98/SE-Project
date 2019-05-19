// 数据库连接
let dbQuery = require('../database/MySQLquery');

function OpenAccount() {
    // 个人开户的数据准备
    this.currentpaccount = function (callback) {
        let getSql = "select max(accountid)+1 as a, max(personid)+1 as p from personalaccount";
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT MAX ACCOUNTID ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback(-1);
            }
        });
    };
    // 个人开户的插入操作
    this.insertpaccount = function (data, req, callback) {
        //首先我们判断一下是否是重复开户
        let getSql = "select personalaccount.state as s from personalaccount, (select max(registertime) as r from personalaccount  where identityid = ?) as u where personalaccount.registertime = u.r and personalaccount.identityid = ?";
        let getSqlParams = [req.body.idCardNumber, req.body.idCardNumber];
        dbQuery(getSql, getSqlParams, function(err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0 && result[0].s !== 'logout') {
                // 表中已有同样身份信息的记录，查看这个记录的状态是否为frozen
                if (result[0].s === 'frozen') {
                    callback(-1);
                } else if (result[0].s === 'normal') {
                    callback(-2);
                }
            }
            else {
                // 给idreference表插入数据
                let addSql = "insert into idreference(accountid, personid) values(?, ?)";
                let addSqlParams = [data.a, data.p];
                dbQuery(addSql, addSqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                        return;
                    }
                    //如果不存在代办人，那么插入数据时，不需要插入代办人属性
                    //给personalaccount表插入数据
                    let addSql2 = "insert into personalaccount(accountid, name, gender, identityid, homeaddress, work, educationback, workaddress, phonenumber, personid) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let addSqlParams2 = [data.a, req.body.name, req.body.gender, req.body.idCardNumber, req.body.address, req.body.job, req.body.education, req.body.company, req.body.phone, data.p];
                    dbQuery(addSql2, addSqlParams2, function (err, result) {
                        if (err) {
                            console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                            return;
                        }
                    });
                });
                callback(1);
            }
        });
    };
    // 初始开户时将stockhold表中插入对应personid的记录
    this.initstockhold = function (personId, callback) {
        let addSql = "insert into stockhold(personid, stockid, stocknum, stockcost) SELECT ? as personid, code, ? as stocknum, ? as stockcost FROM stock";
        let addSqlParams = [personId, 0, 0.00];
        dbQuery(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT STOCKNUM ERROR] - ', err.message);
                return;
            }
            callback(1);
        });
    };
}

module.exports = OpenAccount;
