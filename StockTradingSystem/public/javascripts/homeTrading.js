function genTab (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>ID</td><td>发布时间</td><td>持股号</td><td>股票ID</td><td>发布股份</td><td>发布价格</td><td>未撮合股份</td><td>状态</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].id + "</td>";
        str1 += "<td>" + json[i].time + "</td>";
        str1 += "<td>" + json[i].uid + "</td>";
        str1 += "<td>" + json[i].code + "</td>";
        str1 += "<td>" + json[i].shares + "</td>";
        str1 += "<td>" + json[i].price + "</td>";
        str1 += "<td>" + json[i].shares2trade + "</td>";
        str1 += "<td>" + json[i].status + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

function genTab2 (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>ID</td><td>发布时间</td><td>持股号</td><td>股票ID</td><td>发布股份</td><td>发布价格</td><td>交易类型</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].id + "</td>";
        str1 += "<td>" + json[i].time + "</td>";
        str1 += "<td>" + json[i].uid + "</td>";
        str1 += "<td>" + json[i].code + "</td>";
        str1 += "<td>" + json[i].shares + "</td>";
        str1 += "<td>" + json[i].price + "</td>";
        str1 += "<td>" + json[i].tradetype + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

function genTab3 (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>持股号</td><td>股票ID</td><td>可交易股份</td><td>冻结股份</td><td>持股成本</td><td>更新时间</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].personid + "</td>";
        str1 += "<td>" + json[i].stockid + "</td>";
        str1 += "<td>" + json[i].stocknum + "</td>";
        str1 += "<td>" + json[i].frozenstocknum + "</td>";
        str1 += "<td>" + json[i].stockcost + "</td>";
        str1 += "<td>" + json[i].updatetime + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

function genTab4 (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>资金账户</td><td>关联证券账户</td><td>资金账户状态</td><td>可用资金</td><td>冻结资金</td><td>利息</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].capitalaccountid + "</td>";
        str1 += "<td>" + json[i].relatedsecuritiesaccountid + "</td>";
        str1 += "<td>" + json[i].capitalaccountstate + "</td>";
        str1 += "<td>" + json[i].availablemoney + "</td>";
        str1 += "<td>" + json[i].frozenmoney + "</td>";
        str1 += "<td>" + json[i].interestremained + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

function genTab5 (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>ID</td><td>出售指令ID</td><td>购买指令ID</td><td>撮合股份</td><td>出售价格</td><td>购买价格</td><td>撮合价格</td><td>撮合时间</td><td>股票ID</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].matchid + "</td>";
        str1 += "<td>" + json[i].askid + "</td>";
        str1 += "<td>" + json[i].bidid + "</td>";
        str1 += "<td>" + json[i].shares + "</td>";
        str1 += "<td>" + json[i].askprice + "</td>";
        str1 += "<td>" + json[i].bidprice + "</td>";
        str1 += "<td>" + json[i].matchprice + "</td>";
        str1 += "<td>" + json[i].matchtime + "</td>";
        str1 += "<td>" + json[i].code + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

function genTab6 (json, eleId) {
    document.getElementById(eleId).innerHTML = "";
    let str1 = "";
    str1 += "<tr><td>股票ID</td><td>名称</td><td>实时价格</td><td>开盘价</td><td>允许交易?</td><td>涨跌幅限制</td><td>是否ST?</td></tr>";
    for (let i in json) {
        str1 += "<tr>";
        str1 += "<td>" + json[i].code + "</td>";
        str1 += "<td>" + json[i].name_stock + "</td>";
        str1 += "<td>" + json[i].current_price + "</td>";
        str1 += "<td>" + json[i].last_endprice + "</td>";
        str1 += "<td>" + json[i].permission + "</td>";
        str1 += "<td>" + json[i].percentagepricechange + "</td>";
        str1 += "<td>" + json[i].st + "</td>";
        str1 += "</tr>";
    }
    document.getElementById(eleId).innerHTML = str1;
}

$(document).ready(function () {
    $("#submit").click(function () {
        if ($("#stockNum").val() >= 1 && $("#pricePer").val() >= 0.01 && $("#userId").val() !== '') {
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
        } else {
            alert("请输入合法的用户ID、股票数量和价格！");
        }
    });
    $("#queryAllSell").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/querySell",
            data: {},
            success: function (result) {
                console.log(result);
                genTab(result, "tabSell");
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
    $("#queryAllTemp").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryTemp",
            data: {},
            success: function (result) {
                console.log(result);
                genTab2(result, "tabTemp");
                alert("查询成功!");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#start").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/start",
            data: {},
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("Start failed!");
            }
        });
    });
    $("#stop").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/stop",
            data: {},
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("Stop failed!");
            }
        });
    });
    $("#startSystem").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/startSystem",
            data: {},
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("Start System Error!");
            }
        });
    });
    $("#stopSystem").click(function () {
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/home/stopSystem",
            data: {},
            success: function (result) {
                alert(result);
            },
            error: function () {
                alert("Stop System Error!");
            }
        });
    });
    $("#queryAllStockHold").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryStockHold",
            data: {},
            success: function (result) {
                genTab3(result, "tabStockHold");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#queryAllCapital").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryCapital",
            data: {},
            success: function (result) {
                genTab4(result, "tabCapital");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#queryAllMatch").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryMatch",
            data: {},
            success: function (result) {
                genTab5(result, "tabMatch");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
    $("#queryAllStock").click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/home/queryStock",
            data: {},
            success: function (result) {
                genTab6(result, "tabStock");
            },
            error: function () {
                alert("由于系统原因查询失败!");
            }
        });
    });
});