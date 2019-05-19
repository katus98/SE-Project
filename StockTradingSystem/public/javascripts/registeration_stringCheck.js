var urlRedirect = false;

function checkLoginPassword() {
    var notation = $("#notation1");
    var password = $("#f_password").val();
    return isPassword(password, notation);
}

function checkLoginSame() {
    var notation = $("#notationPassword1");
    var password = $("#f_password").val();
    var passwordR = $("#f_passwordR").val();
    return checkPasswordSame(password, passwordR, notation);
}

function checkMoneyPassword() {
    var notation = $("#notation2");
    var password = $("#p_password").val();
    return isPassword(password, notation);
}

function checkMoneySame() {
    var notation = $("#notationPassword2");
    var password = $("#p_password").val();
    var passwordR = $("#p_passwordR").val();
    return checkPasswordSame(password, passwordR, notation);
}

function checkFill(bid, nid) {
    var notation = $(nid);
    var blank = $(bid).val();
    return isEmpty(blank, notation);
}

function validate() {
    return (checkFill('#f_name', '#notation0') && checkIdCardNumber() && checkLoginPassword() && checkLoginSame() && checkMoneyPassword() && checkMoneySame() && checkFill('#f_phone', '#notation4'));
}

$(document).ready(function () {
    $("#registerBtn").click(function () {
        if(validate()) {
            $.ajax({
                url: '/register/register',
                type: 'POST',
                dataType: 'json',
                data: $("#registerForm").serialize(),
                success: function (data) {
                    alert(data.remark);
                    if (data.result) {
                        console.log("Open Accounts Successfully!");
                        let gotoURL = '/register/success?';
                        gotoURL += 'securitiesAccountId=' + PrefixInteger(data.securitiesAccountId, 11) + '&';
                        gotoURL += 'capitalAccountId=' + data.capitalAccountId + '&';
                        gotoURL += 'personId=' + PrefixInteger(data.personId, 10) + '&';
                        gotoURL += 'name=' + data.name + '&';
                        gotoURL += 'type=' + data.type;
                        setTimeout(function () {
                            $(window).attr('location', gotoURL);
                        }, 2000);
                    } else {
                        console.log("Open Accounts Filed!");
                    }
                },
                error: function () {
                    alert("Error!");
                }
            });
        }
    });
});

//校验输入不能为空
function isEmpty(s, notation) {
    let patrn = /\S/;
    if(!patrn.exec(s)){
        notation.css("display", "block");
        return false;
    } else {
        notation.css("display", "none");
        return true;
    }
}

//校验用户登录名
//只能输入5-20个字母开头、可带数字、"_"、"."的字串
function isRegisterUserName(s, notation) {
    let patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
    if(!patrn.exec(s)){
        notation.css("display", "block");
        return false;
    } else {
        notation.css("display", "none");
        return true;
    }
}

//校验密码
//只能输入6-20个字母、数字、下划线
function isPassword(s, notation) {
    let patrn = /^(\w){6,20}$/;
    if(!patrn.exec(s)){
        notation.css("display", "block");
        return false;
    } else {
        notation.css("display", "none");
        return true;
    }
}

//校验email
function isEmail(s, notation) {
    let patrn = /^\w+@[a-z0-9]+\.[a-z]+$/;
    // var patrn2 = /\s/;
    if(patrn.exec(s) || s === ""){
        notation.css("display", "none");
        return true;
    } else {
        notation.css("display", "block");
        return false;
    }
}

//id1, id2, password id.
//id3 notation id
//校验两次输入的密码是否相同
function checkPasswordSame(str1, str2, notation) {
    if(str1 !== str2){
        notation.css("display", "block");
        return false;
    } else {
        notation.css("display", "none");
        return true;
    }
}


//检验身份证号码格式是否正确
function checkIdCardNumber() {
    let idCardNum = $('#i_number').val();
    return checkIdCardNumberValidity(idCardNum);
}
function checkIdCardNumberValidity(id){
    let mes = "";
    let result = true;
    if(id.length !== 18) {
        result = false;
        mes += " 长度不对";
    }
    let a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let sum = 0;
    let ans = 11;
    for (let i = 0; i < 17; i++) {
        if (id[i] >= 0 && id[i] <= 9) sum = (sum + a[i] * id[i]) % 11;
        else {
            result = false;
            mes += ` 第${++i}位不是数字`;
        }
    }
    //检查校验码
    if (sum < 2) ans=1-sum;
    else if(sum > 2) ans=12-sum;
    if(id[17] == ans || (id[17] == 'x' || id[17] == 'X') && ans == 11) {}
    else {
        result = false;
        mes += " 校验码错误";
    }
    //检查是否为成年人
    let tyear = id.substring(6,10);
    let cdate = new Date();
    let cyear = cdate.getFullYear();
    let age = cyear-parseInt(tyear);
    if (age >= 18 && age <= 120) {}
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
            if ((dtyear%4 === 0 && dtyear%100 !== 0) || (dtyear%400 === 0)) {//闰年
                if (dtday < 1 || dtday > 29) {
                    result = false;
                    mes += " 日期无效";
                }
            } else {
                if (dtday<1 || dtday>28) {
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
            if(dtday < 1 || dtday > 30) {
                result = false;
                mes += " 日期无效";
            }
        }
    }
    //检查编码地址是否有效
    let disc = parseInt(id.substring(0, 2));
    if ((disc>=11 && disc<=15) || (disc>=21 && disc<=23) || (disc>=31 && disc<=37) || (disc>=41 && disc<=46) || (disc>=50 && disc<=54) || (disc>=61 && disc<=65) || (disc===71) || (disc>=81 && disc<=82) || (disc===91)) {}
    else {
        result = false;
        mes += " 地址编码无效";
    }
    return outIdCardNumber(result, mes);
}
function outIdCardNumber(r, m){
    $('#notation3').empty();
    if (r) {
        $('#notation3').css("display", "none");
    } else {
        $('#notation3').append("身份证号码一项存在问题：" + m).css("display", "block");
    }
    return r;
}

function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
