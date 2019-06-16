const express = require('express');
const mysql = require('mysql');

const dbQuery = require('../database/MySQLquery');

module.exports = function () {
    var router = express.Router();
    var finished = false;

    // router.get('/', (req, res) => {
    //     res.redirect('/login');
    // });

    router.get('/', (req, res) => {
        // res.redirect('/user/index');
        res.render('login');
    });

    router.get('/registeration', (req, res) => {
        res.render('registeration');
    });

    router.get('/changePassword', (req, res) => {
        res.render('changePassword');
    });

    router.post('/registeration/register', (req, res, next) => {

        var sqlQuery = "INSERT INTO user_table(name, username, password, email) VALUES(?, ?, ?, ?)";
        var params = [req.body.name, req.body.username, req.body.password, req.body.email];
        console.log(req.body);
        console.log(req.body.name, req.body.username, req.body.password, req.body.email);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[INSERT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }

            var msg = {"success": true};
            finished = true;
            res.send(msg).end();

        });

    });

    router.post('/submit', (req, res) => {
        // res.redirect('/user/index'); ajax,无法重定向
        var sqlQuery = "select * from capitalaccount where capitalaccountid = ?";
        var params = [req.body.f_username];
        console.log(req.body, req.body.f_username);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg).end();
                return;
            }
            else if (results.length > 0) {
                //test part
                // {
                //     console.log(results);
                //     console.log(results[0]);
                //     console.log(results[0].tradepassword);
                //     var ans = JSON.stringify(results);
                //     console.log(ans);
                //     console.log(ans[0].tradepassword);
                //     console.log(req.body.f_password);
                // }

                if (results[0].tradepassword.toString() == req.body.f_password.toString()) {
                    req.session['admin_id'] = results[0].capitalaccountid;
                    // req.app.locals['admin_id'] = results[0].id;
                    var msg = {"success": true};
                    res.send(msg).end();
                } else {
                    var msg = {"success": false};
                    res.send(msg).end();
                }
            }else{
                var msg={"success":false};
                res.send(msg).end();
            }

        })

    });

    router.post('/changePassword/change', (req, res, next) => {
        var sqlQuery = "select tradepassword from capitalaccount where capitalaccountid = ?";
        var sqlQuery2 = "select cashpassword from capitalaccount where capitalaccountid = ?";
        var params = [req.body.f_username];
        var Pwd = req.body.Pwd;

        console.log(req.body);
        if(Pwd.toString() == 'option1') {
            dbQuery(sqlQuery, params, function (error, results) {
                if (error) {
                    console.log('[SELECT ERROR] - ', error.message);
                    var msg = {"success": false};
                    res.send(msg).end();
                    return;
                }
                else if (results.length > 0) {

                    if (results[0].tradepassword.toString() != req.body.f_password.toString()) {
                        var msg = {"success": false};
                        res.send(msg).end();
                        return;
                    } else {
                        next();
                    }
                } else {
                    var msg = {"success": false};
                    res.send(msg).end();
                }
            })
        }else if(Pwd.toString() == 'option2'){
            dbQuery(sqlQuery2, params, function (error, results) {
                if (error) {
                    console.log('[SELECT ERROR] - ', error.message);
                    var msg = {"success": false};
                    res.send(msg).end();
                    return;
                }
                else if (results.length > 0) {

                    if (results[0].cashpassword.toString() != req.body.f_password.toString()) {
                        var msg = {"success": false};
                        res.send(msg).end();
                        return;
                    } else {
                        next();
                    }
                } else {
                    var msg = {"success": false};
                    res.send(msg).end();
                }
            })
        }
    });

    router.post('/changePassword/change', (req, res, next) => {
        var sqlQuery = "UPDATE capitalaccount SET tradepassword = ? WHERE capitalaccountid = ?";
        var sqlQuery2 = "UPDATE capitalaccount SET cashpassword = ? WHERE capitalaccountid = ?";
        var params = [req.body.f_Npassword1, req.body.f_username];
        console.log(req.body);
        var Pwd = req.body.Pwd;

        if(Pwd.toString() == 'option1'){
            dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[UPDATE ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg).end();
                return;
            } else {
                console.log(results);
                var msg = {"success": true};
                res.send(msg).end();
                return;
            }

        })
        }else if(Pwd.toString() == 'option2'){
            dbQuery(sqlQuery2, params, function (error, results) {
                if (error) {
                    console.log('[UPDATE ERROR] - ', error.message);
                    var msg = {"success": false};
                    res.send(msg).end();
                    return;
                } else {
                    console.log(results);
                    var msg = {"success": true};
                    res.send(msg).end();
                    return;
                }

            })
        }
    });

        var sqlQuery = "UPDATE capitalaccount SET tradepassword = ? WHERE capitalaccountid = ?";
        var params = [req.body.f_Npassword1, req.body.f_username];
        console.log(req.body);

        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[UPDATE ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg).end();
                return;
            } else {
                console.log(results);
                var msg = {"success": true};
                res.send(msg).end();
                return;
            }

        })
    });


    return router;
};

