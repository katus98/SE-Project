var express = require('express');
var router = express.Router();
var openAccount = require('../sqlClasses/OpenSecuritiesAccount');
var findBack = require('../sqlClasses/FindBackSecuritiesAccount');
var loseAccount = require('../sqlClasses/LoseSecuritiesAccount');
var Stock = require('../sqlClasses/Stock');
var Securitiesaccount = require('../sqlClasses/SecuritiesAccount');

// 补零
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

router.get('/', function (req, res) {
    res.render('begin');
});

router.get('/poa', function (req, res) {
    res.render('poa');
});

router.post('/poa', function (req, res) {
    console.log(req.body);
    let oaccount = new openAccount();
    console.log('openAccount对象建好');
    oaccount.currentpaccount(function (result) {
        console.log(result);
        oaccount.insertpaccount(result,req, function (result2) {
            console.log(result2);
            if (result2==-1) {
                res.end("您的账户已经冻结，可以补办，但不能够重复开户。");
            } else if (result2==-2) {
                res.end("您已经开户，不能够重新开户");
            } else if(result2==-3) {
                res.end("数据库错误");
            } else {
                oaccount.initstockhold(result.p,function (result3) {
                    res.end("开户成功。"+"\n"+"您的证券账户号码为："+PrefixInteger(result.a, 11)+"\n");
                });
            }
        });
    });
});

router.get('/coa',function(req,res){
    res.render('coa');
});

router.post('/coa',function(req,res){
    console.log(req.body);  
    let oaccount = new openAccount();
    console.log('openAccount对象建好');
    // 法人身份证与授权人身份证不可一致
    if (req.body.identityid === req.body.authorizeridentityid) {
        res.end("法人身份证与授权人身份证不可一致");
    } else {
        // 符合条件可以进行操作
        oaccount.currentcaccount(function (result) {
            console.log(result);
            oaccount.insertcaccount(result, req, function (result2) {
                console.log(result2);
                if (result2 == -1) {
                    res.end("您的账户已经冻结，可以补办，但不能够重复开户。");
                } else if (result2 == -2) {
                    res.end("您已经开户，不能够重新开户");
                } else if(result2==-3) {
                    res.end("数据库错误");
                } else {
                    oaccount.initstockhold(result.p, function (result2) {
                        res.end("开户成功。" + "\n" + "您的证券账户号码为：" + PrefixInteger(result.a, 11)+ "\n");
                    });
                }
            });
        });
    }
});

router.get('/pra',function (req, res) {
    res.render('pra');
});

router.post('/pra', function (req, res) {
    console.log(req.body);
    let oaccount = new openAccount();
    console.log('openAccount对象建好');
    oaccount.currentpaccount(function (result) {
        let fback = new findBack();
        fback.pfindback(result, req, function (result2) {
            console.log(result2);
            if (result2==-3) {
                res.end("您还没有账户，不可以补办。");
            } else if (result2==-1) {
                res.end("您已有账户，您的账户状态为正常，无需补办。");
            } else if (result2==-2) {
                res.end("您已经销户，可以开户，但不能补办。");
            } else if (result2==-4) {
                res.end("数据库错误");
            } else{
                res.end("补办成功。"+"\n"+"您的证券账户号码为："+PrefixInteger(result.a, 11)+"\n");
            }
        });
    });
});

router.get('/cra', function (req, res) {
    res.render('cra');
});

router.post('/cra', function (req, res) {
    console.log(req.body);
    let oaccount = new openAccount();
    // 法人身份证与授权人身份证不可一致
    if(req.body.identityid === req.body.authorizeridentityid) {
        res.end("法人身份证与授权人身份证不可一致");
    } else {
        // 符合条件可以进行操作
        console.log('openAccount对象建好');
        oaccount.currentcaccount(function(result){
            let fback = new findBack();
            fback.cfindback(result, req, function(result2){
                console.log(result2);
                if (result2==-3) {
                    res.end("您还没有账户，不可以补办。");
                } else if (result2==-1) {
                    res.end("您已有账户，您的账户状态为正常，无需补办。");
                } else if (result2==-2) {
                    res.end("您已经销户，可以开户，但不能补办。");
                } else if (result2==-4) {
                    res.end("数据库错误");
                } else{
                    res.end("补办成功。"+"\n"+"您的证券账户号码为："+PrefixInteger(result.a, 11)+"\n");
                }
            });
        });
    }
});

router.get('/pfa', function (req, res) {
    res.render('pfa');
});

