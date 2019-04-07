//前端js文件
//作者：孙克染

function process(json) {
	if (json.resultMessage === 0) {
		alert("余额不足，无法交易!");
	} else {
		var str = "Money: ￥";
		str += json.haveMoney;
		document.getElementById("mess").innerHTML = str;
		alert("交易成功!");
	}
}

$(document).ready(function () {
	$("#submit").click(function () {
		$.ajax({  
			url:'http://127.0.0.1:8081/postTrade', 
			data:{
				tradeType: $("input:radio:checked").val(),
				money: $("#money").val()
			}, 
			type: 'post', 
			cache: false, 
			dataType: 'json', 
			success: function (data) {
				console.log(data);
				process(data);
			},
			error: function(data) {
				alert("异常!");
			}
		});
	});
});
