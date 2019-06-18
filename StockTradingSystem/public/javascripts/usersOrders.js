function getDetails (json, eleId) {
    //默认每页最多10条记录
    var num1 = 10;
    //保存每页真实的记录条数
    var num2;
    //默认展示第一页
    var page = 1;

    //切换页面前后
    var prev = document.getElementById("prev");
    var pages = document.getElementById("pages");
    var next = document.getElementById("next");
    prev.innerHTML = "《";
    next.innerHTML = "》";

    //计算总共有多少页
    var count = Object.keys(json).length;
    //生成页码的按钮
    function creatPages(){
        pages.innerHTML = "";
        for(var i = 0; i < Math.ceil(count / 10); i++){
            pages.innerHTML += `<button json-page="${i+1}">\xa0${i+1}\xa0</button>`;
            //pages.innerHTML += " <button json-page='${i+1}'>"+(i+1)+" <button>";
        }
    }
    creatPages();
    renderPage();

    prev.onclick = function(){
        if(page > 1){
            page--;
            renderPage();
        }
    }
    next.onclick = function(){
        if(page < Math.ceil(count / 10)){
            page++;
            renderPage();
        }
    }
    pages.addEventListener('click', function (e) {
        page = e.target.getAttribute('json-page');
        renderPage();
    });
    

    function renderPage(){
        //alert(page);
        //alert(json[num1*(page-1)].iotime);
        //表头设置
        var str = "<tr><th>序号</th><th>交易时间</th><th>交易金额</th><th>交易币种</th><th>交易明细</th></tr>"
        document.getElementById(eleId).innerHTML = str;

        //判断当前选择的页码对应的人数
        if(count - num1 * (page - 1) >= 10){
            num2 = 10;
        }
        else{
            num2 = count - num1 * (page - 1);
        }

        //渲染该页对应的数据
        var str1 = "";
        for(var i = num1 * (page - 1); i < num2 + num1 * (page - 1); i++){
            str1 += "<tr>";
            str1 += "<td>" + (parseInt(i)+1) + "</td>";
            str1 += "<td>" + json[i].iotime + "</td>";
            str1 += "<td>" + json[i].ioamount + "</td>";
            str1 += "<td>" + json[i].moneytype + "</td>";
            str1 += "<td>" + json[i].iodescription + "</td>";
            str1 += "</tr>";
        }
        //alert(str1);
        document.getElementById(eleId).innerHTML += str1;
    }
}

function CheckAmount0()
{
    var amount_w = $('#amount_w').val();
    if(amount_w == 0.0000){
        alert("请输入大于0元人民币的取款金额！");
        document.getElementById("amount_w").value="";
        $('#amount_w').focus();
        return false;
    }
}

function CheckAmount()
{
    var type = $('#type').val();
    var amount = $('#amount').val();
    if(amount != ""){
        if(type=="RMB" && amount<1.0000){
            alert("请输入大于等于1元人民币的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="USD" && amount<1.0000){
            alert("请输入大于等于1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="CAD" && amount<1.3412){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="AUD" && amount<1.4286){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="EUR" && amount<0.8902){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="GBP" && amount<0.7696){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="HKD" && amount<7.8483){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
        else if(type=="JPY" && amount<110.0274){
            alert("请输入大于等于等值1美元的存款金额！");
            document.getElementById("amount").value="";
            $('#amount').focus();
            return false;
        }
    }
}

function CheckNL(oField)
{
    var re =  /^[0-9a-zA-Z]+$/;
    if (!re.test(oField.value) || oField.value.length<6){
        alert("请输入6位及以上字母或数字！");
        oField.value = "";
        oField.focus();
        return false;
    }
}

function AntiSqlValid(oField)
{
    re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    if(re.test(oField.value)){
        alert("请您不要在参数中输入特殊字符和SQL关键字！");//注意中文乱码
        oField.value = "";
        oField.focus();
        return false;
    }
}

function clearNoNum(obj){ 
    obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数  
    if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        obj.value= parseFloat(obj.value); 
    }
}

function WithdrawAll(){
	var remained = document.getElementById("remained").innerHTML;
    if(remained=="0.00"){
        alert("无法取出0元！请先向账户内存款！");
    }
    else{
        document.getElementById("amount_w").value = remained;
    }
	return false;
}

$(document).ready(function () {
    $("#userslogin").click(function () {
        if(usersLoginOrder.capitalaccountid.value==""){
            alert("账号不能为空！");
            usersLoginOrder.capitalaccountid.focus();
            return false;
        }
        else if(usersLoginOrder.cashpassWord.value==""){
            alert("密码不能为空！");
            usersLoginOrder.cashpassWord.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/userLogin/capitalUsersLogin",
            data: $("#usersLoginOrder").serialize(),
            success: function (result) {
                alert(result);              
                if(result!='用户不存在或密码错误！'){
                    window.location.href = '/userLogin/userHome';
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

    $("#usersdeposit").click(function () {
        if(usersDepositOrder.cashpassWord.value==""){
            alert("存取款密码不能为空！");
            usersDepositOrder.cashpassWord.focus();
            return false;
        }
        else if(usersDepositOrder.depositamount.value==""){
            alert("充值金额不能为空！");
            usersDepositOrder.depositamount.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/userLogin/capitalAccountFundIn",
            data: $("#usersDepositOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因存款指令发出失败!");
            }
        });
    });

    $("#userswithdraw").click(function () {
        if(usersWithdrawOrder.cashpassWord.value==""){
            alert("存取款密码不能为空！");
            usersWithdrawOrder.cashpassWord.focus();
            return false;
        }
        else if(usersWithdrawOrder.withdrawamount.value==""){
            alert("取出金额不能为空！");
            usersWithdrawOrder.withdrawamount.focus();
            return false;
        }
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/userLogin/capitalAccountFundOut",
            data: $("#usersWithdrawOrder").serialize(),
            success: function (result) {
                alert(result);
                window.location.reload();
            },
            error: function () {
                alert("由于系统原因取款指令发出失败!");
            }
        });
    });

    $("#usersdetails").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/userLogin/capitalDetails",
            data: $("#usersDetailsOrder").serialize(),
            success: function (result) {
                if(result=="账号信息异常！")
                {
                    getDetails({}, "tabDetails");
                }
                else
                {
                    getDetails(result, "tabDetails");           
                }

                alert("查询成功!");
            },
            error: function () {
                alert("由于系统原因查询失败!");
                //alert(error.message);
            }
        });
    });

    $("#userslogout").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/userLogin/capitalUsersLogout",
            data: {},
            success: function (result) {
                alert(result);               
                if(result=='退出资金账户系统成功！'){
                    window.location.href = '/userLogin';
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