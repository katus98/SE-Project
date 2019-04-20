// 引用的自定义模块类
let SecuritiesAccount = require('../sqlClasses/SecuritiesAccount');
let CapitalAccount = require('../sqlClasses/CapitalAccount');

/*
* User类：包含方法：检查全账户有效性
* 维护小组：A、B组
* 总负责人：孙克染
* */
function User() {
    /*
    方法名称：checkAllAccountValidity
    实现功能：通过资金账户ID检查全账户有效性（即账户是否允许交易）
    传入参数：capitalAccountId（整数或者数字字符串）、回调函数
    回调参数：object（类json）：res = {result: bool（是否有效）, remark: ""（无效原因）};
    编程者：孙克染（demo）
    * */
    this.checkAllAccountValidity = function (capitalAccountId, callback) {
        let res = {result: false, remark: ""};
        let capitalAccount = new CapitalAccount();
        capitalAccount.getCapitalAccountStateByCapitalAccountId(capitalAccountId, function (result) {
            if (result === 'normal') {
                capitalAccount.getSecuritiesAccountIdByCapitalAccountId(capitalAccountId, function (result) {
                    if (result === 'notFound') {
                        res.remark = "该资金账户尚未关联证券账户！";
                        callback(res);
                    } else {
                        let securitiesAccount = new SecuritiesAccount();
                        securitiesAccount.getSecuritiesAccountStateBySecuritiesAccountId(parseInt(result), function (result) {
                            if (result === 'normal') {
                                res.result = true;
                                callback(res);
                            } else if (result === 'frozen') {
                                res.remark = "相关联的证券账户已被冻结！";
                                callback(res);
                            } else if (result === 'logout') {
                                res.remark = "相关联的证券账户已注销！";
                                callback(res);
                            } else {
                                res.remark = "未找到关联的证券账户！";
                                callback(res);
                            }
                        });
                    }
                });
            } else if (result === 'frozen') {
                res.remark = "资金账户已被冻结！";
                callback(res);
            } else if (result === 'logout') {
                res.remark = "资金账户已注销！";
                callback(res);
            } else {
                res.remark = "未找到相应的资金账户！";
                callback(res);
            }
        });
    }
}

module.exports = User;
