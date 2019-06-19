/**
 * Module dependencies.
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');  // todo
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var app = express();


// config
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var homeRouter  = require('./routes/home');
var tableRouter = require('./routes/dynamic_table');
var registrationRouter = require('./routes/registration');
var changepswRouter = require('./routes/change_password');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);  // todo
app.set('view engine', 'html');  //app.set('view engine', 'ejs');
// set for session
app.set('trust proxy', 1);


//---------------- MIDDLEWARE ----------------//

// app-level middleware setting
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    saveUninitialized: true, // 是否自动初始化 默认为true
    resave: false,// 当用户session无变化的时候依然自动保存
    secret: 'shhhh, very secret',
    cookie: { maxAge: 1000 * 60 * 15},  // 15 min
    rolling: true // 每次请求的时候覆写cookie
}));

// router level middleware setting
// app.use(mount point, router)
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/home',  homeRouter );
app.use('/logout', logoutRouter);
app.use('/dynamic_table', tableRouter);
app.use('/registration', registrationRouter);
app.use('/change_password', changepswRouter);
//---------------- MIDDLEWARE ----------------//


//--------------- cross domain --------------//
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// };
// app.use(allowCrossDomain);

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


/**
 * interface NodeModule.exports
 * to expose 'app' when require this .JS
 * or exports.XXX = XXX
 * @any {app}
 */
module.exports = app;
