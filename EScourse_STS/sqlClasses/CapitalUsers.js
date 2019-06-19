// 数据库连接
var dbQuery = require('../database/MySQLquery');

// 用户类
function capitalUsers () {
    this.login = function (capitalaccountid, cashpassWord, callback) {
        /*let getSql = 'SELECT capitalaccountid FROM capitalaccount WHERE capitalaccountid = '+ capitalaccountid +
                    ' AND cashpassWord = '+ '\''+ cashpassWord + '\'';*/
        let getSql = 'SELECT capitalaccountid FROM capitalaccount WHERE capitalaccountid = '+ capitalaccountid +
                    ' AND cashpassWord = '+ '\''+ cashpassWord + '\'' + " AND capitalaccountstate = \'normal\'";
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("欢迎您：" + result[0].capitalaccountid);
            } else {
                callback('用户不存在或密码错误！');
            }
        });
    };
}

module.exports = capitalUsers;
