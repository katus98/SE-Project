//---------------------------------------------------
// Based on JQuery
//---------------------------------------------------

function fn_getmoneyaccount() {
    var availablemoney = 0;
    $.ajax(
        {
            url:'/user/Trading_instructions/get_availablemoney',
            type:'POST',
            async:false,
            success:function(results){
                availablemoney = results;

            }
        }
    );
    return availablemoney;
}