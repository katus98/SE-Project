var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
var logger = require('morgan');
var ejs = require('ejs');

// 设置路由控制器路径
// 面向终端的总控路由
var firstRouter = require('./routes/first');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
// 交易客户端路由
var usersRouter = require('./routes/user/userControl');
// 资金业务管理平台路由
var capitalManagersRouter = require("./routes/capitalManagers");
var capitalUsersRouter = require("./routes/capitalUsers");
// 证券业务管理平台路由
var securitiesUsersRouter = require('./routes/securitiesUsers');
// 临时后台总控
//var homeRouter = require("./routes/home");

var app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    if(req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

// view engine setup
// 设置 views 文件夹为存放视图文件的目录
app.set('views', path.join(__dirname, 'views'));
// 注册html引擎，并将模板引擎换成html
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// 加载设置
// 加载日志中间件
app.use(logger('dev'));
// 加载解析json的中间件
app.use(express.json());
// 加载解析urlencoded请求体的中间件
app.use(express.urlencoded({ extended: false }));
// 加载解析cookie的中间件
app.use(cookieParser());

// C组登录策略
(function () {
    var keys = [];
    for(var i = 0; i < 100000; i++){
        keys[i] = 'user_' + Math.random();
    }
    app.use(cookieSession(
        {
            name: 'sess_id',
            keys: keys,
            maxAge: 20*60*1000 //20min
        }
    ));
})();

// B组登陆策略
app.use(cookieSession({
    name: 'session',
    secret: 'cloud',
    //Cookie Options
    //maxAge: 24*60*60*1000 //24hours
}));

// 设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// 指定路由控制器
// 设置路由控制器路径
// 面向终端的总控路由
app.use('/', firstRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter());
// 交易客户端路由
app.use('/user', usersRouter());
// 资金业务管理平台路由
app.use('/managerLogin', capitalManagersRouter);
app.use('/userLogin', capitalUsersRouter);
// 证券业务管理平台路由
app.use('/securitiesaccount', securitiesUsersRouter);
// 临时后台总控
//app.use('/home', homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
