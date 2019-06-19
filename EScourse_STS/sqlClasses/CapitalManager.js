// 数据库连接
var dbQuery = require('../database/MySQLquery');

// 证券经纪商处管理员账户类
function capitalManager () {
	this.login = function (jobberworkerid, jobberworkerpassword, callback) {
		let getSql = 'SELECT jobberworkerid FROM jobberworker WHERE jobberworkerid = '+ jobberworkerid +
		            ' AND jobberworkerpassword = '+ '\''+ jobberworkerpassword + '\'';
		dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback("欢迎您：" + result[0].jobberworkerid);
            } else {
                callback('管理员用户不存在或密码错误！');
            }
        });
	};
}

module.exports = capitalManager;
