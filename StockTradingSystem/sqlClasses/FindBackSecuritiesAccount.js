// 数据库连接
let dbQuery = require('../database/MySQLquery');

function FindBack(){
    this.pfindback = function (data, req, callback) {
        let getSql="select personalaccount.state as s,personalaccount.personid as p,personalaccount.accountid as a from personalaccount,(select max(registertime) as r from personalaccount  where identityid="+'"'+req.body.identityid+'"'+") as u where personalaccount.registertime=u.r and personalaccount.identityid="+'"'+req.body.identityid+'"';
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT MAX ACCOUNTID ERROR] - ', err.message);
                callback(-4);
                return;
            } else {
                console.log(result);
                if (result.length>0) {
                    if (result[0].s=='normal') {
                        callback(-1);
                    }
                    if (result[0].s=='logout') {
                        callback(-2);
                    }
                    if (result[0].s=='frozen') {
                        //给idreference表插入数据
                        let getSql = "insert into idreference(accountid,personid) values(?,?)";
                        let SqlParams = [data.a, result[0].p];
                        dbQuery(getSql, SqlParams, function (err, result1) {
                            if (err) {
                                console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                                callback(-4);
                                return;
                            }
                            console.log("已经插入了idreference");
                            if(req.body.agent == 'yes')
                            {
                                //如果存在代办人，那么插入数据时，需要插入代办人属性
                                //给personalaccount表插入数据
                                let getSql2="insert into personalaccount(accountid,name,gender,identityid,homeaddress,work,educationback,workaddress,phonenumber,agentid,personid) values("+
                                    '"' +data.a+'"' +","+'"' +req.body.name+'"' +","+'"' +req.body.gender+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.homeaddress+'"' +","+'"' +req.body.work+'"' +","+'"' +req.body.educationback+'"' +","+'"' +req.body.workaddress+'"' +
                                    ","+'"' +req.body.phonenumber+'"' +","+'"' +req.body.agentid+'"' +","+'"' +result[0].p+'"' +")";
                                dbQuery(getSql2,[],function(err, result2){
                                    if (err) {
                                        console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                                        callback(-4);
                                        return;
                                    }
                                    let getSql33='select DATE_FORMAT(registertime,"%Y-%m-%d %T") as r from personalaccount where accountid='+'"'+data.a+'"';
                                    dbQuery(getSql33,[],function(err, result3){
                                        if (err) {
                                            console.log('[GET registertime ERROR] -', err.message);
                                            callback(-3);
                                            return;
                                        }
                                        callback(result[0].a,result3[0].r);
                                    });
                                });
                            } else {
                                //如果不存在代办人，那么插入数据时，不需要插入代办人属性
                                //给personalaccount表插入数据
                                let getSql2 = "insert into personalaccount(accountid,name,gender,identityid,homeaddress,work,educationback,workaddress,phonenumber,personid) values("+
                                    '"' +data.a+'"' +","+'"' +req.body.name+'"' +","+'"' +req.body.gender+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.homeaddress+'"' +","+'"' +req.body.work+'"' +","+'"' +req.body.educationback+'"' +","+'"' +req.body.workaddress+'"' +
                                    ","+'"' +req.body.phonenumber+'"' +"," +'"' +result[0].p+'"' +")";
                                dbQuery(getSql2, [], function(err,result2){
                                    if (err) {
                                        console.log('[INSERT TO PERSONALACCOUNT ERROR] -', err.message);
                                        callback(-4);
                                        return;
                                    }
                                    let getSql33 = 'select DATE_FORMAT(registertime,"%Y-%m-%d %T") as r from personalaccount where accountid='+'"'+data.a+'"';
                                    dbQuery(getSql33, [], function(err,result3){
                                        if (err) {
                                            console.log('[GET registertime ERROR] -', err.message);
                                            callback(-3);
                                            return;
                                        }
                                        callback(result[0].a,result3[0].r);
                                    });
                                });
                            }
                        });
                    }
                } else {
                    // 找不到数据也不能够允许补办
                    callback(-3);
                }
            }
        });
    };

    this.cfindback = function(data, req, callback){
        //首先排除重复开户的可能性
        let getSql="select corporateaccount.state as s,corporateaccount.personid as p,corporateaccount.accountid as a from corporateaccount,(select max(accountid) as a from corporateaccount  where registrationid="+'"'+req.body.registrationid+'"'+") as u where corporateaccount.accountid=u.a and corporateaccount.registrationid="+'"'+req.body.registrationid+'"';
        dbQuery(getSql, [], function(err, result){
            if (err) {
                console.log('[SELECT MAX ACCOUNTID ERROR] - ', err.message);
                callback(-4);
                return;
            }
            if (result.length > 0) {
                if (result[0].s=='normal') {
                    callback(-1);
                }
                if (result[0].s=='logout') {
                    callback(-2);
                }
                if (result[0].s=='frozen') {
                    //给idreference表插入数据
                    let getSql1 = "insert into idreference(accountid,personid) values(?,?)";
                    let SqlParams1 = [data.a, result[0].p];
                    dbQuery(getSql1, SqlParams1, function(err, result1){
                        if (err) {
                            console.log('[INSERT TO IDREFERENCE ERROR] - ', err.message);
                            callback(-4);
                            return;
                        }
                        let getSql2 = "insert into corporateaccount(accountid,registrationid,licenseid,identityid,name,phonenumber,workaddress,authorizername,authorizeridentityid,authorizerphonenumber,authorizeraddress,personid) values("+
                            '"' +data.a+'"' +","+'"' +req.body.registrationid+'"' +","+'"' +req.body.licenseid+'"' +","+'"' +req.body.identityid+'"' +","+'"' +req.body.name+
                            '"' +","+'"' +req.body.phonenumber+'"' +","+'"' +req.body.workaddress+'"' +","+'"' +req.body.authorizername+'"' +","+'"' +req.body.authorizeridentityid+'"' +","+'"' +req.body.authorizerphonenumber+'"' +","+'"' +req.body.authorizeraddress+'"' +","+'"' +result[0].p+'"' +")";
                        dbQuery(getSql2, [], function(err, result2){
                            if (err) {
                                console.log('[INSERT TO CORPORATEACCOUNT ERROR] -', err.message);
                                callback(-4);
                                return;
                            }
                            let getSql3 = "update capitalaccount set relatedsecuritiesaccountid= ? where relatedsecuritiesaccountid= ?";
                            let SqlParams3 = [data.a, result[0].a];
                            dbQuery(getSql3,SqlParams3,function(err, result3){
                                if (err) {
                                    console.log('[UPDATE CAPITALACCOUNT ERROR]-',err.message);
                                    callback(-4);
                                    return;
                                }
                            });
                        });
                    });
                    callback(1);
                }
            } else {
                callback(-3);
            }
        });
    };

    this.updatecapitalaccount=function (oa, na, callback) {
        console.log("oa: "+oa+"na: "+na);
        let getSql3="update capitalaccount set relatedsecuritiesaccountid= ? where relatedsecuritiesaccountid= ?";
        let SqlParams3 = [na, oa];  //[data.a,result[0].a];
        dbQuery(getSql3,SqlParams3,function(err, result3){
            if (err) {
                console.log('[UPDATE CAPITALACCOUNT ERROR]-',err.message);
                callback(-1);
                return;
            }
            callback(1);
        });
    }
}

module.exports = FindBack;
