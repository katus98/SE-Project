
$('#login').click(function () {
   var manager = {
       name: $('#username').val().trim(),
       password: $('#password').val().trim()
   };

   $.ajax('/login', {
       type: 'POST',
       data: manager,
       dataType: 'json',
       success: function (data) {
           window.location.href = '/home';
           console.log(data)
       },
       error: function () {
           alert('登陆失败！')
       }
   });

});



$('.sign-up').click(function () {
    // todo
});