// 数据库连接
let dbQuery = require('../database/MySQLquery');

function LoseAccount() {    
    this.findpaccount = function (id, callback) {
        let getSql = "select personalaccount.state as s from personalaccount,(select max(registertime) as r from personalaccount  where identityid= ?) as u where personalaccount.registertime=u.r and personalaccount.identityid= ?";
        //获取该身份证号对应的最新记录的状态"select state as s from personalaccount where identityid='"+id+"' order by s asc;"
        let SqlParams = [id, id];
        dbQuery(getSql, SqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT count identityid ERROR] - ', err.message);
                return;
            }
            if (result.length <= 0) {
                callback(-1);   // 不存在这个身份证号的用户
            }
            else{
                if (result[0].s=='normal') {   // 正常  可继续挂失
                    callback(1);
                } else if (result[0].s=='logout') {   // 已销户
                    callback(-2);
                } else if (result[0].s=='frozen') {   // 已挂失
                    callback(-3);
                } else {
                    callback(-4);
                }
            }
        });
    };

	this.losepaccount = function (id, callback) {
        // 改的是最新一条的状态
        let getSql =  "update personalaccount set state='frozen' where identityid= ? and registertime=(select r from (select max(registertime) as r from personalaccount  where identityid= ? )u)";
        //"update personalaccount set state='frozen' where identityid='"+id+"';"
        let SqlParams = [id, id];
        dbQuery(getSql, SqlParams, function (err, result) {
            if (err) {
                console.log('[update personalaccount ERROR] - ', err.message);
                return;
            }
            callback(1);
		});
	};

    this.findcaccount = function (id, callback) {
        let getSql = "select corporateaccount.state as s from corporateaccount,(select max(accountid) as r from corporateaccount  where registrationid= ? ) as u where corporateaccount.accountid=u.r and corporateaccount.registrationid= ? "
        //获取该法人登记号对应的最新记录的状态"select state as s from corporateaccount where registrationid ='"+id+"' order by s asc;";
        let SqlParams = [id, id];
        dbQuery(getSql, SqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT count identityid ERROR] - ', err.message);
                return;
            }
            if (result.length <= 0) {
                callback(-1);   // 不存在这个法人注册登记号码的用户
            } else {
                if (result[0].s=='normal') {   //正常  可继续挂失
                    callback(1);
                } else if (result[0].s=='logout') {   //已销户
                    callback(-2);
                } else if (result[0].s=='frozen') {   //已挂失
                    callback(-3);
                } else {
                    callback(-4);
                }
            }
        });
    };

	this.losecaccount = function (id, callback) {
        // 改的是最新一条的状态
        let getSql =  "update corporateaccount set state='frozen' where registrationid= ? and accountid=(select r from (select max(accountid) as r from corporateaccount where registrationid= ? )u)";
        let SqlParams = [id, id];
        dbQuery(getSql, SqlParams, function (err, result) {
            if (err) {
                console.log('[update corporateaccount ERROR] - ', err.message);
                return;
            }
            callback(1);
		});
	};
}

module.exports = LoseAccount;
