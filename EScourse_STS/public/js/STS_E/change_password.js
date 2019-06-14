


$('#submit').click(function () {
    var psw = {
        pass_old: $('#old-pass').val().trim(),
        pass_new: $('#pw1').val().trim()
    };

    $.ajax('/change_password/change', {
        type: 'POST',
        data: psw,
        dataType: 'json',
        success: function (data) {
            if (data.status === 1)
            {
                alert("修改成功！");
                window.location.href = '/home'
            }
            else
            {
                alert('输入密码有误！')
            }
        },
        error: function () {
            alert('有问题！')
        }
    });

});

