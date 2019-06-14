function validate_fullname() {
    var fullname = document.getElementById("fullname").value;
    if(isEmpty(fullname) == false)
    {
        document.getElementById("notification_fullname").innerHTML="<font color='red'>全名不能为空</font>";
        document.getElementById("submit").disabled = false;     
    }else
    {
        document.getElementById("notification_fullname").innerHTML="<font color='green'>全名符合格式</font>";
        document.getElementById("submit").disabled = true;     
    }
}
function validate_address() {
    var address = document.getElementById("address").value;
    if(isEmpty(address) == false)
    {
        document.getElementById("notification_address").innerHTML="<font color='red'>地址不能为空</font>";
        document.getElementById("submit").disabled = false;     
    }else
    {
        document.getElementById("notification_address").innerHTML="<font color='green'>地址符合格式</font>";
        document.getElementById("submit").disabled = true;     
    }
}
function validate_email() {
    var email = document.getElementById("email").value;
    var reg=/^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/;//判断是否符合***@***.***这种格式 
    if(reg.test(email) == false)
    {
        document.getElementById("notification_email").innerHTML="<font color='red'>邮箱格式不正确</font>";
        document.getElementById("submit").disabled = false;     
    }else
    {
        document.getElementById("notification_email").innerHTML="<font color='green'>邮箱符合格式</font>";
        document.getElementById("submit").disabled = true;     
    }
}


function validate_username()  {
    var username = document.getElementById("username").value; 
    var reg=/^[\da-zA-Z_]+$/;//判断是否只有字母数字下划线
    if(!isNaN(username[0]))
    {
        document.getElementById("notification_username").innerHTML="<font color='red'>用户名不能以数字开头</font>";
    }else
    if(reg.test(username) == false)
    {
        document.getElementById("notification_username").innerHTML="<font color='red'>用户名只能由大小写字母，数字和下划线组成</font>";
    }else
    if(username.length < 6)
    {
        document.getElementById("notification_username").innerHTML="<font color='red'>用户名应不少于于6个字符</font>";
    }else
    if(username.length > 20)
    {
        document.getElementById("notification_username").innerHTML="<font color='red'>用户名不应多于20个字符</font>";
    }else
    {
        document.getElementById("notification_username").innerHTML="<font color='green'>用户名符合格式</font>";
    }
}
function validate_password() {
    var pw1 = document.getElementById("pw1").value;
    var pw2 = document.getElementById("pw2").value;
    if(pw1 == pw2) 
    {
        if(count_character_type_number(pw1) < 3)
        {
            document.getElementById("notification_password").innerHTML="<font color='red'>密码应该包含大小写字母、数字、特殊字符中的至少三种</font>";
        }
        else if(pw1.length < 8)
        {
            document.getElementById("notification_password").innerHTML="<font color='red'>密码应不少于8个字符</font>";
        }
		else if(pw1.length > 20)
        {
            document.getElementById("notification_password").innerHTML="<font color='red'>密码应不多于20个字符</font>";
        }
        else
        {
            document.getElementById("notification_password").innerHTML="<font color='green'>密码符合格式</font>";
        }
    }
    else 
    {
        document.getElementById("notification_password").innerHTML="<font color='red'>两次密码不相同</font>";
    }
}


function count_character_type_number(num)  {         //计算密码中的字符种类数量
    var count = 0;
    if(num.length < 1) 
    {
        return count;
    }
    if(/\d/.test(num))               //数字
    {
        count++;
    }
    if(/[a-z]/.test(num))            //小写字母
    {
        count++;
    }
    if(/[A-Z]/.test(num))            //大写字母
    {
        count++;
    }  
    if(/\W/.test(num))               //特殊字符
    {
        count++;
    }
    return count;
}

function calculate_password_level(pwd)   {      //计算密码强度
    var level = zxcvbn(pwd);
    return level['score']*100.0 / 4;
}



function validate_phone(){
    var _phone = $('#phone').val();
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    var flag = false;
    var message = "";

    if (_phone === '') {
        message = "<font color='red'>手机号码不能为空！</font>";
    } else if (_phone.length !== 11) {
        message = "<font color='red'>请输入11位手机号码！</font>";
    } else if (!myreg.test(_phone)) {
        message = "<font color='red'>请输入有效的手机号码！</font>";
    } else {
        message = "<font color='green'>手机号码符合要求</font>";
        flag = true;
    }
    $('#notification_phone').html(message);


    if (flag) {
        $('#sub').attr('disabled', false);
    }

}