// 数据库连接
var dbQuery = require('../database/MySQLquery');
// 计算利息类
var calculateInterest = require('../publicFunctionInterfaces/CalculateInterest');

// 资金账户管理类
function capitalAccountManagement () {
	// 资金账户注册
	this.register = function (tradepassWord, cashpassWord, identificationid, relatedsecuritiesaccountid, callback) {
		let capitalaccountid = 1000000;
		let selectSql = "SELECT max(capitalaccountid) as MAXID FROM capitalaccount";
        dbQuery(selectSql, [], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
				capitalaccountid = result[0].MAXID + 1;
				if(capitalaccountid < 1000000)
					capitalaccountid = 1000000;
				let checkSqlOne;
				// 确定对应的证券账户是自然人还是法人
				if (relatedsecuritiesaccountid < 1000000000) {
					checkSqlOne = "SELECT * FROM idreference,personalaccount WHERE idreference.accountid = personalaccount.accountid "+
								" AND idreference.accountid = " + relatedsecuritiesaccountid +" AND personalaccount.identityid = \'" + identificationid
								+"\' AND personalaccount.state = \'normal\'";
				} else {
					checkSqlOne = "SELECT * FROM idreference,corporateaccount WHERE idreference.accountid = corporateaccount.accountid "+
								" AND idreference.accountid = " + relatedsecuritiesaccountid +" AND corporateaccount.identityid = \'" + identificationid
								+"\' AND corporateaccount.state = \'normal\'";
				}
				dbQuery(checkSqlOne, [], function (err, result) {
					if (err) {
						console.log('[SELECT ERROR] - ', err.message);
						return;
					} else if (result.length == 0) {
						callback("请输入正确的关联证券账户和身份证号码！");
					} else {
						let checkSqlTwo = "SELECT * FROM capitalaccount WHERE relatedsecuritiesaccountid = "
										 + relatedsecuritiesaccountid + " AND capitalaccountstate = \'normal\'";
						dbQuery(checkSqlTwo,[],function (err, result) {
							if (err) {
								console.log('[SELECT ERROR] - ', err.message);
								return;
							} else if (result.length > 0) {
								callback("相关联的证券账户已存在资金账户！");
							} else {
								let insertSql = "INSERT into capitalaccount(capitalaccountid,tradepassWord,cashpassWord,identificationid,\
												relatedsecuritiesaccountid) values (" + capitalaccountid +",\"" + tradepassWord + "\""+
												",\""+ cashpassWord + "\",\'"+ identificationid +"\',"+ relatedsecuritiesaccountid + " )";
								dbQuery(insertSql,[], function (err, result) {
									if (err) {
										console.log('[INSERT ERROR] - ', err.message);
										return;
									} else {
										callback('资金账户注册成功！您的资金账户ID为:' + capitalaccountid);
									}
								});
							}
						});
					}
				});
            } 
        });
    };

    this.reportLoss = function (identificationid, relatedsecuritiesaccountid, callback) {
    	let checkSql = "SELECT capitalaccountid FROM capitalaccount WHERE identificationid = \'" + identificationid + 
    	               "\' AND relatedsecuritiesaccountid = " + relatedsecuritiesaccountid + " AND capitalaccountstate = \'normal\'" ;
        dbQuery(checkSql,[], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length == 0) {
                callback("身份证/法人注册登记号或证券帐户号错误,或资金账户状态异常！");
            } else {
                let oldID = result[0].capitalaccountid;
                let frozenSql = "UPDATE capitalaccount SET capitalaccountstate = \'frozen\' WHERE capitalaccountid = " + oldID;
                dbQuery(frozenSql,[], function (err, result) {
	            	if (err) {
						console.log('[UPDATE ERROR] - ', err.message);
						return;
	           		} else {
	           			callback("挂失成功，资金账户已冻结！请持有效身份证件重新补办资金账户卡！");
	           		}
           		});
            }
        });
    };

    // 资金账户补办
    this.makeup = function (tradepassWord, cashpassWord, identificationid, relatedsecuritiesaccountid, callback) {
    	let capitalaccountid = 1000000;
    	let selectSql = "SELECT max(capitalaccountid) as MAXID FROM capitalaccount";
        dbQuery(selectSql,[], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
				capitalaccountid = result[0].MAXID + 1;
				if (capitalaccountid < 1000000) {
					capitalaccountid = 1000000;
				}
				let checkSqlOne;
				// 确定对应的证券账户是法人还是自然人
				if (relatedsecuritiesaccountid < 1000000000) {
					checkSqlOne = "SELECT * FROM idreference,personalaccount WHERE idreference.accountid = personalaccount.accountid "+
								" AND idreference.accountid = " + relatedsecuritiesaccountid +" AND personalaccount.identityid = \'" + identificationid
								+"\' AND personalaccount.state = \'normal\'";
				} else {
					checkSqlOne = "SELECT * FROM idreference,corporateaccount WHERE idreference.accountid = corporateaccount.accountid "+
								" AND idreference.accountid = " + relatedsecuritiesaccountid +" AND corporateaccount.identityid = \'" + identificationid
								+"\' AND corporateaccount.state = \'normal\'";
				}
				dbQuery(checkSqlOne,[], function (err, result1) {
					if (err) {
						console.log('[SELECT ERROR] - ', err.message);
						return;
					} else if (result1.length == 0) {
						callback("请输入正确的关联证券账户和身份证号码！");

					} else {
						let checkSqlTwo = "SELECT * FROM capitalaccount WHERE identificationid = \'"
										 + identificationid + "\' AND capitalaccountstate = \'frozen\'";
						dbQuery(checkSqlTwo,[], function (err, result2) {
							if (err) {
								console.log('[SELECT ERROR] - ', err.message);
								return;
							} else if (result2.length == 0) {
								callback("身份证号不正确或不符合补办条件！");

							} else {
								let insertSql = "INSERT into capitalaccount(capitalaccountid,tradepassWord,cashpassWord,identificationid,\
												relatedsecuritiesaccountid,availablemoney,frozenmoney,interestremained) values (" + capitalaccountid +",\""
												+ tradepassWord + "\""+ ",\""+ cashpassWord + "\",\'"+ identificationid +"\',"+ relatedsecuritiesaccountid + ","+
												result2[0].availablemoney + ","+ result2[0].frozenmoney + ","+ result2[0].interestremained + " )";
								dbQuery(insertSql,[], function (err, result3) {
									if (err) {
										console.log('[INSERT ERROR] - ', err.message);
										return;
									} else {
										// 把原来的资金账户收支记录信息拷贝到新账户中
										/*let ioSql="UPDATE capitalaccountio SET capitalaccountid = " + capitalaccountid + "WHERE capitalaccountid IN "
										+ "(SELECT capitalaccountid FROM capitalaccount WHERE identificationid = \'"+ identificationid + "\' AND capitalaccountstate = \'frozen\')";*/
										let ioSql = "UPDATE capitalaccountio a INNER JOIN capitalaccount b ON b.capitalaccountid = a.capitalaccountid\
													SET a.capitalaccountid = "+capitalaccountid+  " WHERE b.identificationid = \'"+ identificationid + "\' AND capitalaccountstate = \'frozen\'";
										dbQuery(ioSql,[],function (err, result4) {
											if (err) {
												console.log('[UPDATE ERROR] - ', err.message);
												return;
											} else {
												// 更新原资金账户状态，使其由frozen变为logout
												let finalSql = "UPDATE capitalaccount SET capitalaccountstate = \'logout\' WHERE identificationid = \'"
																+ identificationid + "\' AND capitalaccountstate = \'frozen\'";
												dbQuery(finalSql,[],function (err, result5) {
													if (err) {
														console.log('[UPDATE ERROR] - ', err.message);
														return;
													} else {
														callback('资金账户补办成功！您的新资金账户ID为:' + capitalaccountid);
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
        });
    };

    //资金账户销户
    this.close = function (capitalaccountid, cashpassWord,identificationid,callback) {
        let checkSqlOne = "SELECT * FROM capitalaccount WHERE capitalaccountid = " + capitalaccountid + 
        				" AND capitalaccountstate = \"normal\" AND cashpassWord = \'"+ cashpassWord + "\'"+
        				" AND identificationid = \'" + identificationid + "\'";
        dbQuery(checkSqlOne,[], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                if(result[0].availablemoney != 0.0 || result[0].interestremained != 0.0) {
                  	callback('请取出所有的可用资金，然后再进行销户！');
                } else {
					let closeSql = "UPDATE capitalaccount SET capitalaccountstate = \'logout\' WHERE capitalaccountid = "+capitalaccountid;
					dbQuery(closeSql,[], function (err, result) {
						if (err) {
							console.log('[UPDATE ERROR] - ', err.message);
							return;
						} else {
							callback('资金账户注销成功！');
						}
					});
                }
            } else {
            	callback('资金账户信息输入错误，或账户状态异常！');
            }
        });
    };

    // 资金账户修改密码(存取款密码)
    this.changeCashPassword = function (capitalaccountid, oldPassWord, newPassWord, callback) {
    	let getSql = "SELECT * FROM capitalaccount WHERE capitalaccountid = " + capitalaccountid +
    				 " AND capitalaccountstate = \'normal\' AND cashpassWord = \'" + oldPassWord + "\'";
        dbQuery(getSql,[],function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                let changeSql = "UPDATE capitalaccount SET cashpassWord = \'" + newPassWord + "\'" +
                				" WHERE capitalaccountid = " + capitalaccountid;
                dbQuery(changeSql,[], function (err, result) {
					if (err) {
						console.log('[UPDATE ERROR] - ', err.message);
						return;
					} else {
						callback('修改存取款密码成功！');
					}
	        	});
            } else {
                callback('资金账户或密码输入错误，或账户状态异常！');
            }
        });
    };

    // 管理员6.30结算所有正常证券账户的利息
    this.interest630 = function (callback) {
    	var calInterest = new calculateInterest();
    	let intPart = 0;
    	//let item=null;
    	let selectSql = "SELECT * FROM capitalaccount WHERE capitalaccountstate = \'normal\'";
    	dbQuery(selectSql, [],function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            } else {
            	// 遍历每一个资金账户
            	for (let i = 0; i < result.length; i++) {
            		//console.log(i);
            		//console.log(result[i]);
					(function (i) {
						//console.log(i);
						//item = result[i];
						calInterest.calculate(result[i].capitalaccountid, function (tempinterest) {
							// 首先计算利息,并入利息余额
							let InterestSqlOne = "Update capitalaccount set interestremained = interestremained + "+ tempinterest +
													" where capitalaccount.capitalaccountid = "+ result[i].capitalaccountid;
							console.log(tempinterest);
							dbQuery(InterestSqlOne,[],function (err, result1) {
								if (err) {
									console.log('[UPDATE ERROR] - ', err.message);
									return;
								}
								else {
									// 然后保存原来利息余额的整数部分
									let intPartSql = "SELECT FLOOR(interestremained) as part FROM capitalaccount WHERE capitalaccount.capitalaccountid = " + result[i].capitalaccountid;
									dbQuery(intPartSql, [], function (err, result2) {
										if (err) {
											console.log('[SELECT ERROR] - ', err.message);
											return;
										}
										if (result2.length > 0) {
											intPart = result2[0].part;
											//console.log(intPart);
											// 将利息余额的整数部分并入可用资金
											let InterestSqlTwo = "Update capitalaccount set interestremained = interestremained -"+intPart+" , "+
																"availablemoney = availablemoney +"+intPart+" where capitalaccount.capitalaccountid = "+ result[i].capitalaccountid;
											dbQuery(InterestSqlTwo, [], function (err, result3) {
												if (err) {
													console.log('[UPDATE ERROR] - ', err.message);
													return;
												} else {
													// 将结息事件写入收支记录表中
													let insertSql = "INSERT INTO capitalaccountio(capitalaccountid,ioamount,iodescription) values(" + result[i].capitalaccountid
																	+ ","+ result2[0].part + ",\'每年6月30日银行结息\')";
													dbQuery(insertSql, [], function (err, result4) {
														if (err) {
															console.log('[INSERT ERROR] - ', err.message);
															return;
														} else {
															callback('结息成功！');
														}
													});
												}
											});
										} else {
											callback('Not found!');
											return;
										}
									});
								}
							});
						});
					})(i);
            	}
            }
        });
    };
}

module.exports = capitalAccountManagement;
