var express = require('express');
var router = express.Router();
var dbConnetion = require('../database/db');

// just render
router.get('/', (req, res, next) => {
    if(req.session.user){
        res.render('dynamic_table');
    }
    else
    {
        res.redirect('login')
    }
});



String.prototype.format =function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};


router.get('/refresh', (req, res, next) => {
    if(req.session.user){
        // res.render('dynamic_table');
        console.log('querying authed stock info...');
        let _in = (req.session.user.authority).split(',');
        // let _in = ('\"' + req.session.user.authority + '\"').split().join("\",\"");
        var _in_ = "'"+_in[0]+"'";
        for(let i = 1; i < _in.length; i++) {
            _in_ += (",'" + _in[i] + "'");
        }
        // console.log(_in_);

        let _sql_table_refresh = 'SELECT * FROM stock WHERE code IN ({0})'.format(_in_);
        console.log(_sql_table_refresh);
        // let _sql_table_refresh = 'SELECT * FROM stock';
        dbConnetion.query(_sql_table_refresh, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err)
            }
            else {
                // console.log(JSON.stringify(rows));
                let rows_out = [];

                for (let i = 0; i < rows.length; i++) {
                    let r = rows[i];
                    var _blank = "";
                    if (r['permission'] === 1)
                    {
                        _blank = "checked"
                    }

                    var _switch = "<label class=\"switch\"><input type=\"checkbox\" {0} size=\"0.1\"><span class=\"slider round\"></span></label>".format(_blank);
                    var _spinner1 = "<input class=\"tmp\" value={0} size=\"2\">".format(r['percentagepricechange']*100);
                    var _btn_rate_setter = "&nbsp;<button class=\"btn btn-danger\" type=\"button\" >设置</button>";
                    var _btn_detail = "<button data-remodal-target=\"modal\" class=\"btn btn-info\" type=\"button\">查看</button>";
                    //console.log(_switch)
                    let tmp = [r['code'], r['name_stock'], r['current_price'],
                        (r['today_startprice'] - r['current_price']).toFixed(2),
                        ((r['today_startprice']- r['current_price']) / r['today_startprice']*100).toFixed(2),
                    r['today_startprice'], r['last_endprice'],
                        //r['high_price'], r['low_price'],
                    r['turnover'], r['volumn'], _switch, _spinner1+_btn_rate_setter, _btn_detail];
                    // console.log(tmp);
                    rows_out.push(tmp);
                }
                res.send(JSON.stringify(rows_out));
            }
        });
    }
});


router.post('/trade_status', (req, res, next) => {
    if(req.session.user){
        console.log(req.body.msg);
        console.log(req.body.code);
        let _sql_deal_permission = 'UPDATE stock SET permission = ' + req.body.msg + ' Where code = \"' +
            req.body.code + '\"';
        dbConnetion.query(_sql_deal_permission, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err);
                res.send({status: false});
            }
            else {
                // console.log(JSON.stringify(rows));
                res.send({status: true});
            }
        });
    }
});


router.post('/change_rate', (req, res, next) => {
    if(req.session.user){
        console.log(req.body.code);
        console.log(req.body.rate);
        let _sql_deal_permission = 'UPDATE stock SET percentagepricechange = ' + req.body.rate/100 + ' Where code = \"' + req.body.code + '\"';
        dbConnetion.query(_sql_deal_permission, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err)
            }
            else {
                // console.log(JSON.stringify(rows));
                res.send({status: true});
            }
        });
    }
});


router.post('/buy', (req, res, next) => {
    if(req.session.user){
        console.log(req.body.code);
        let _code = req.body.code;
        let _sql_buyrecords = 'SELECT * FROM bids WHERE code = \"{0}\"'.format(_code);
        dbConnetion.query(_sql_buyrecords, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err)
            }
            else {
                let rows_out = [];
                console.log(rows);
                for (let i = 0; i < rows.length; i++) {
                    let r = rows[i];
                    let _out = [r['uid'], r['price'], r['time'], r['shares']];
                    rows_out.push(_out);

                }
                res.send(JSON.stringify(rows_out));
            }
        });
    }
});


router.post('/sell', (req, res, next) => {
    if(req.session.user){
        console.log(req.body.code);
        let _code = req.body.code;
        let _sql_buyrecords = 'SELECT * FROM asks WHERE code = \"{0}\"'.format(_code);
        dbConnetion.query(_sql_buyrecords, (err, rows, fields) => {
            if(err) {
                console.log("error: ", err)
            }
            else {
                let rows_out = [];
                console.log(rows);
                for (let i = 0; i < rows.length; i++) {
                    let r = rows[i];
                    let _out = [r['uid'], r['price'], r['time'], r['shares']];
                    rows_out.push(_out);

                }
                res.send(JSON.stringify(rows_out));
            }
        });
    }
});

module.exports = router;

