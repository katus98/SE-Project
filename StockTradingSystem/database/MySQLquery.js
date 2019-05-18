var mysql  = require('mysql');
var mysql_config = {
    host: 'localhost',   //非本机请填写IP地址胡或者域名
    user: 'root',   //填写数据库用户名，默认root
    password: 'skrv587',   //填写数据库密码
    port: '3306',   //服务端口，MySQL默认3306
    database: 'StockTradingSys'   //填写数据库名称, 统一StockTradingSys
};
var pool = mysql.createPool(mysql_config);

// function handleDisconnection() {
//     var connection = mysql.createConnection(mysql_config);
//     connection.connect(function (err) {
//         if (err) {
//             setTimeout('handleDisconnection()', 2000);
//         }
//     });
//
//     connection.on('error', function (err) {
//         logger.error('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             logger.error('db error 执行重连' + err.message);
//             handleDisconnection();
//         } else {
//             throw err;
//         }
//     });
//     exports.connection = connection;
// }
// exports.handleDisconnection = handleDisconnection;

var MySQLquery = function (Sql, SqlParams, callback) {
    pool.getConnection(function (error, connect) {
        if (error) {
            callback(error, null, null);
        } else {
            connect.query(Sql, SqlParams, function (err, results, fields) {
                callback(err, results, fields);
            });
            connect.release();
        }
    });
};

module.exports = MySQLquery;
