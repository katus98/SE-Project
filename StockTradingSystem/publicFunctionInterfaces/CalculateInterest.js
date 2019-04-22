var dbConnection = require('../database/MySQLconnection');

//用户类
function CalculateInterest()
{
    this.test = function(){
        console.log('success!');
    };

    this.calculate = function(capitalaccountid,callback)
    {
        let calculateIntSqlOne = "select * from capitalaccount where capitalaccountid="+capitalaccountid;
        //获取本次更新前账户内余额
        var tempmoney;
        var tempinterest;
        var lastupdate_y;
        var lastupdate_m;
        var lastupdate_d;
        var thisupdate_y;
        var thisupdate_m;
        var thisupdate_d;
        var intervaltime;
        dbConnection.query(calculateIntSqlOne, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return ;
        }
        else {
            tempmoney = result[0].availablemoney;
                //获取上次更新时间
                let calculateIntSqlTwo = "select iotime,year(iotime) as lastupdate_y,month(iotime) as lastupdate_m,day(iotime) as lastupdate_d from capitalaccountio where capitalaccountid="
                    +capitalaccountid+" order by iotime desc";
                dbConnection.query(calculateIntSqlTwo,function (err,result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return ;
                    }
                    else if(result.length==0){
                        callback(0.0);
                    }
                    else {
                        lastupdate_y = result[0].lastupdate_y;
                        lastupdate_m = result[0].lastupdate_m;
                        lastupdate_d = result[0].lastupdate_d;
                        let calculateIntSqlThree = "SELECT year(current_time()) as thisupdate_y,month(current_time()) as thisupdate_m,day(current_time()) as thisupdate_d";
                        dbConnection.query(calculateIntSqlThree,function (err,result) {
                            if (err) {
                                console.log('[SELECT ERROR] - ', err.message);
                                return ;
                            }
                            else {
                                thisupdate_y = result[0].thisupdate_y;
                                thisupdate_m = result[0].thisupdate_m;
                                thisupdate_d = result[0].thisupdate_d;
                                intervaltime=360*(thisupdate_y-lastupdate_y)+30*(thisupdate_m-lastupdate_m)+thisupdate_d-lastupdate_d;
                                //利率暂时未定，这里给出一个测试值
                                let rate=0.01;
                                tempinterest = parseFloat(tempmoney)*rate*intervaltime;
                                callback(tempinterest);
                            }
                        });
                    }

                    //tempinterest = result[0].interestremained;
                });
                //获取本次更新时间

                //console.log(thisupdate_y.toString());

        }

        });

    };

}

module.exports = CalculateInterest;