router.post('/pfa', function (req, res) {
    console.log(req.body);
    let id = req.body.id;
    var paccount = new loseAccount();
    paccount.findpaccount(id, function (result) {
        if (result==-3) {
            res.end("You have reported the loss.\n您已经完成挂失操作，请不要重复挂失。");
        } else if (result==-2) {
            res.end("You have canceled your account.\n您已销户。");
        } else if (result==-1) {
            res.end("You have no account.\n您还没有账户，不可以挂失。");
        } else if (result==1) {  //账户可进行正常挂失操作
            paccount.losepaccount(id, function (result) {
                if (result==1) {
                    res.end('挂失成功');
                } else {
                    res.end('挂失失败');
                }
            });
        } else {
            res.end("Your account status is abnormal.\n您的账户状态异常");
        }
    });
});

router.get('/cfa', function (req, res) {
    res.render('cfa');
});

router.post('/cfa', function (req, res) {
    console.log(req.body);
    let id = req.body.id;
    var caccount = new loseAccount();
    caccount.findcaccount(id,function(result){
        if (result==-3) {
            res.end("You have reported the loss.\n您已经完成挂失操作。");
        }else if (result==-2) {
            res.end("You have canceled your account.\n您已销户。");
        }else if (result==-1) {
            res.end("You have no account.\n您还没有账户，不可以挂失。");
        }else if (result==-4) {
            res.end("Your account status is abnormal.\n您的账户状态异常");
        }else if (result==1) {//账户可进行正常挂失操作
            caccount.losecaccount(id, function(result){
                if(result==1){
                    res.end('挂失成功');
                } else {
                    res.end('挂失失败');
                }
            });
        }
    });
});

router.get('/cca', function (req, res) {
    res.render('cca');
});

router.post('/cca',function(req,res){
    console.log(req.body);
    var stock = new Stock();
    var securitiesaccount = new Securitiesaccount();
    securitiesaccount.checkSecuritiesAccountidAndIdentityid(parseInt(req.body.accountid), req.body.identityid, function (result) {
        if (result == 'Match') {
            securitiesaccount.getSecuritiesAccountStateBySecuritiesAccountId(parseInt(req.body.accountid),function (result) {
                if (result == 'normal' || result == 'frozen') {
                    securitiesaccount.getPersonIdBySecuritiesAccountId(parseInt(req.body.accountid), function (result) {
                        stock.checkStockClearByPersonid(parseInt(result), function (result) {
                            if (result == 'StockClear') {
                                securitiesaccount.stateChangetoLogoutbyAccountid(parseInt(req.body.accountid),function (result) {
                                    res.end("销户成功");
                                });
                            } else if (result == 'StockUnclear') {
                                res.end("该账户名下的股票未清空");
                            } else {
                                res.end("该账户的持股记录未初始化");
                            }
                        });
                    });
                } else if (result == 'logout') {
                    res.end("该账户已经销户");
                } else {
                    res.end("没有该证券账户");
                }
            });
        } else if (result == 'notMatch') {
            res.end("输入的身份证号码与证券账户号码不匹配");
        } else {
            res.end("没有该证券账户");
        }
    });
});

router.get('/pca', function (req, res) {
    res.render('pca');
});

router.post('/pca', function (req, res) {
    console.log(req.body);
    var stock = new Stock();
    var securitiesaccount = new Securitiesaccount();
    securitiesaccount.checkSecuritiesAccountidAndIdentityid(parseInt(req.body.accountid), req.body.identityid, function (result) {
        if (result=='Match') {
            securitiesaccount.getSecuritiesAccountStateBySecuritiesAccountId(parseInt(req.body.accountid), function (result) {
                if (result=='normal' || result=='frozen') {
                    securitiesaccount.getPersonIdBySecuritiesAccountId(parseInt(req.body.accountid), function (result) {
                        stock.checkStockClearByPersonid(parseInt(result), function (result) {
                            if (result == 'StockClear') {
                                securitiesaccount.stateChangetoLogoutbyAccountid(parseInt(req.body.accountid), function (result) {
                                    res.end("销户成功");
                                });
                            } else if (result == 'StockUnclear') {
                                res.end("该账户名下的股票未清空");
                            } else{
                                res.end("该账户的持股记录未初始化");
                            }
                        });
                    });
                } else if (result == 'logout') {
                    res.end("该账户已经销户");
                } else {
                    res.end("没有该证券账户");
                }
            });
        } else if (result == 'notMatch') {
            res.end("输入的身份证号码与证券账户号码不匹配");
        } else{
            res.end("没有该证券账户");
        }
    });
});

module.exports = router;
