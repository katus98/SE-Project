
// home -> dynamic table
$('#dynamic_table').click(function () {
    $.ajax('/dynamic_table', {
        type: 'GET',
        //dataType: 'json',
        success: function (data) {
            window.location.href = '/dynamic_table';
        },
        error: function () {
            alert('跳转失败！')
        }
    });

});

