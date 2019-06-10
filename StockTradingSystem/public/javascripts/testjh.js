//判断不为空
function checkFill(bid, nid) {
    var notation = $(nid);
    var blank = $(bid).val();
    return isEmpty(blank, notation);
}
function isEmpty(s, notation) {
    let patrn = /\S/;
    notation.empty();
    if(!patrn.exec(s)){
        notation.append("此项不可为空").css("display", "block");
        return false;
    } else {
        notation.css("display", "none");
        return true;
    }
}
//检验证券账户号码有效性，t为次位区分个人或法人
function checkAccountNumber(an,anm,t) {
    let account = $(an).val();
    if(checkFill(an,anm)){
        return checkAccountNumberValidity(account,anm,t);
    }
    else{
        return false;
    }
}
function checkAccountNumberValidity(id,anm,t) {
    //长度判断
    let mes = "";
    let result = true;
    if(id.length !== 11) {
        result = false;
        mes += " 长度不对";
    }
    else {
        //字符判断
        for (let i = 0; i < 11; i++) {
            if (id[i] < 0 || id[i] > 9) {
                result = false;
                mes += ` 第${i + 1}位不是数字`;
            }
        }
        //次位判断
        if (id[1] != t) {
            result = false;
            mes += " 账户类型错误";
        }
    }
    return outAccountNumber(result, mes,anm);
}
function outAccountNumber(r,m,anm) {
    $(anm).empty();
    if (r) {
        $(anm).css("display", "none");
    } else {
        $(anm).append("账户号码存在问题：" + m).css("display", "block");
    }
    return r;
}
//检验身份证号码格式是否正确，icn指input，icnm指错误信息
function checkIdCardNumber(icn,icnm) {
    let idCardNum = $(icn).val();
    if(checkFill(icn,icnm)){
        return checkIdCardNumberValidity(idCardNum,icnm);
    }
    else{
        return false;
    }
}
function checkIdCardNumberValidity(id,icnm){
    let mes = "";
    let result = true;
    if(id.length !== 18) {
        result = false;
        mes += " 长度不对";
    }
    else {
        let a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        let sum = 0;
        let ans = 11;
        for (let i = 0; i < 17; i++) {
            if (id[i] >= 0 && id[i] <= 9) sum = (sum + a[i] * id[i]) % 11;
            else {
                result = false;
                mes += ` 第${i + 1}位不是数字`;
            }
        }
        if(result==true) {
            //检查校验码
            if (sum < 2) ans = 1 - sum;
            else if (sum > 2) ans = 12 - sum;
            if (id[17] == ans || (id[17] == 'x' || id[17] == 'X') && ans == 11) {
            }
            else {
                result = false;
                mes += " 校验码错误";
            }
            //检查是否为成年人
            let tyear = id.substring(6, 10);
            let cdate = new Date();
            let cyear = cdate.getFullYear();
            let age = cyear - parseInt(tyear);
            if (age >= 18 && age <= 120) {
            }
            else {
                result = false;
                mes += " 年龄不合格";
            }
            //检查日期是否有效
            let tmonth = id.substring(10, 12);
            let tday = id.substring(12, 14);
            let dtyear = parseInt(tyear);
            let dtmonth = parseInt(tmonth);
            let dtday = parseInt(tday);
            if (dtmonth < 1 || dtmonth > 12) {
                result = false;
                mes = " 月份无效";
            } else {
                if (dtmonth === 2) {
                    if ((dtyear % 4 === 0 && dtyear % 100 !== 0) || (dtyear % 400 === 0)) {//闰年
                        if (dtday < 1 || dtday > 29) {
                            result = false;
                            mes += " 日期无效";
                        }
                    } else {
                        if (dtday < 1 || dtday > 28) {
                            result = false;
                            mes += " 日期无效";
                        }
                    }
                } else if (dtmonth === 1 || dtmonth === 3 || dtmonth === 5 || dtmonth === 7 || dtmonth === 8 || dtmonth === 10 || dtmonth === 12) {
                    if (dtday < 1 || dtday > 31) {
                        result = false;
                        mes += " 日期无效";
                    }
                } else {
                    if (dtday < 1 || dtday > 30) {
                        result = false;
                        mes += " 日期无效";
                    }
                }
            }
            //检查编码地址是否有效
            let disc = parseInt(id.substring(0, 2));
            if ((disc >= 11 && disc <= 15) || (disc >= 21 && disc <= 23) || (disc >= 31 && disc <= 37) || (disc >= 41 && disc <= 46) || (disc >= 50 && disc <= 54) || (disc >= 61 && disc <= 65) || (disc === 71) || (disc >= 81 && disc <= 82) || (disc === 91)) {
            }
            else {
                result = false;
                mes += " 地址编码无效";
            }
        }
    }
    //console.log("r "+result+"m "+mes);
    return outIdCardNumber(result, mes,icnm);
}
function outIdCardNumber(r, m,icnm){
    $(icnm).empty();
    if (r) {
        $(icnm).css("display", "none");
    } else {
        $(icnm).append("身份证号码存在问题：" + m).css("display", "block");
    }
    return r;
}

