
$('.logout').click(function () {
    console.log('hhh');
    $.ajax('/logout',{
        type: 'POST',
        data: null,
        dataType: 'json',
        success: function (data) {
            window.location.href = '/login';
            alert('Logout!')
        },
        error: function () {
            alert('Logout failure occurs!')
        }
    });
});