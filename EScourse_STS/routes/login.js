var express = require('express');
var router = express.Router();
var dbConnetion = require('../database/db');
// var session = require('express-session');


router.get('/', (req, res, next) => {
    // todo : if already signed in, direct to home
    if (req.session.user)
    {
        res.redirect('/home')
    }
    else
    {
        res.render('login')
    }
});


function authentication(name, pass, fn) {
    // if(!module.parent) ???
    console.log('authenticating %s:%s', name, pass);
    let _sql_login_NamePassCheck = 'SELECT * FROM security_practitioner WHERE id = \'' + name + '\'';
    dbConnetion.query(_sql_login_NamePassCheck, (err, rows, fields) => {
        if(err) {
            console.log("error: ", err)
        }
        else if (rows.length === 0) {
            console.log("No such User");
            return fn(new Error('No such User!'));
        }
        else {
            var _user = rows[0];
            console.log(name,  _user.id);
            if(name === _user.id && pass === _user.password)
            {
                return fn(null, _user)
            }
            else
            {
                return fn(new Error('Invalid Password!'))
            }
        }
    });

}

router.post('/', (req, res, next) => {
    let _username = req.body.name;
    let _password = req.body.password;
    authentication(_username, _password, (err, user) => {
        if(user) {
            console.log(user);
            // req.session.regenerate(() => {
            //     req.session.user = user;
            //     req.session.success = 'Authenticated as ' + user.name;
            // });
            req.session.user = user;
            req.session.success = 'Authenticated as ' + user.id;
            console.log(req.session);

            res.send({ status: 1 });
            // res.render('home');
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('/login');
        }

    });
});


module.exports = router;
