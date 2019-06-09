
function interestStock(stockid, interestPrice) {
    this.stockid = stockid;
    this.interestprice = interestPrice;
}
var jsonobj;

function checkInterest() {
    $.ajax(
        {
            url: '/user/searchInterest',
            type: 'POST',
            async: false,
            success:function (result) {
                if(result.success == undefined){
                    console.log(JSON.parse(result));
                    jsonobj = JSON.parse(result)
                }else {
                    $.message(
                        {
                            message:'失败提示',
                            type:'error'
                        }
                    )
                }
            }

        }
    )
}

function sendMessage() {
    checkInterest();
    for(var i = 0; i < jsonobj.length; i++){
        $.ajax(
            {
                url: '/user/checkInterest',
                type: 'POST',
                async: false,
                data:{
                    stockid:jsonobj[i].code,
                    interestprice:jsonobj[i].interestprice
                },
                success:function (result) {
                    if(result.success){
                        $.message({
                            message:'股票ID为'+jsonobj[i].code+'达到您的预期价格',
                            type:'info',
                            showClose:true,       //显示关闭按钮（默认：否）
                            autoClose:false,        //是否自动关闭（默认：是）
                        });
                    }
                }
            }
        )
    }
}

// checkInterest();
// var int=self.setInterval("sendMessage()",5000);