//---------------------------------------------------
// Based on JQuery
//---------------------------------------------------

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
                    if (data.result) {
                        urlRedirect = true;
                        console.log("Success!");
                        alert("开户成功!");
                        if (urlRedirect) {
                            setTimeout(function () {
                                $(window).attr('location', 'http://localhost:3000/register/success');
                            }, 3000);
                        }
                    } else {
                        console.log("Error!");
                        alert("错误! 服务器开小差了!");
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
    //todo
    let result = false;
    if (result) {
        $('#notation3').css("display", "none");
    } else {
        $('#notation3').css("display", "block");
    }
    return true;
}
