
$('#sub').click(function () {
    console.log('hhh');
    var newbie = {
        name: $('#username').val().trim(),
        password: $('#pw1').val().trim(),
        // phone: $('#phone').val().trim()
    };

    $.ajax('/registration/register',{
        type: 'POST',
        data: newbie,
        dataType: 'json',
        success: function (data) {
            alert('注册成功！');
            window.location.href = '/login';
        },
        error: function () {
            alert('注册失败!')
        }
    });
});