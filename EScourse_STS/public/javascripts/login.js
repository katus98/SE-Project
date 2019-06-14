
$('.login').click(function () {
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
       },
       error: function () {
           alert('Login failure occurs!')
       }
   });

});



$('.sign-up').click(function () {
    // todo


});