//后端js文件——服务器
//作者：孙克染

var haveMoney = 10000;//存储在服务器上的数据

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/jquery-3.3.1.js', function (req, res) {
	res.sendFile( __dirname + "/" + "jquery-3.3.1.js" );
});

app.get('/leadingEnd.js', function (req, res) {
	res.sendFile( __dirname + "/" + "leadingEnd.js" );
});

app.get('/home.html', function (req, res) {
   res.sendFile( __dirname + "/" + "home.html" );
});

app.post('/postTrade', urlencodedParser, function (req, res) {
	//简单的处理过程
	var resultMessage = 1;
	var deltaMoney = parseFloat(req.body.money);
	if (req.body.tradeType === "buy") {
		deltaMoney = -deltaMoney;
	}
	haveMoney += deltaMoney;
	if (haveMoney < 0) {
		haveMoney -= deltaMoney;
		resultMessage = 0;
	}
	//处理过程结束

	//为了避免一个类似安全性的报错
	res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'});

	// 输出 JSON 格式
	var response = {
		resultMessage: resultMessage,
		haveMoney: haveMoney
	};
	console.log(response);
	res.end(JSON.stringify(response));
});
 
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
