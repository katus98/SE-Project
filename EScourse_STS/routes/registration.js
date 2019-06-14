var express = require('express');
var dbConnetion = require('../database/db');
// Router-level middleware
var router = express.Router();


router.get('/', function(req, res, next) {

    res.render('registration')

});


String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};


function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function get_auth(callback){
    let _sql_allstock = 'SELECT * FROM stock';
    var selection_set = [];

    dbConnetion.query(_sql_allstock, (err, rows, fields) => {
        if(err) {
            console.log("error: ", err)
        }
        else {
            for (let i = 0; i < rows.length; i++) {
                selection_set.push(rows[i].code);
                //console.log(selection_set);
            }
            callback(selection_set, Math.trunc(rows.length / 2));
        }
    });


    //return getRandomArrayElements(selection_set, 10);

}

/* add new user */
router.post('/register', function (req, res, next) {
    let _username = req.body.name;
    let _password = req.body.password;
    // let _phone = req.body.phone;
    get_auth((arr, count) => {
        var _auth = getRandomArrayElements(arr, count);
        let ss = _auth[0];
        for(let i = 1; i < _auth.length; i++) {
            ss += ',' + _auth[i]
        }
        console.log(ss);
        let _sql_register = 'INSERT INTO security_practitioner (id, password, authority)' +
            ' VALUES (\'{0}\', \'{1}\', \'{2}\')'.format(_username, _password, ss );
        console.log(_sql_register);

        dbConnetion.query(_sql_register, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err)
            }
            else{
                res.send({status: 1});
            }

        });

    });



});



module.exports = router;
