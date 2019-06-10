function CheckNL(oField)
{
    var re =  /^[0-9a-zA-Z]+$/;
    if(oField.value.length!=0){
        if (!re.test(oField.value) || oField.value.length<6){
            alert("请输入6位及以上字母或数字！");
            oField.value = "";
            oField.focus();
            return false;
        }
    }
}

function AntiSqlValid(oField)
{
    re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    if(re.test(oField.value)){
        alert("请您不要在参数中输入特殊字符和SQL关键字！");//注意中文乱码
        oField.value = "";
        //oField.className="errInfo";
        oField.focus();
        return false;
    }
}

function CheckPassword12()
{
    var password1 = $('#psd1').val();
    var password2 = $('#psd2').val();
    if (document.activeElement.id != "psd1"){
        if (password1 != password2){
            alert("与之前所设新密码不一致，请重新输入！");
            document.getElementById("psd2").value = "";
            $('#psd2').focus();
            return false;
        }
    }
}

function CheckPassword21()
{
    var password1 = $('#psd1').val();
    var password2 = $('#psd2').val();
    if (document.activeElement.id != "psd2"){
        if (password2 != ""){
            alert("请再次输入密码！");
            document.getElementById("psd2").value = "";
            $('#psd1').focus();
            return false;
        }
    }
}

function CheckPassword34()
{
    var password3 = $('#psd3').val();
    var password4 = $('#psd4').val();
    if (document.activeElement.id != "psd3"){
        if (password3 != password4){
            alert("与之前所设交易密码不一致，请重新输入！");
            document.getElementById("psd4").value = "";
            $('#psd4').focus();
            return false;
        }
    }
}

function CheckPassword43()
{
    var password3 = $('#psd3').val();
    var password4 = $('#psd4').val();
    if (document.activeElement.id != "psd4"){
        if (password4 != ""){
            alert("请再次输入所设交易密码！");
            document.getElementById("psd4").value = "";
            $('#psd3').focus();
            return false;
        }
    }
}

function CheckPassword56()
{
    var password5 = $('#psd5').val();
    var password6 = $('#psd6').val();
    if (document.activeElement.id != "psd5"){
        if (password5 != password6){
            alert("与之前所设存取款密码不一致，请重新输入！");
            document.getElementById("psd6").value = "";
            $('#psd6').focus();
            return false;
        }
    }
}

function CheckPassword65()
{
    var password5 = $('#psd5').val();
    var password6 = $('#psd6').val();
    if (document.activeElement.id != "psd6"){
        if (password6 != ""){
            alert("请再次输入所设存取款密码！");
            document.getElementById("psd6").value = "";
            $('#psd5').focus();
            return false;
        }
    }
}

function CheckPassword78()
{
    var password7 = $('#psd7').val();
    var password8 = $('#psd8').val();
    if (document.activeElement.id != "psd7"){
        if (password7 != password8){
            alert("与之前所设交易密码不一致，请重新输入！");
            document.getElementById("psd8").value = "";
            $('#psd8').focus();
            return false;
        }
    }
}

function CheckPassword87()
{
    var password7 = $('#psd7').val();
    var password8 = $('#psd8').val();
    if (document.activeElement.id != "psd8"){
        if (password8 != ""){
            alert("请再次输入所设存取款密码！");
            document.getElementById("psd8").value = "";
            $('#psd7').focus();
            return false;
        }
    }
}

function CheckPassword910()
{
    var password9 = $('#psd9').val();
    var password10 = $('#psd10').val();
    if (document.activeElement.id != "psd9"){
        if (password9 != password10){
            alert("与之前所设存取款密码不一致，请重新输入！");
            document.getElementById("psd10").value = "";
            $('#psd10').focus();
            return false;
        }
    }
}

function CheckPassword109()
{
    var password9 = $('#psd9').val();
    var password10 = $('#psd10').val();
    if (document.activeElement.id != "psd10"){
        if (password10 != ""){
            alert("请再次输入所设存取款密码！");
            document.getElementById("psd10").value = "";
            $('#psd9').focus();
            return false;
        }
    }
}

