const express = require('express');
const mysql = require('mysql');

const dbQuery = require('../../database/MySQLquery');

let SecuritiesAccount = require('../../sqlClasses/SecuritiesAccount');
let CapitalAccount = require('../../sqlClasses/CapitalAccount');
let Stock = require('../../sqlClasses/Stock');
let Instructions = require('../../sqlClasses/Instructions');

let User = require('../../publicFunctionInterfaces/Users');
let Match = require('../../publicFunctionInterfaces/Match');

module.exports = function () {
    var router = express.Router();


    //检查登陆
    router.use((req, res, next)=>{
        if(!req.session['admin_id']){
            res.redirect('../login');
        }else{
            next();
        }
    });

    //登出
    router.post('/logout',(req, res)=>{
        var data = {success:false};
        try {
            req.session['admin_id'] = null;
        }catch{
            res.end(data);
        }
        data.success = true;
        res.end(data);
    })


    router.get('/index', (req, res) => {
        res.render('index');
    });

    router.get('/ui', (req, res) => {
        res.render('ui');
    });

    router.get('/tab-panel', (req, res) => {
        res.render('tab-panel');
    });

    router.get('/undo', (req, res) => {
        res.render('undo');
    });

    router.get('/chart', (req, res) => {
        res.render('chart');
    });

    router.get('/table', (req, res) => {
        res.render('table');
    });

    router.get('/Trading_instructions', (req, res) => {
        res.render('Trading_instructions');


        // console.log("Dividing line ------------------------------------------------------------------");
        // var sql = "SELECT availablemoney FROM capitalaccount WHERE relatedsecuritiesaccountid = " + req.session['admin_id'];
        // db.query(sql, function (error, results) {
        //     req.session['availablemoney'] = results[0].availablemoney;
        //     console.log("avaisadmont?????????????????????????????????????????????????" + results[0].availablemoney);
        //     console.log("avaisadmont?????????????????????????????????????????????????" + req.session['availablemoney']);
        // });
    });

    router.get('/blank', (req, res) => {
        res.render('blank');
    });

    ////////////////////////////////////////////
    // --------------sj's part----------------//
    ////////////////////////////////////////////

    router.post('/index', (req, res, next) => {
        console.log("sfdasfdasfdasfadsfadsfda  -----------------------------------------  ");
        var sqlQuery = "with account as (select relatedsecuritiesaccountid as accountid from capitalaccount where capitalaccountid = " + req.session['admin_id'] + "),\n" +
            "     person as (select personid from idreference,account where idreference.accountid = account.accountid)\n" +
            "            SELECT person.personid, stockid, current_price, stocknum, frozenstocknum, stockcost, (current_price-stockcost)*stocknum as income, updatetime FROM stock, person,stockhold WHERE stockhold.personid = person.personid and stock.code = stockid and (stocknum <> 0 or frozenstocknum <> 0)";

        var params = [req.session['admin_id']];   //[req.body.id];
        console.log("cookieSession:   " + params);
        // console.log(req.body.id);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            console.log(results);


            res.send(JSON.stringify(results)).end();
        });

    });

    router.post('/capital', (req, res, next) => {
        var sqlQuery = "select capitalaccountid, availablemoney, frozenmoney, capitalaccountstate from capitalaccount where capitalaccountid = ?";
        var params = [req.session['admin_id']];
        console.log(req.body);
        console.log(req.body.id);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            console.log(results);

            var msg = {"success": true, results};
            finished = true;

            res.send(msg).end();
        });

    });

    // router.post('/Trading_instructions/buy_table', (req, res) => {
    //     console.log("-------------------------------------------------------------------------------");
    //     var sql = "SELECT * FROM stock";
    //
    //     db.query(sql, function (err, results) {
    //         if (err) {
    //             console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
    //             return;
    //         }
    //         // console.log('SELECT result: --------------- \n', results);
    //         console.log('SELECT result 0 : --------------- \n', JSON.stringify(results));
    //         // var json = [];
    //         // var row1 = {"draw":1};
    //         // var row2 = {"recordsTotal":results.length};
    //         // var row3 = {"recordsFiltered":results.length};
    //         //
    //         // json.push(row1);
    //         // json.push(row2);
    //         // json.push(row3);
    //         // json.push({"data":results});
    //         // console.log('SELECT result 1 : --------------- \n', json);
    //         // console.log('SELECT result 2 : --------------- \n', JSON.stringify(json));
    //         res.end(JSON.stringify(results));
    //     });
    // });
    router.post('/searchAll', (req, res) => {
        console.log("------------------------------Search All----------------------------------------------------");
        var sqlQuery;
        sqlQuery = "with\n" +
            "\t\tday as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE group by code ),\n" +
            "\t\tweek as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-7 group by code ),\n" +
            "\t\tmonth as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-30 group by code ),\n" +
            "\t\treqBuy as (select code, max(price) as max from bids group by code),\n" +
            "\t\treqSell as (select code, min(price) as min from asks group by code),\n" +
            "\t\tinterest as (select * from intereststock where capitalaccountid = "+req.session['admin_id']+")\n" +
            "\t\t\n" +
            "\t\tselect stock.code, name_stock, current_price, reqBuy.max as maxBuyPrice, reqSell.min as minSellPrice,day.max as daymax, day.min as daymin, week.max as weekmax, week.min as weekmin, month.max as monthmax, month.min as monthmin, notification, interestprice, intereststate\n" +
            "\t\tfrom ((((((stock left join reqBuy on stock.code = reqBuy.code)\n" +
            "\t\tleft join reqSell on stock.code = reqSell.code)\n" +
            "\t\tleft join day on stock.code=day.code)\n" +
            "\t\tleft join week on stock.code=week.code)\n" +
            "\t\tleft join month on stock.code=month.code)\n" +
            "\t\tleft join interest on stock.code=interest.stockid)";
        console.log(req.body);
        // console.log(req.body.id);
        dbQuery(sqlQuery, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            console.log("这是results xxxxx:  " + JSON.stringify(results));

            // var msg = {"success": true, results};
            finished = true;

            // res.send(msg).end();
            res.end(JSON.stringify(results));
        });
    });

    router.post('/searchInterest', (req, res) => {
        console.log("--------------Search for interest----------------------------------------------------");
        var sqlQuery;
        sqlQuery = "WITH admin1 as (SELECT * FROM intereststock WHERE capitalaccountid = " + req.session['admin_id'] + ")" +
            "SELECT s.code, s.name_stock, s.current_price, s.last_endprice, s.today_startprice," +
            "s.amount, s.permission, s.notification, s.percentagepricechange, s.st, a.interestprice " +
            "FROM admin1 as a, stock as s where a.stockid = s.code";
        console.log(req.body);
        // console.log(req.body.id);
        dbQuery(sqlQuery,"", function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            console.log("这是results xxxxx:  " + JSON.stringify(results));

            // var msg = {"success": true, results};
            finished = true;

            // res.send(msg).end();
            res.end(JSON.stringify(results));
        });
    });

    router.post('/checkInterest', (req, res) => {
        console.log("--------------Check for interest----------------------------------------------------");
        var sqlQuery;
        sqlQuery = "SELECT current_price FROM stock WHERE code = ?";
        console.log(req.body);
        var params = [req.body.stockid];
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }else{
                if(results[0].current_price <= req.body.interestprice){
                    var msg = {"success": true};
                    res.send(msg);
                    return;
                }else{
                    var msg = {"success": false};
                    res.send(msg);
                    return;
                }
            }
        });
    });

    router.post('/deleteInterest',(req, res)=>{
        var sqlQuery = "DELETE FROM intereststock WHERE capitalaccountid = "+req.session['admin_id']+" and stockid = ?";
        var params = [req.body.stockid];
        dbQuery(sqlQuery, params, function (error, results) {
            if(error){
                console.log('[DELETE ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }else{
                var msg = {"success": true};
                res.send(msg);
            }
        })
    });

    router.post('/addInterest',(req, res)=>{
        console.log("--------------Add Interest----------------------------------------------------");
        var sqlQuery = "INSERT intereststock(capitalaccountid, stockid, interestprice, intereststate) " +
            "VALUES ("+req.session['admin_id']+",? ,?, 1)";
        var params = [req.body.stockid, req.body.interestprice];
        dbQuery(sqlQuery, params, function (error, results) {
            if(error){
                console.log('[INSERT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }else{
                var msg = {"success": true};
                res.send(msg);
            }
        })
    });

    router.post('/searchByID', (req, res, next) => {
        console.log("xxxx-----------------121312321--------------------------------------------------------------");
        var sqlQuery;
        var params;
        sqlQuery = "with\n" +
            "\t\tday as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE group by code ),\n" +
            "\t\tweek as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-7 group by code ),\n" +
            "\t\tmonth as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-30 group by code ),\n" +
            "\t\treqBuy as (select code, max(price) as max from bids group by code),\n" +
            "\t\treqSell as (select code, min(price) as min from asks group by code),\n" +
            "\t\tinterest as (select * from intereststock where capitalaccountid = "+req.session['admin_id']+")\n" +
            "\t\t\n" +
            "\t\tselect stock.code, name_stock, current_price, reqBuy.max as maxBuyPrice, reqSell.min as minSellPrice,day.max as daymax, day.min as daymin, week.max as weekmax, week.min as weekmin, month.max as monthmax, month.min as monthmin, notification, interestprice, intereststate\n" +
            "\t\tfrom ((((((stock left join reqBuy on stock.code = reqBuy.code)\n" +
            "\t\tleft join reqSell on stock.code = reqSell.code)\n" +
            "\t\tleft join day on stock.code=day.code)\n" +
            "\t\tleft join week on stock.code=week.code)\n" +
            "\t\tleft join month on stock.code=month.code)\n" +
            "\t\tleft join interest on stock.code=interest.stockid)\n" +
            "where stock.code = ?";
        params = [req.body.stockID];
        console.log(req.body);
        //console.log(req.body.id);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }

            console.log("这是results 002id:  " + JSON.stringify(results));

            // var msg = {"success": true, results};
            finished = true;

            // res.send(msg).end();
            res.end(JSON.stringify(results));
        });
    });

    router.post('/searchByName', (req, res, next) => {
        // console.log("-----------------search by name-------------------------------------------------------------");
        var sqlQuery;
        var params;
        params = [req.body.stockName];
        sqlQuery = "with\n" +
            "\tday as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE group by code ),\n" +
            "\tweek as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-7 group by code ),\n" +
            "\tmonth as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-30 group by code ),\n" +
            "\treqBuy as (select code, max(price) as max from bids group by code),\n" +
            "\treqSell as (select code, min(price) as min from asks group by code),\n" +
            "\tinterest as (select * from intereststock where capitalaccountid = " + req.session['admin_id'] + ")\n" +
            "\tselect stock.code, name_stock, current_price, reqBuy.max as maxBuyPrice, reqSell.min as minSellPrice,day.max as daymax, day.min as daymin, week.max as weekmax, week.min as weekmin, month.max as monthmax, month.min as monthmin, notification, interestprice, intereststate\n" +
            "\tfrom ((((((stock left join reqBuy on stock.code = reqBuy.code)\n" +
            "\tleft join reqSell on stock.code = reqSell.code)\n" +
            "\tleft join day on stock.code=day.code)\n" +
            "\tleft join week on stock.code=week.code)\n" +
            "\tleft join month on stock.code=month.code)\n" +
            "\tleft join interest on stock.code=interest.stockid)\n" +
            "\twhere stock.name_stock LIKE '%" + params + "%'";
        console.log(req.body);
        //console.log(req.body.id);
        dbQuery(sqlQuery,  function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }

            console.log("这是results 002id:  " + JSON.stringify(results));

            // var msg = {"success": true, results};
            finished = true;

            // res.send(msg).end();
            res.end(JSON.stringify(results));
        });
    });


    router.post('/searchByPrice', (req, res, next) => {
        console.log("3-------------------------------12------------------------------------------------");
        var sqlQuery;
        var params;
        sqlQuery = "with\n" +
            "\t\tday as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE group by code ),\n" +
            "\t\tweek as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-7 group by code ),\n" +
            "\t\tmonth as (with history as (select stock.code, stock.current_price, stock_history.lowest, stock_history.highest, stock_history.time from stock_history, stock where stock_history.code = stock.code) select code, max(highest) as max, min(lowest) as min from history where time>=CURRENT_DATE-30 group by code ),\n" +
            "\t\treqBuy as (select code, max(price) as max from bids group by code),\n" +
            "\t\treqSell as (select code, min(price) as min from asks group by code),\n" +
            "\t\tinterest as (select * from intereststock where capitalaccountid = "+req.session['admin_id']+")\n" +
            "\t\t\n" +
            "\t\tselect stock.code, name_stock, current_price, reqBuy.max as maxBuyPrice, reqSell.min as minSellPrice,day.max as daymax, day.min as daymin, week.max as weekmax, week.min as weekmin, month.max as monthmax, month.min as monthmin, notification, interestprice, intereststate\n" +
            "\t\tfrom ((((((stock left join reqBuy on stock.code = reqBuy.code)\n" +
            "\t\tleft join reqSell on stock.code = reqSell.code)\n" +
            "\t\tleft join day on stock.code=day.code)\n" +
            "\t\tleft join week on stock.code=week.code)\n" +
            "\t\tleft join month on stock.code=month.code)\n" +
            "\t\tleft join interest on stock.code=interest.stockid)\n" +
            "where stock.current_price >= ? and stock.current_price <= ?";
        params = [req.body.priceFloor,req.body.priceCap];
        console.log(req.body);
        // console.log(req.body.id);
        dbQuery(sqlQuery, params, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] - ', error.message);
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            // console.log(results);


            console.log("这是results 003price:  " + JSON.stringify(results));

            // var msg = {"success": true, results};
            finished = true;

            // res.send(msg).end();
            res.end(JSON.stringify(results));
        });

    });





    //-------------------------------
    //zjh's Part
    //--------------------------------

    router.post('/checkFloorCeil', (req, res) => {
        console.log("Dividing line ------------------------------------------------------------------");
        var sql = "SELECT * FROM stock WHERE code = " + req.body.stockid;
        dbQuery(sql, "",function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', error.message);
                return;
            }
            console.log(results);
            res.end(JSON.stringify(results));
        });
    });

    router.post('/Trading_instructions/get_availablemoney', (req, res) => {
        console.log("Dividing line ------------------------------------------------------------------");
        console.log(req.session['admin_id']);
        var sql = "SELECT availablemoney FROM capitalaccount WHERE capitalaccountid = ?";
        let sqlPrime = [req.session['admin_id']];
        dbQuery(sql, sqlPrime, function (error, results) {
            if (error) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', error.message);
                return;
            }
            console.log(results);
            // req.session['availablemoney'] = results[0].availablemoney;
            // console.log("avaisadmont?????????????????????????????????????????????????" + results[0].availablemoney);
            // console.log("avaisadmont?????????????????????????????????????????????????" + req.session['availablemoney']);
            // console.log(results);
            // console.log(JSON.stringify(results));
            // console.log(JSON.stringify(results[0].availablemoney));
            res.send(JSON.stringify(results[0].availablemoney));
        });
    });

    router.post('/Trading_instructions/buy_table', (req, res) => {
        console.log("-----11111", req.body);
        var sql = "SELECT * FROM stock";

        dbQuery(sql, "",function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
                return;
            }
            // console.log('SELECT result: --------------- \n', results);
            console.log('SELECT result 0 : --------------- \n', JSON.stringify(results));
            // var json = [];
            // var row1 = {"draw":1};
            // var row2 = {"recordsTotal":results.length};
            // var row3 = {"recordsFiltered":results.length};
            //
            // json.push(row1);
            // json.push(row2);
            // json.push(row3);
            // json.push({"data":results});
            // console.log('SELECT result 1 : --------------- \n', json);
            // console.log('SELECT result 2 : --------------- \n', JSON.stringify(json));
            res.end(JSON.stringify(results));
        });
    });

    router.post('/Trading_instructions/sell_table', (req, res) => {
        console.log("xxxxxxxxxxxxxxxxxxxx  "+req.session['admin_id']);

        // var sql = "with account as (select relatedsecuritiesaccountid as accountid from capitalaccount where capitalaccountid = " + req.session['admin_id'] + "),\n" +
        //     "\t\tperson as (select personid from idreference,account where idreference.accountid = account.accountid)\n" +
        //     "\n" +
        //     "            SELECT person.personid, stockid, stocknum, frozenstocknum, stockcost, updatetime FROM person,stockhold WHERE stockhold.personid = person.personid";

        var sql = "with account as (select relatedsecuritiesaccountid as accountid from capitalaccount where capitalaccountid = " + req.session['admin_id'] + "),\n" +
            "     person as (select personid from idreference,account where idreference.accountid = account.accountid)\n" +
            "            SELECT person.personid, stockid, current_price, stocknum, frozenstocknum, stockcost, (current_price-stockcost)*stocknum as income, updatetime "+
            "FROM stock, person,stockhold WHERE stockhold.personid = person.personid and stock.code = stockid and (stocknum <> 0 or frozenstocknum <> 0)";

        dbQuery(sql, "",function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
                return;
            }
            // console.log('SELECT result: --------------- \n', results);
            console.log('SELECT result 0 : --------------- \n', JSON.stringify(results));
            // var json = [];
            // var row1 = {"draw":1};
            // var row2 = {"recordsTotal":results.length};
            // var row3 = {"recordsFiltered":results.length};
            //
            // json.push(row1);
            // json.push(row2);
            // json.push(row3);
            // json.push({"data":results});
            // console.log('SELECT result 1 : --------------- \n', json);
            // console.log('SELECT result 2 : --------------- \n', JSON.stringify(json));
            res.end(JSON.stringify(results));
        });
    });

    router.post('/Trading_instructions/undo_table', (req, res) => {
        console.log("-------------------------------------------------------------------------------");
        let user = new User();
        user.getPersonIdByCapitalAccountId(req.session['admin_id'], function(result){
            var sql1 = "SELECT 'BUY ' as type, id, time, uid, code, shares, price, shares2trade, timearchived, status FROM bids where uid = " + result.personId;
            var sql2 = "SELECT 'SELL' as type, id, time, uid, code, shares, price, shares2trade, timearchived, status FROM asks where uid = " + result.personId;
            var sql = sql1 + " UNION ALL " + sql2;

            dbQuery(sql, "",function (err, results) {
                if (err) {
                    console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
                    return;
                }
                // console.log('SELECT result: --------------- \n', results);
                console.log('SELECT result 0 : --------------- \n', JSON.stringify(results));
                // var json = [];
                res.end(JSON.stringify(results));
            });
        });
    });

    router.post('/undo/undo_table', (req, res) => {
        console.log("-------------------------------------------------------------------------------");
        var sid = req.session['admin_id'];
        console.log("sid = " + sid);
        var sql1 = "SELECT 'BUY ' as type, id, time, uid, code, shares, price, shares2trade, timearchived, status FROM bids where uid = " + sid;
        var sql2 = "SELECT 'SELL' as type, id, time, uid, code, shares, price, shares2trade, timearchived, status FROM asks where uid = " + sid;
        var sql = sql1 + " UNION ALL " + sql2;

        dbQuery(sql, "",function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
                return;
            }
            // console.log('SELECT result: --------------- \n', results);
            console.log('SELECT result 0 : --------------- \n', JSON.stringify(results));
            // var json = [];
            res.end(JSON.stringify(results));
        });
    });

    router.post('/Trading_instructions/btn_selectTable', (req, res) => {
        console.log("-------------------------------------------------------------------------------");
        var sql = "SELECT * FROM " + req.body.searchtype;

        dbQuery(sql, "",function (err, results) {
            if (err) {
                console.log('[SELECT ERROR] -------------------------------------------------------- ', err.message);
                return;
            }
            console.log('SELECT result 1: --------------- \n', results);
            console.log('SELECT result 2: --------------- \n', JSON.stringify(results));
            console.log('SELECT result 3: --------------- \n', JSON.parse(JSON.stringify(results)));
            // res.end(results);
            res.end(JSON.stringify(results));
            // res.end(JSON.parse(JSON.stringify(results)));
        });
    });

    router.post('/Trading_instructions/btn_bid', (req, res, next) => {
        console.log("-------------------------------------------------------------------------------");

        console.log("Check Account ---------------------------------------------------------");
        var sql = "SELECT availablemoney FROM capitalaccount WHERE relatedsecuritiesaccountid = " + req.session['admin_id'];
        dbQuery(sql, "",function (error, results) {
            console.log(results);
            console.log(req.session['availablemoney']);
            req.session['availablemoney'] = results[0].availablemoney;
            console.log(req.session['availablemoney']);
            if (results[0].availablemoney < parseInt(req.body.share) * parseFloat(req.body.price)){
                var msg = {"success": false};
                res.send(msg).end();
            }
            else{
                console.log("Start Insert ---------------------------------------------------------");
                var sqlQuery = "INSERT INTO bids( time, uid, code, shares, price, shares2trade, timearchived, status) " +
                    "VALUES( DEFAULT, ?, ?, ?, ?, 64, null, 'partial')";
                var params = [req.session['admin_id'], req.body.stockid, parseInt(req.body.share), parseFloat(req.body.price)];
                console.log(req.body);
                // console.log(req.body.name, req.body.username, req.body.password, req.body.email);
                dbQuery(sqlQuery, params, function (error, results) {
                    if (error) {
                        console.log('[INSERT ERROR] ------------------------------------------------------- ', error.message);
                        var msg = {"success": false};
                        res.send(msg);
                        return;
                    }
                    else{
                        sql = "UPDATE capitalaccount SET availablemoney = ? WHERE relatedsecuritiesaccountid = ?";
                        params = [req.session['availablemoney'] - parseInt(req.body.share) * parseFloat(req.body.price), req.session['admin_id']];
                        dbQuery(sql, params, function (error, results) {
                            if (error) {
                                console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                                var msg = {"success": false};
                                res.send(msg);
                                return;
                            }
                            else{
                                sql = "UPDATE capitalaccount SET frozenmoney = frozenmoney+? WHERE relatedsecuritiesaccountid = ?";
                                params = [parseInt(req.body.share) * parseFloat(req.body.price), req.session['admin_id']];
                                dbQuery(sql, params, function (error, results) {
                                    if (error) {
                                        console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                                        var msg = {"success": false};
                                        res.send(msg);
                                        return;
                                    }
                                    else{
                                        var msg = {"success": true};
                                        finished = true;
                                        res.send(msg).end();
                                        // setTimeout(function(){res.redirect('login')},5000);
                                        // res.redirect('../login');
                                        // next();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        // res.redirect('../login');
    });

    router.post('/Trading_instructions/btn_ask', (req, res, next) => {
        console.log("-------------------------------------------------------------------------------");
        var sql = "SELECT * FROM stockhold WHERE personid = "+req.session['admin_id']+" AND stockid = '"+req.body.stockid+"'";
        dbQuery(sql, "",function (error, results) {
            console.log(results);
            if (results[0].stocknum - results[0].frozenstocknum < req.body.share && true){
                var msg = {"success": false};
                res.send(msg);
                return;
            }
            else{
                var sqlQuery = "INSERT INTO asks(time, uid, code, shares, price, shares2trade, timearchived, status) " +
                    "VALUES(DEFAULT, ?, ?, ?, ?, 64, null, 'partial')";
                var params = [req.session['admin_id'], req.body.stockid, parseInt(req.body.share), parseFloat(req.body.price)];
                console.log(req.body);
                // console.log(req.body.name, req.body.username, req.body.password, req.body.email);
                dbQuery(sqlQuery, params, function (error, results) {
                    if (error) {
                        console.log('[INSERT ERROR] ------------------------------------------------------- ', error.message);
                        var msg = {"success": false};
                        res.send(msg);
                        return;
                    }
                    else{
                        var sql3 = "UPDATE stockhold SET frozenstocknum = frozenstocknum + ? WHERE personid = ? AND stockid = ?";
                        var para = [parseInt(req.body.share), req.session['admin_id'], req.body.stockid];
                        dbQuery(sql3, para, function (error, results) {
                            console.log(sql3);
                            if (error) {
                                console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                                var msg = {"success": false};
                                res.send(msg);
                                return;
                            }
                            else{
                                var msg = {"success": true};
                                finished = true;
                                res.send(msg).end();
                                // setTimeout(function(){res.redirect('login')},5000);
                                // res.redirect('../login');
                                // next();
                            }
                        });
                    }
                });
            }
        });

        // res.redirect('../login');
    });

    router.post('/Trading_instructions/btn_undo', (req, res, next) => {
        console.log("-------------------------------------------------------------------------------");

        if(req.body.type == "SELL"){
            var sql2 = "SELECT * from asks  WHERE id = ? and uid = ? and status = ?";
            var params = [req.body.id, req.session['admin_id'], 'partial'];
            dbQuery(sql2, params, function (error, results) {
                if (error) {
                    console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                    var msg = {"success": false};
                    res.send(msg);
                    return;
                }

                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                console.log(results);
                console.log(results.length == 0);
                console.log(JSON.stringify(results) == []);
                if(results.length == 0){
                    var msg = {"success": false};
                    res.send(msg);
                    console.log("there is somgwr");
                    return;
                }
                else{
                    sql2 = "UPDATE asks set status = 'withdrawn'  WHERE id = ? and uid = ?;";
                    params = [req.body.id, req.session['admin_id']];
                    dbQuery(sql2, params, function (error, results) {
                        if (error) {
                            console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                            var msg = {"success": false};
                            res.send(msg);
                            return;
                        }
                        else{
                            var msg = {"success": true};
                            res.send(msg).end();
                        }
                    });
                }
            });
        }
        else{
            var sql1 = "SELECT * from bids  WHERE id = ? and uid = ? and status = ?";
            var params = [req.body.id, req.session['admin_id'], 'partial'];
            dbQuery(sql1, params, function (error, results) {
                if (error) {
                    console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                    var msg = {"success": false};
                    res.send(msg);
                    return;
                }

                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                console.log(results);
                console.log(results.length == 0);
                console.log(JSON.stringify(results) == []);
                if(results.length == 0){
                    var msg = {"success": false};
                    res.send(msg);
                    console.log("there is somgwr");
                    return;
                }
                else{
                    sql1 = "UPDATE bids set status = 'withdrawn'  WHERE id = ? and uid = ?;";
                    params = [req.body.id, req.session['admin_id']];
                    dbQuery(sql1, params, function (error, results) {
                        if (error) {
                            console.log('[UPDATE ERROR] ------------------------------------------------------- ', error.message);
                            var msg = {"success": false};
                            res.send(msg);
                            return;
                        }
                        else{
                            var msg = {"success": true};
                            res.send(msg).end();
                        }
                    });
                }
            });
        }

        // end

    });

    router.post('/orderSubmit', function (req, res) {
        console.log(req.body);
        req.body.userId = req.session['admin_id'];
        let promise1 = new Promise(function (resolve, reject) {
            let res0 = {result: false, remark: ""};
            let user = new User();
            user.checkAllAccountValidity(parseInt(req.body.userId), function (result0) {
                if (result0.result === true) {
                    let stock = new Stock();
                    stock.getStockPermissionByStockId(req.body.stockId, function (result) {
                        if (result === "1") {
                            let instructions = new Instructions();
                            let capitalAccount = new CapitalAccount();
                            if (req.body.tradeType === "sell") {
                                stock.getStockNumberByPersonIdAndStockId(result0.personId, req.body.stockId, function (result) {
                                    if (result === 'notFound') {
                                        res0.remark = "证券账户持股存在问题！";
                                        resolve(res0);
                                    } else {
                                        let stockNum = parseInt(result);
                                        if (stockNum < parseInt(req.body.stockNum)) {
                                            res0.remark = "证券账户对应股票持股数不足, 仅持有" + stockNum + "股!";
                                            resolve(res0);
                                        } else {
                                            instructions.addTempInstructions('sell', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                if (result.status === false) {
                                                    res0.remark = "指令存在问题：" + result.info;
                                                    resolve(res0);
                                                } else {
                                                    stock.convertStockToFrozenStock(result0.personId, req.body.stockId, parseInt(req.body.stockNum), function (result) {
                                                        if (result === true) {
                                                            res0.result = true;
                                                            res0.remark = "股票出售指令发布成功!";
                                                        } else {
                                                            res0.remark = "股票出售指令发布失败, 股票冻结失败!";
                                                        }
                                                        resolve(res0);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                capitalAccount.getCapitalByCapitalAccountId(parseInt(req.body.userId), function (result) {
                                    if (result.result === false) {
                                        res0.remark = result.remark;
                                        resolve(res0);
                                    } else {
                                        let availableMoney = result.availableMoney;
                                        let moneyThisTime = parseInt(req.body.stockNum)*parseFloat(req.body.pricePer);
                                        if (availableMoney < moneyThisTime) {
                                            res0.remark = "资金账户可用资金不足, 仅剩" + availableMoney + "元!";
                                            resolve(res0);
                                        } else {
                                            // 买家资金流水记录
                                            capitalAccount.ioAndInterest(parseInt(req.body.userId), -moneyThisTime, "股票购买支出", function (result) {
                                                if (result === true) {
                                                    capitalAccount.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), moneyThisTime, function (result) {
                                                        if (result === true) {
                                                            instructions.addTempInstructions('buy', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                                if (result.status === false) {
                                                                    res0.remark = "指令存在问题：" + result.info;
                                                                } else {
                                                                    res0.result = true;
                                                                    res0.remark = "股票购买指令发布成功!";
                                                                }
                                                                resolve(res0);
                                                            });
                                                        } else {
                                                            res0.remark = "转账失败！";
                                                            resolve(res0);
                                                        }
                                                    });
                                                } else {
                                                    res0.remark = "Error: 买家资金流水记录失败！";
                                                    console.log(res0.remark);
                                                    resolve(res0);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        } else if (result === "0") {
                            res0.remark = "该股票不允许交易！";
                            resolve(res0);
                        } else {
                            res0.result = "股票不存在！";
                            resolve(res0);
                        }
                    });
                } else {
                    res0.remark = result0.remark;
                    resolve(res0);
                }
            });
        });
        promise1.then(function (res0) {
            res.end(JSON.stringify(res0));
            if (res0.result === true) {
                //todo: 撮合系统唤醒
                console.log("指令加入缓存成功！");
            }
        });
    });

    router.post('/withdrawInstruction', function (req, res) {
        console.log("Start undo operation:");
        console.log(req.body);
        if(req.body.type == 'BUY '){
            req.body.type = 'buy'
        }
        else if(req.body.type == 'SELL'){
            req.body.type = 'sell'
        }
        // console.log(req.body.type + " and " +  req.body.id)
        let instruction = new Instructions();
        instruction.withdrawInstruction(req.body.type, parseInt(req.body.id), function (result) {
            if (result === true) {
                res.end("撤回成功!");
            } else {
                res.end("撤回失败!");
            }
        });

    });


    router.post('/checkTradePassword', function (req, res) {
        let res0 = {result: false, remark: ""};
        console.log("check trade password --");
        console.log(req.body);

        sql = "SELECT * FROM capitalaccount WHERE capitalaccountid = ?";
        params = [req.session['admin_id']];
        dbQuery(sql, params, function (error, results) {
            if (error) {
                console.log('[checkTradePassword ERROR] ------------------------------------------------------- ', error.message);
                res0.result = false;
                res0.remark = "系统发生错误！";
                res.end(JSON.stringify(res0));
                return;
            }
            else{
                if(req.body.password == results[0].cashpassword){
                    res0.result = true;
                    res0.remark = "验证成功";
                    res.end(JSON.stringify(res0));
                }
                else{
                    res0.result = false;
                    res0.remark = "密码错误，请重新输入！";
                    res.end(JSON.stringify(res0));
                }
            }
        });
    });

    return router;
};