//检验电话号码格式是否正确，pn指input，pnm指错误信息
function checkPhoneNumber(pn,pnm) {
    let idCardNum = $(pn).val();
    if(checkFill(pn,pnm)){
        return checkPhoneNumberValidity(idCardNum,pnm);
    }
    else{
        return false;
    }
}
function checkPhoneNumberValidity(tel,pnm){
    let mes = "";
    let result = true;
    if(tel.length!=11){
        result = false;
        mes += " 长度不对";
    }
    else {
        for (let i = 0; i < 11; i++) {
            if (tel[i] > 9 && tel[i] < 0) {
                result = false;
                mes += ` 第${i + 1}位不是数字`;
            }
        }
        //检验号段
        let digit = parseInt(tel.substring(0, 3));
        if ((digit >= 130 && digit <= 139) || (digit == 140 || digit == 141 || (digit >= 144 && digit <= 149)) || (digit >= 150 && digit <= 159 && digit != 154) || (digit >= 165 && digit <= 167) || (digit == 170 || digit == 171 || (digit >= 173 && digit <= 178)) || (digit >= 180 && digit <= 189) || (digit == 191 || digit == 198 || digit == 199)) {
        }
        else {
            result = false;
            mes += " 手机号段无效";
        }
    }
    return outPhoneNumber(result, mes,pnm);
}
function outPhoneNumber(r,m,pnm) {
    $(pnm).empty();
    if (r) {
        $(pnm).css("display", "none");
    } else {
        $(pnm).append("手机号码存在问题：" + m).css("display", "block");
    }
    return r;
}
//法人与授权人、自然人与代办人身份证号不可相同,d标识表示自然人为0、法人为1,t标识表示在主身份证号还是在次身份证号填写时验证，主为0，次为1
function checkDiffer(zicn,zicnm,cicn,cicnm,d,t) {
    if(t==1){
        if (checkIdCardNumber(cicn, cicnm)) {
            if ($(zicn).val() == $(cicn).val()) {
                if (d == 0) {
                    $(cicnm).append("自然人与代办人身份证号不可相同").css("display", "block");
                }
                else {
                    $(cicnm).append("法人与授权人身份证号不可相同").css("display", "block");
                }
                return false;
            }
            else{
                if($(zicnm).text()=="自然人与代办人身份证号不可相同"||$(zicnm).text()=="法人与授权人身份证号不可相同"){
                    $(zicnm).empty();
                }
                return true;
            }
        }
        else return false;
    }
    else{
        if (checkIdCardNumber(zicn, zicnm)) {
            if ($(zicn).val() == $(cicn).val()) {
                if (d == 0) {
                    $(zicnm).append("自然人与代办人身份证号不可相同").css("display", "block");
                }
                else {
                    $(zicnm).append("法人与授权人身份证号不可相同").css("display", "block");
                }
                return false;
            }
            else{
                if($(cicnm).text()=="自然人与代办人身份证号不可相同"||$(cicnm).text()=="法人与授权人身份证号不可相同"){
                    $(cicnm).empty();
                }
                return true;
            }
        }
        else return false;
    }
}
//提交时全验证
function poavalidate() {
    if(document.getElementById('poaagd').style.display=='none'){//无代办人
        return (checkFill('#poaim0', '#poawm0')&&checkIdCardNumber('#poaim1', '#poawm1')&&checkFill('#poaim2', '#poawm2')&&checkFill('#poaim3', '#poawm3')&&checkFill('#poaim5', '#poawm5')&&checkPhoneNumber('#poaim6', '#poawm6'));
    }
   else{
        return (checkFill('#poaim0', '#poawm0')&&checkIdCardNumber('#poaim1', '#poawm1')&&checkFill('#poaim2', '#poawm2')&&checkFill('#poaim3', '#poawm3')&&checkFill('#poaim5', '#poawm5')&&checkPhoneNumber('#poaim6', '#poawm6')&&checkDiffer('#poaim1', '#poawm1','#poaim7', '#poawm7',0,1));
   }
}
function pravalidate() {
    if(document.getElementById('praagd').style.display=='none'){//无代办人
        return (checkFill('#praim0', '#prawm0')&&checkIdCardNumber('#praim1', '#prawm1')&&checkFill('#praim2', '#prawm2')&&checkFill('#praim3', '#prawm3')&&checkFill('#praim4', '#prawm4')&&checkFill('#praim5', '#prawm5')&&checkPhoneNumber('#praim6', '#prawm6'));
    }
    else{
        return (checkFill('#praim0', '#prawm0')&&checkIdCardNumber('#praim1', '#prawm1')&&checkFill('#praim2', '#prawm2')&&checkFill('#praim3', '#prawm3')&&checkFill('#praim4', '#prawm4')&&checkFill('#praim5', '#prawm5')&&checkPhoneNumber('#praim6', '#prawm6')&&checkDiffer('#praim1', '#prawm1','#praim7', '#prawm7',0,1));
    }
}
function coavalidate() {
    return (checkFill('#coaim0', '#coawm0')&&checkFill('#coaim1', '#coawm1')&&checkIdCardNumber('#coaim2', '#coawm2')&&checkFill('#coaim3', '#coawm3')&&checkPhoneNumber('#coaim4', '#coawm4')&&checkFill('#coaim5', '#coawm5')&&checkFill('#coaim6', '#coawm6')&&checkDiffer('#coaim2', '#coawm2','#coaim7', '#coawm7',1,1)&&checkPhoneNumber('#coaim8', '#coawm8')&&checkFill('#coaim9', '#coawm9'));
}
function cravalidate() {
    return (checkFill('#craim0', '#crawm0')&&checkFill('#craim1', '#crawm1')&&checkIdCardNumber('#craim2', '#crawm2')&&checkFill('#craim3', '#crawm3')&&checkPhoneNumber('#craim4', '#crawm4')&&checkFill('#craim5', '#crawm5')&&checkFill('#craim6', '#crawm6')&&checkDiffer('#craim2', '#crawm2','#craim7', '#crawm7',1,1)&&checkPhoneNumber('#craim8', '#crawm8')&&checkFill('#craim9', '#crawm9'));
}
function pfavalidate() {
    return (checkIdCardNumber('#pfaim0', '#pfawm0'));
}
function cfavalidate() {
    return (checkFill('#cfaim0', '#cfawm0'));
}
function pcavalidate() {
    return (checkIdCardNumber('#pcaim0', '#pcawm0')&&checkAccountNumber('#pcaim1', '#pcawm1',0));
}
function ccavalidate() {
    return (checkIdCardNumber('#ccaim0', '#ccawm0')&&checkAccountNumber('#ccaim1', '#ccawm1',1));
}

$(document).ready(function () {
    $("#submit").click(function () {
       if(poavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/poa",
                data: $("#poaccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("开户失败!");
                }
            });
       }
       else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#submit1").click(function () {
        if(coavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/coa",
                data: $("#coaccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("开户失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#submit2").click(function () {
        if(pravalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/pra",
                data: $("#praccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("补办失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#submit3").click(function () {
        if(cravalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/cra",
                data: $("#fraccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("补办失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#submit4").click(function () {
        if(pfavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/pfa",
                data: $("#pfaccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("挂失失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#submit5").click(function () {
        if(cfavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/cfa",
                data: $("#cfaccount").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("挂失失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});
$(document).ready(function () {
    $("#ccao").click(function () {
        if(ccavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/cca",
                data: $("#ccainfo").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("销户失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
    $("#pcao").click(function () {
        if(pcavalidate()) {
            $.ajax({
                type: "POST",
                dataType: "text",
                async: false,
                url: "/securitiesaccount/pca",
                data: $("#pcainfo").serialize(),
                success: function (result) {
                    alert(result);
                },
                error: function () {
                    alert("销户失败!");
                }
            });
        }
        else alert("信息缺失或错误无法提交");
    });
});


