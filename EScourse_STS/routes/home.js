var express = require('express');
var schedule = require('node-schedule');
// Router-level middleware
var router = express.Router();
var job1 = '', job2 = '';

// 引入自定义模块接口
let Match = require('../publicFunctionInterfaces/Match');


router.get('/', function(req, res, next) {
    if (req.session.user) {
        let match = new Match();
        match.getStateOfMatch(function (result) {
            let st = (result.start) ? '1' : '0';
            let end = (job1 === '' && job2 === '') ? '0' : '1';
            res.render('home', {state1: st, state2: end});
        });
    } else {
        res.redirect('login')
    }
});

router.post('/start', function (req, res) {
    let match = new Match();
    match.getStateOfMatch(function (result) {
        if (result.start) {
            res.end('撮合系统已经运行!');
        } else {
            match.startMatching(function (result) {
                res.end("撮合系统启动成功!");
                match.convertTempInstructionsToInstructions(function (result) {
                    //res.end(result.remark);
                });
            });
        }
    });
});

router.post('/stop', function (req, res) {
    let match = new Match();
    match.getStateOfMatch(function (result) {
        if (result.start) {
            match.stopMatching(function (result) {
                res.end("撮合系统关闭成功!");
            });
        } else {
            res.end("撮合系统未在运行!");
        }
    });
});

router.post('/startSystem', function (req, res) {
    if (job1 === '' && job2 === '') {
        let rule1 = new schedule.RecurrenceRule();
        rule1.dayOfWeek = [new schedule.Range(1, 5)];
        rule1.hour = 8;
        rule1.minute = 0;
        rule1.second = 0;
        job1 = schedule.scheduleJob(rule1, function () {
            let match = new Match();
            match.startMatching(function (result) {
                console.log("今日开盘!");
                match.convertTempInstructionsToInstructions(function (result) {
                    //res.end(result.remark);
                });
            });
        });
        let rule2 = new schedule.RecurrenceRule();
        rule2.dayOfWeek = [new schedule.Range(1, 5)];
        rule2.hour = 16;
        rule2.minute = 0;
        rule2.second = 0;
        job2 = schedule.scheduleJob(rule2, function () {
            let match = new Match();
            match.stopMatching(function (result) {
                console.log("今日收盘!");
            });
        });
        res.end("定时自动开盘系统开启成功!");
    } else {
        res.end("定时自动开盘系统已经开启，无法重复开启!");
    }
});

router.post('/stopSystem', function (req, res) {
    if (job1 !== '' && job2 !== '') {
        job1.cancel();
        job2.cancel();
        job1 = '';
        job2 = '';
        res.end("定时自动开盘系统关闭成功!");
    } else {
        res.end("定时自动开盘系统已经关闭，无法重复关闭!");
    }
});

module.exports = router;
