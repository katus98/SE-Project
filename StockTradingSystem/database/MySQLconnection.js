var mysql  = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',//非本机请填写IP地址胡或者域名
    user: 'root',//填写数据库用户名，默认root
    password: 'skrv587',//填写数据库密码
    port: '3306',//服务端口，MySQL默认3306
    database: 'StockTradingSys'//填写数据库名称
});
//connection.connect();

// var userGetSql = 'select * from stock';
// connection.query(userGetSql, function (err, result) {
//     if (err) {
//         console.log('[SELECT ERROR] - ', err.message);
//         return;
//     }
//     console.log('----------SELECT----------');
//     console.log(result);
//     console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$');
// });

module.exports = connection;

//connection.end();