$(document).ready(function () {
    $("#managerlogin").click(function () {
        if(managerLoginOrder.managerid.value==""){
            alert("账号不能为空！");
            managerLoginOrder.managerid.focus();
            return false;
        }
        else if(managerLoginOrder.managerpassword.value==""){
            alert("密码不能为空！");
            managerLoginOrder.managerpassword.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalManagerLogin",
            data: $("#managerLoginOrder").serialize(),
            success: function (result) {
                alert(result);
                /*render('managerHome', { managerid: ("" + result[0].managerid) });*/
                if(result!='管理员用户不存在或密码错误！'){
                    window.location.href = '/managerLogin/managerHome';
                }
                else{
                    window.location.reload();
                }
            },
            error: function () {
                alert("由于系统原因登录指令发出失败!");
            }
        });
    });

    $("#managerregister").click(function () {
        if(managerRegisterOrder.tradepassWord.value==""){
            alert("交易密码不能为空！");
            managerRegisterOrder.tradepassWord.focus();
            return false;
        }
        else if(managerRegisterOrder.tradepassWordCheck.value==""){
            alert("确认交易密码不能为空！");
            managerRegisterOrder.tradepassWordCheck.focus();
            return false;
        }
        else if(managerRegisterOrder.cashpassWord.value==""){
            alert("存取款密码不能为空！");
            managerRegisterOrder.cashpassWord.focus();
            return false;
        }
        else if(managerRegisterOrder.cashpassWordCheck.value==""){
            alert("确认存取款密码不能为空！");
            managerRegisterOrder.cashpassWordCheck.focus();
            return false;
        }
        else if(managerRegisterOrder.identificationid.value==""){
            alert("身份证号不能为空！");
            managerRegisterOrder.identificationid.focus();
            return false;
        }
        else if(managerRegisterOrder.relatedsecuritiesaccountid.value==""){
            alert("关联证券账户账号不能为空！");
            managerRegisterOrder.relatedsecuritiesaccountid.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalAccountRegister",
            data: $("#managerRegisterOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因注册指令发出失败!");
            }
        });
    });

    $("#managerreportloss").click(function () {
        if(managerReportLossOrder.identificationid.value==""){
            alert("身份证号不能为空！");
            managerReportLossOrder.identificationid.focus();
            return false;
        }
        else if(managerReportLossOrder.relatedsecuritiesaccountid.value==""){
            alert("关联证券账户账号不能为空！");
            managerReportLossOrder.relatedsecuritiesaccountid.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalAccountReportLoss",
            data: $("#managerReportLossOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因挂失指令发出失败!");
            }
        });
    });

    $("#managermakeup").click(function () {
        if(managerMakeUpOrder.tradepassWord.value==""){
            alert("交易密码不能为空！");
            managerMakeUpOrder.tradepassWord.focus();
            return false;
        }
        else if(managerMakeUpOrder.tradepassWordCheck.value==""){
            alert("确认交易密码不能为空！");
            managerMakeUpOrder.tradepassWordCheck.focus();
            return false;
        }
        else if(managerMakeUpOrder.cashpassWord.value==""){
            alert("存取款密码不能为空！");
            managerMakeUpOrder.cashpassWord.focus();
            return false;
        }
        else if(managerMakeUpOrder.cashpassWordCheck.value==""){
            alert("确认存取款密码不能为空！");
            managerMakeUpOrder.cashpassWordCheck.focus();
            return false;
        }
        else if(managerMakeUpOrder.identificationid.value==""){
            alert("身份证号不能为空！");
            managerMakeUpOrder.identificationid.focus();
            return false;
        }
        else if(managerMakeUpOrder.relatedsecuritiesaccountid.value==""){
            alert("关联证券账户账号不能为空！");
            managerMakeUpOrder.relatedsecuritiesaccountid.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalAccountMakeUp",
            data: $("#managerMakeUpOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因补办指令发出失败!");
            }
        });
    });

    $("#managerclose").click(function () {
        if(managerCloseOrder.capitalaccountid.value==""){
            alert("资金账户账号不能为空！");
            managerCloseOrder.capitalaccountid.focus();
            return false;
        }
        else if(managerCloseOrder.cashpassWord.value==""){
            alert("存取款密码不能为空！");
            managerCloseOrder.cashpassWord.focus();
            return false;
        }
        else if(managerCloseOrder.identificationid.value==""){
            alert("身份证号不能为空！");
            managerCloseOrder.identificationid.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalAccountClose",
            data: $("#managerCloseOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因销户指令发出失败!");
            }
        });
    });

    $("#managerpasswordchange").click(function () {
        if(managerPasswordChangeOrder.capitalaccountid.value==""){
            alert("资金账户账号不能为空！");
            managerPasswordChangeOrder.capitalaccountid.focus();
            return false;
        }
        else if(managerPasswordChangeOrder.oldPassword.value==""){
            alert("旧密码不能为空！");
            managerPasswordChangeOrder.oldPassword.focus();
            return false;
        }
        else if(managerPasswordChangeOrder.newPassword.value==""){
            alert("新密码不能为空！");
            managerPasswordChangeOrder.newPassword.focus();
            return false;
        }
        else if(managerPasswordChangeOrder.newPasswordCheck.value==""){
            alert("确认新密码不能为空！");
            managerPasswordChangeOrder.newPasswordCheck.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalPasswordChange",
            data: $("#managerPasswordChangeOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因密码修改指令发出失败!");
            }
        });
    });

    $("#managerInterest630").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalInterest630",
            data: {},
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因利息结算指令发出失败!");
            }
        });
    });

    $("#managerlogout").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/managerLogin/capitalManagerLogout",
            data: {},
            success: function (result) {
                alert(result);               
                if(result=='退出资金账户系统成功！'){
                    window.location.href = '/managerLogin';
                }
                else{
                    window.location.reload();
                }
                
            },
            error: function () {
                alert("由于系统原因退出指令发出失败!");
            }
        });
    });
});