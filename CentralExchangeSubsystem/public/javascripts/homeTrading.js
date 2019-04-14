function genTab (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    var str1 = "";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].id + "</td>";
        str1 += "<td>" + json[i].time + "</td>";
        str1 += "<td>" + json[i].uid + "</td>";
        str1 += "<td>" + json[i].shares + "</td>";
        str1 += "<td>" + json[i].price + "</td>";
        str1 += "<td>" + json[i].shares2trade + "</td>";
        str1 += "<td>" + json[i].status + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

$(document).ready(function () {
    $("#submit").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/orderSubmit",
            data: $("#tradeOrder").serialize(),
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("由于系统原因交易指令发出失败!");
            }
        });
    });
    $("#queryAllCell").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryCell",
            data: {},
            success: function (result) {
                console.log(result);
                genTab(result, "tabCell");
                alert("查询成功!");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#queryAllBuy").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryBuy",
            data: {},
            success: function (result) {
                console.log(result);
                genTab(result, "tabBuy");
                alert("查询成功!");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#test").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/test",
            data: $("#tradeOrder").serialize(),
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("test failed!");
            }
        });
    });
});