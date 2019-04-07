//连接本地的MySQL数据库，并实现简单的查询，控制台返回json结果
//作者：孙克染

var mysql  = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',//非本机请填写IP地址胡或者域名
    user: 'root',//填写数据库用户名，默认root
    password: '*****',//填写数据库密码
    port: '3306',//服务端口，MySQL默认3306
    database: 'setest'//填写数据库名称
});

connection.connect();

var userGetSql = 'select * from stock';
connection.query(userGetSql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    console.log('----------SELECT----------');
    console.log(result);
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$');
});

connection.end();
