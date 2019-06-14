var express = require('express');
// Router-level middleware
var router = express.Router();
var dbConnetion = require('../database/db');


router.get('/', function(req, res, next) {

    if (req.session.user)
    {
        res.render('change_password')
    }
    else
    {
        res.redirect('login')
    }

});


router.post('/change', function (req, res, next) {
    var usr = req.session.user;
    console.log(req.body);
    var _sql_change_password = "SELECT * FROM security_practitioner WHERE id = " + "\'" + usr.id + "\'";

    console.log(_sql_change_password);
    dbConnetion.query(_sql_change_password, (err, rows, fields) => {
        if(err) {
            console.log("111")
        }
        else if (rows.length === 0) {
            console.log("No such User");
            res.send({ status: 0 })
        }
        else {
            if (rows[0].password === req.body.pass_old)
            {
                var _sql_real_change = "UPDATE security_practitioner SET password = ? Where id = ?";
                let q = [req.body.pass_new, usr.id];
                dbConnetion.query(_sql_real_change, q, (err, rows, fields) => {
                    if(err) {
                        console.log("error: ", err)
                    }
                    else {
                        res.send({ status: 1 })
                    }

                });
            }
            else
            {
                res.send({ status: 0 })
            }

        }
    });


});


module.exports = router;
