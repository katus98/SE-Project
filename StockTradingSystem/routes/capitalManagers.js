var express = require('express');
var router = express.Router();

// 引入自定义模块接口
var capitalManager = require('../sqlClasses/CapitalManager');
var capitalAccountManagement = require('../sqlClasses/CapitalAccountManagement');

// 登录页面
router.get('/', function(req, res, next) {
    res.render('managerLogin');
});

// 管理员首页
router.get('/managerHome', function(req, res, next) {
    if(req.session.ismanagerlogin) {
        res.render('managerHome',{workerid: (""+req.session.managerid)});
    }
    else {
        res.redirect("/managerLogin");
    }
});

// 各种操作页面
router.get('/managerHome/Register', function(req, res, next) {
    if(req.session.ismanagerlogin) {
        res.render('managerRegister',{workerid: (""+req.session.managerid)});
    }
    else {
        res.redirect("/managerLogin");
    }
});

router.get('/managerHome/ReportLoss', function(req, res, next) {
    if(req.session.ismanagerlogin) {
        res.render('managerReportLoss',{workerid: (""+req.session.managerid)});
    }
    else {
        res.redirect("/managerLogin");
    }
});

router.get('/managerHome/MakeUp', function(req, res, next) {
    if(req.session.ismanagerlogin) {
        res.render('managerMakeUp',{workerid: (""+req.session.managerid)});
    }
    else {
        res.redirect("/managerLogin");
    }
});

router.get('/managerHome/Close', function(req, res, next) {
    if(req.session.ismanagerlogin) {
        res.render('managerClose', {workerid: (""+req.session.managerid)});
    } else {
        res.redirect("/managerLogin");
    }
});

router.get('/managerHome/PasswordChange', function(req, res, next) {
    if (req.session.ismanagerlogin) {
        res.render('managerPasswordChange',{workerid: (""+req.session.managerid)});
    } else {
        res.redirect("/managerLogin");
    }
});

// 证券经纪商处管理员登录
router.post('/capitalManagerLogin', function (req, res) {
	try {
		var manager = new capitalManager();
   	    manager.login(parseInt(req.body.managerid),req.body.managerpassword, function (result) {
        	let returnText = "" + result;
        	req.session.ismanagerlogin = true;
        	req.session.managerid = req.body.managerid;
        	res.end(returnText);
   		});
	}
    catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户注册
router.post('/capitalAccountRegister', function (req, res) {

	try {
		console.log(""+req.body.capitalaccountid);
		console.log(""+parseInt(req.body.relatedsecuritiesaccountid));
	    var management = new capitalAccountManagement();
	    management.register(req.body.tradepassWord,req.body.cashpassWord,
	    					req.body.identificationid,parseInt(req.body.relatedsecuritiesaccountid),
	    					function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);
	    });
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户挂失
router.post('/capitalAccountReportLoss', function (req, res) {
	try {
	    var management = new capitalAccountManagement();
	    management.reportLoss(req.body.identificationid,parseInt(req.body.relatedsecuritiesaccountid),function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);
	    });		
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户补办
router.post('/capitalAccountMakeUp', function (req, res) {
	try {
	    var management = new capitalAccountManagement();
	    management.makeup(req.body.tradepassWord,req.body.cashpassWord,
	    					req.body.identificationid,parseInt(req.body.relatedsecuritiesaccountid),
	    					function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);
	    });		
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户销户
router.post('/capitalAccountClose', function (req, res) {
	try {
	    var management = new capitalAccountManagement();
	    management.close(parseInt(req.body.capitalaccountid),req.body.cashpassWord,req.body.identificationid,
	    					function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);

	    });		
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户修改密码(存取款密码)
router.post('/capitalPasswordChange', function (req, res) {
	try {
	    var management = new capitalAccountManagement();
	    management.changeCashPassword (parseInt(req.body.capitalaccountid),req.body.oldPassword,req.body.newPassword,
	    					function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);
	    });		
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}

});

// 资金账户6.30结息
router.post('/capitalInterest630', function (req, res) {
	try {
	    var management = new capitalAccountManagement();
	    management.interest630 (function (result) {
	      	let returnText = "" + result;
	        res.end(returnText);

	    });		
	}
	catch (error) {
		let returnMessage = ""+ error.message;
        res.end(returnMessage);
	}
});

// 资金账户用户退出
router.post('/capitalManagerLogout', function (req, res) {
    console.log("ok");
    /*
    req.session.destroy(function(err) {
        if(err){
            return;
        }        
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        //res.redirect('/');
        res.end("退出资金账户系统成功！");
    });
    */
    req.session.ismanagerlogin = false;
    res.end("退出资金账户系统成功！");
});

module.exports = router;
