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
    return (checkLoginPassword() && checkLoginSame() && checkMoneyPassword() && checkMoneySame());
}

$(document).ready(function () {
    $("#registerBtn").click(function () {
        var name = $("#f_name").val();
        var username = $("#f_username").val();
        var email = $("#f_email").val();
        var password = $("#f_password").val();
        console.log(name,username,email,password);
        if(validate()) {
            $.ajax({
                url: '/registeration/register',
                type: 'POST',
                data: {
                    name: name,
                    username: username,
                    email: email,
                    password: password
                },
                success: function (data) {
                    if (data.success) {
                        urlRedirect = true;
                        console.log("注册成功");
                        alert("Register successfully!\nYou will return login page in 3 seconds.");
                        if (urlRedirect) {
                            setTimeout(function () {
                                $(window).attr('location', 'http://localhost:3000/login');
                            }, 3000);
                        }
                    } else {
                        console.log("出现错误");
                        alert("Error!Something Wrong!");
                    }
                }
            });
        }
    });
});

//校验输入不能为空
function isEmpty(s, notation) {
    var patrn = /\S/;
    if(!patrn.exec(s)){
        notation.css("display","block");
        return false;
    }else {
        notation.css("display","none");
        return true;
    }
}

//校验用户登录名
//只能输入5-20个字母开头、可带数字、"_"、"."的字串
function isRegisterUserName(s, notation) {
    var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
    if(!patrn.exec(s)){
        notation.css("display","block");
        return false;
    }else {
        notation.css("display","none");
        return true;
    }
}

//校验密码
//只能输入6-20个字母、数字、下划线
function isPassword(s, notation) {
    var patrn = /^(\w){6,20}$/;
    if(!patrn.exec(s)){
        notation.css("display","block");
        return false;
    }else {
        notation.css("display","none");
        return true;
    }
}

//校验email
function isEmail(s, notation) {
    var patrn = /^\w+@[a-z0-9]+\.[a-z]+$/;
    // var patrn2 = /\s/;
    if(patrn.exec(s) || s==""){
        notation.css("display","none");
        return true;
    }else {
        notation.css("display","block");
        return false;
    }
}

//id1, id2, password id.
//id3 notation id
//校验两次输入的密码是否相同
function checkPasswordSame(str1, str2, notation) {
    if(str1 != str2){
        notation.css("display","block");
        // $("#changeBtn").attr("disabled",true);
        return false;
    }else {
        notation.css("display","none");
        // $("#changeBtn").attr("disabled",false);
        return true;
    }
}
