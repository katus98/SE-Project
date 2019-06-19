// 数据库连接
let dbQuery = require('../database/MySQLquery');

function OpenAccount() {
    //个人开户的数据准备
    this.currentpaccount = function (callback) {
        var getSql = "select max(accountid)+1 as a,max(personid)+1 as p from personalaccount";
        dbQuery(getSql,[], function (err, result) {
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
        // 首先我们判断一下是否是重复开户
        let getSql0 = "select personalaccount.state as s from personalaccount,(select max(registertime) as r from personalaccount  where identityid="+'"'+req.body.identityid+'"'+") as u where personalaccount.registertime=u.r and personalaccount.identityid="+'"'+req.body.identityid+'"';
        dbQuery(getSql0,[],function(err,result){
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                callback(-3);
                return;
            } else {
                //调试用语句console.log("result[0].NUM"+result[0].num);
                if (result.length > 0 && result[0].s != 'logout') {
                    // 表中已有同样身份信息的记录，查看这个记录的状态是否为frozen
                    if (result[0].s=='frozen') {
                        callback(-1);
                    }
                    if (result[0].s=='normal') {
                        callback(-2);
                    }
                } else {
                    //给idreference表插入数据
                    let getSql="insert into idreference(accountid,personid) values(?,?)";
                    let SqlParams=[data.a,data.p];
                    dbQuery(getSql, SqlParams,function (err, result) {
                        if (err) {
                            console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                            callback(-3);
                            return;
                        }
                        if (req.body.agent == 'yes') {
                            //如果存在代办人，那么插入数据时，需要插入代办人属性
                            //给personalaccount表插入数据
                            let getSql2="insert into personalaccount(accountid,name,gender,identityid,homeaddress,work,educationback,workaddress,phonenumber,agentid,personid) values("+
                                '"' +data.a+'"' +","+'"' +req.body.name+'"' +","+'"' +req.body.gender+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.homeaddress+'"' +","+'"' +req.body.work+'"' +","+'"' +req.body.educationback+'"' +","+'"' +req.body.workaddress+'"' +
                                ","+'"' +req.body.phonenumber+'"' +","+'"' +req.body.agentid+'"' +","+'"' +data.p+'"' +")";
                            dbQuery(getSql2, [], function (err, result) {
                                if (err) {
                                    console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                                    callback(-3);
                                    return;
                                }
                                let getSql33='select DATE_FORMAT(registertime,"%Y-%m-%d %T") as r from personalaccount where accountid='+'"'+data.a+'"';
                                dbQuery(getSql33, [], function(err,result){
                                    if (err) {
                                        console.log('[GET registertime ERROR] -', err.message);
                                        callback(-3);
                                        return;
                                    }
                                    callback(result[0].r);
                                });
                            });
                        } else {
                            //如果不存在代办人，那么插入数据时，不需要插入代办人属性
                            //给personalaccount表插入数据
                            let getSql2="insert into personalaccount(accountid,name,gender,identityid,homeaddress,work,educationback,workaddress,phonenumber,personid) values("+
                                '"' +data.a+'"' +","+'"' +req.body.name+'"' +","+'"' +req.body.gender+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.homeaddress+'"' +","+'"' +req.body.work+'"' +","+'"' +req.body.educationback+'"' +","+'"' +req.body.workaddress+'"' +
                                ","+'"' +req.body.phonenumber+'"' +"," +'"' +data.p+'"' +")";
                            dbQuery(getSql2,[],function (err, result) {
                                if (err) {
                                    console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                                    callback(-3);
                                    return;
                                }
                                let getSql33='select DATE_FORMAT(registertime,"%Y-%m-%d %T") as r from personalaccount where accountid='+'"'+data.a+'"';
                                dbQuery(getSql33,[],function(err,result){
                                    if (err) {
                                        console.log('[GET registertime ERROR] -', err.message);
                                        callback(-3);
                                        return;
                                    }
                                    callback(result[0].r);
                                });
                            });
                        }
                    });
                    //callback(1);
                }
            }
        });
    };

    // 个人快捷开户的插入操作
    this.insertpaccountQuick = function (data, req, callback) {
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
            } else {
                // 给idreference表插入数据
                let addSql = "insert into idreference(accountid, personid) values(?, ?)";
                let addSqlParams = [data.a, data.p];
                dbQuery(addSql, addSqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                        return;
                    }
                    // 如果不存在代办人，那么插入数据时，不需要插入代办人属性
                    // 给personalaccount表插入数据
                    let addSql2 = "insert into personalaccount(accountid, name, gender, identityid, homeaddress, work, educationback, workaddress, phonenumber, personid) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let addSqlParams2 = [data.a, req.body.name, req.body.gender, req.body.idCardNumber, req.body.address, req.body.job, req.body.education, req.body.company, req.body.phone, data.p];
                    dbQuery(addSql2, addSqlParams2, function (err, result) {
                        if (err) {
                            console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                            return;
                        }
                        callback(1);
                    });
                });
            }
        });
    };

    // 法人开户的数据准备
    this.currentcaccount = function (callback) {
        let getSql = "select max(accountid)+1 as a,max(personid)+1 as p from corporateaccount";
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback(-1);
            }
        });
    };

    // 法人开户的插入操作
    this.insertcaccount = function (data, req, callback) {
        //首先排除重复开户的可能性
        let getSql0 = "select corporateaccount.state as s from corporateaccount,(select max(accountid) as a from corporateaccount  where registrationid="+'"'+req.body.registrationid+'"'+") as u where corporateaccount.accountid=u.a and corporateaccount.registrationid="+'"'+req.body.registrationid+'"';
        dbQuery(getSql0, [], function (err, result) {
            if(result.length>0 && result[0].s!='logout')
            {     
                //表中已有同样身份信息的记录，查看这个记录的状态是否为fozon   
                if (result[0].s=='frozen') {
                    callback(-1);
                }
                if (result[0].s=='normal') {
                    callback(-2);
                }
            } else {
                //给idreference表插入数据
                let getSql="insert into idreference(accountid,personid) values(?,?)";
                let SqlParams = [data.a, data.p];
                dbQuery(getSql, SqlParams, function (err, result) {
                    if (err) {
                        console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                        callback(-3);
                        return;
                    }
                    let getSql2 = "insert into corporateaccount(accountid,registrationid,licenseid,identityid,name,phonenumber,workaddress,authorizername,authorizeridentityid,authorizerphonenumber,authorizeraddress,personid) values("+
                    '"' +data.a+'"' +","+'"' +req.body.registrationid+'"' +","+'"' +req.body.licenseid+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.name+
                    '"' +","+'"' +req.body.phonenumber+'"' +","+'"' +req.body.workaddress+'"' +","+'"' +req.body.authorizername+'"' +","+'"' +req.body.authorizeridentityid+'"' +","+'"' +req.body.authorizerphonenumber+'"' +","+'"' +req.body.authorizeraddress+'"' +","+'"' +data.p+'"' +")";
                    dbQuery(getSql2, [], function (err, result) {
                        if (err) {
                            console.log('[INSERT TO CORPORATEACCOUNT ERROR] -', err.message);
                            callback(-3);
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
                callback(-1);
                return;
            }
            callback(1);
        });
    };
}

module.exports = OpenAccount;
