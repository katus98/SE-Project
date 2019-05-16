var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

// 设置路由控制器路径
var firstRouter = require('./routes/first');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require("./routes/home");

var app = express();

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
// 设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// 指定路由控制器
app.use('/', firstRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);

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
