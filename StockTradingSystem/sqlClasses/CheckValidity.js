// 检查身份证号码、电话号码是否有效
function CheckValidity () {
    // 此函数用于检查身份证号码是否正确,若正确返回1，若不正确返回错误原因
    this.checkid = function (id, callback) {
        if (id.length != 18) { callback("长度不对"); return; }
        let a = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);
        let sum=0;
        let ans=11;
        for (let i=0; i<17; i++) {
            if (id[i] >= 0 && id[i] <= 9) sum = (sum + a[i] * id[i]) % 11;
            else {
                callback(`第${++i}位不是数字`);
                return;
            }
        }
        // 检查校验码
        if (sum < 2) ans=1-sum;else if(sum>2) ans=12-sum;
        if (id[17]==ans || (id[17]=='x'||id[17]=='X')&&ans==11) {}
        else {
            callback("校验码错误");
            return;
        }
        // 检查是否为成年人
        let tyear=id.substring(6,10);
        let cdate=new Date();
        let cyear=cdate.getFullYear();
        let age=cyear-parseInt(tyear);
        if(age>=18&&age<=120){}
        else{
            callback("年龄不合格");
            return;
        }
        // 检查日期是否有效
        let tmonth = id.substring(10,12);
        let tday = id.substring(12,14);
        let dtyear = parseInt(tyear);
        let dtmonth = parseInt(tmonth);
        let dtday = parseInt(tday);
        if(dtmonth<1||dtmonth>12){
            callback("月份无效");
            return;
        }
        else{
            if (dtmonth==2) {
                if((dtyear%4==0&&dtyear%100!=0)||(dtyear%400==0)){   // 闰年
                    if(dtday<1||dtday>29){
                        callback("日期无效");
                        return;
                    }
                } else {
                    if(dtday<1||dtday>28){
                        callback("日期无效");
                        return;
                    }
                }
            }
            else if(dtmonth==1||dtmonth==3||dtmonth==5||dtmonth==7||dtmonth==8||dtmonth==10||dtmonth==12){
                if(dtday<1||dtday>31){
                    callback("日期无效");
                    return;
                }
            }
            else{
                if(dtday<1||dtday>30){
                    callback("日期无效");
                    return;
                }
            }
        }
        // 检查编码地址是否有效
        let disc=parseInt(id.substring(0,2));
        if ((disc>=11&&disc<=15)||(disc>=21&&disc<=23)||(disc>=31&&disc<=37)||(disc>=41&&disc<=46)||(disc>=50&&disc<=54)||(disc>=61&&disc<=65)||(disc==71)||(disc>=81&&disc<=82)||(disc==91)) {}
        else {
            callback("地址编码无效");
            return;
        }
        callback(1);
    };
    // 检查电话号码有效性
    this.checkphonenumber = function(tel, callback){
        if (tel.length!=11) { callback("长度不对"); return; }
        for (let i=0; i<11; i++) {
            if (tel[i] > 9 && tel[i] < 0){
                callback(`第${++i}位不是数字`);
                return;
            }
        }
        // 检验号段
        let digit=parseInt(tel.substring(0,3));
        if ((digit>=130&&digit<=139)||(digit==140||digit==141||(digit>=144&&digit<=149))||(digit>=150&&digit<=159&&digit!=154)||(digit>=165&&digit<=167)||(digit==170||digit==171||(digit>=173&&digit<=178))||(digit>=180&&digit<=189)||(digit==191||digit==198||digit==199)) {}
        else {
            callback("手机号段无效");
            return;
        }
        callback(1);
    };
}

module.exports = CheckValidity;
