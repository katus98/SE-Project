function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>Rendering engine:</td><td>'+aData[1]+' '+aData[4]+'</td></tr>';
    sOut += '<tr><td>Link to source:</td><td>Could provide a link here!!!</td></tr>';
    sOut += '<tr><td>Extra info:</td><td>And any further details here (images etc)</td></tr>';
    sOut += '</table>';

    return sOut;
}


var feed_data;
function refresh_table(){
    $.ajax('/dynamic_table/refresh', {
        type: 'GET',
        async:false,
        dataType: 'json',
        success: function (data) {
            feed_data = data;
        },
        error: function () {
            alert('渲染失败！')
        }
    });
}

var _switch = "<label class=\"switch\"><input type=\"checkbox\" checked><span class=\"slider round\"></span></label>";
// var _switch2 = "  <input type=\"checkbox\" id=\"checkbox2\" checked />\n<label for=\"checkbox2\"></label>"




$(document).ready(function() {
    refresh_table();



    var oTable = $('#hidden-table-info').DataTable( {
        data: feed_data,
        columns: [
            { title: "代码" },
            { title: "名称" },
            { title: "成交" },
            { title: "变化" },
            { title: "幅度(%)" },
            { title: "开" },
            { title: "收" },
            // { title: "最高" },
            // { title: "最低" },
            { title: "转手" },
            { title: "总金量" },
            { title: "交易状态" },
            { title: "涨跌限制(%)" },
            { title: "详情" }
        ],
        lengthMenu: [ //自定义分页长度
            [ 10, 20, 30, 50 ],
            [ '10 页', '20 页', '30 页', '50 页' ]
        ],
        "processing": true,
        "oLanguage": {
            "sProcessing" : "正在获取数据，请稍后...",
            "sLengthMenu" : "显示 _MENU_ 条",
            "sZeroRecords" : "没有找到数据",
            "sInfo" : "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
            "sInfoEmpty" : "记录数为0",
            "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
            "sInfoPostFix" : "",
            "sSearch" : "查询",
            "sUrl" : "",
            "oPaginate" : {
                "sFirst" : "第一页",
                "sPrevious" : "上一页",
                "sNext" : "下一页",
                "sLast" : "最后一页"
            }

        },
        // "aoColumnDefs": [
        //     { "bSortable": false, "aTargets": [ 0 ] }
        // ],
        // "aaSorting": [[1, 'asc']]
    });
    // console.log(oTable);

    // var dlg = new DialogFx( $('#somedialog') );
    // $('[data-dialog]').click(function () {
    //     dlg.toggle.bind(dlg)
    // });


    $('body').delegate(".spinner", 'DOMContentLoaded', function () {
        $(this).spinner();
    });

    // whether one stock can be traded or not
    $('body').delegate('.switch input', 'change', function () {
        var _code = $(this).parent().parent().prevAll().last().text();
        var deal_status = {
            code: _code,
            msg: 0
        };
        if ($(this).is(':checked')) // start trade
        {
            deal_status.msg = 1
        }
        else // stop trade
        {

        }
        console.log(deal_status);

        var r = confirm("确定执行本操作？");
        if (r)
        {
            $.ajax('/dynamic_table/trade_status', {
                type: 'POST',
                data: deal_status,
                success: function (data) {
                    alert('成功!')
                },
                error: function () {
                    alert('出现异常!')
                }
            });
        }

    });

    // set rise/drop rate
    $('body').delegate('button.btn.btn-danger', 'click', function () {
        var _code = $(this).parent().prevAll().last().text();
        var change_rate = $(this).prev().val();
        console.log(_code);
        console.log(change_rate);


        var change_status = {
            code: _code,
            rate: change_rate
        };
        var r = confirm("确定执行本操作？");
        if (r)
        {
            $.ajax('/dynamic_table/change_rate', {
                type: 'POST',
                data: change_status,
                success: function (data) {
                    alert('成功!')
                },
                error: function () {
                    alert('出现异常!')
                }
            });
        }
    });


    var dealTable1 = null;
    var dealTable2 = null;
    // detail information
    $('body').delegate('button.btn.btn-info', 'click', function () {
        var _code = $(this).parent().prevAll().last().text();
        console.log(_code);
        $('#stock_id').html(_code);
        var info = { code: _code };
        if(dealTable1 !== null)
        {
            dealTable1.destroy();
            $('#buy-data').empty();
        }
        var buy_data;
        $.ajax('/dynamic_table/buy', {
            type: 'POST',
            async: false,
            data: info,
            dataType: 'json',
            success: function (data) {
                buy_data = data;
            },
            error: function () {
                alert('渲染失败！')
            }
        });

        dealTable1 = $('#buy-data').DataTable( {
            data: buy_data,
            columns: [
                { title: "操作用户" },
                { title: "价格" },
                { title: "时间" },
                { title: "股数" }
            ],
            // lengthMenu: [ //自定义分页长度
            //     [ 10, 20, 30, 50 ],
            //     [ '10 页', '20 页', '30 页', '50 页' ]
            // ],
            "processing": true,
            "oLanguage": {
                "sProcessing" : "正在获取数据，请稍后...",
                "sLengthMenu" : "显示 _MENU_ 条",
                "sZeroRecords" : "没有找到数据",
                "sInfo" : "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
                "sInfoEmpty" : "记录数为0",
                "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
                "sInfoPostFix" : "",
                "sSearch" : "查询",
                "sUrl" : "",
                "oPaginate" : {
                    "sFirst" : "第一页",
                    "sPrevious" : "上一页",
                    "sNext" : "下一页",
                    "sLast" : "最后一页"
                }
            },
            // "aoColumnDefs": [
            //     { "bSortable": false, "aTargets": [ 0 ] }
            // ],
            // "aaSorting": [[1, 'asc']]
        });


        if(dealTable2 !== null)
        {
            dealTable2.destroy();
            $('#sell-data').empty();
        }
        var sell_data;
        $.ajax('/dynamic_table/sell', {
            type: 'POST',
            async: false,
            data: info,
            dataType: 'json',
            success: function (data) {
                sell_data = data;
            },
            error: function () {
                alert('渲染失败！')
            }
        });

        dealTable2 = $('#sell-data').DataTable( {
            data: sell_data,
            columns: [
                { title: "操作用户" },
                { title: "价格" },
                { title: "时间" },
                { title: "股数" }
            ],
            // lengthMenu: [ //自定义分页长度
            //     [ 10, 20, 30, 50 ],
            //     [ '10 页', '20 页', '30 页', '50 页' ]
            // ],
            "processing": true,
            "oLanguage": {
                "sProcessing" : "正在获取数据，请稍后...",
                "sLengthMenu" : "显示 _MENU_ 条",
                "sZeroRecords" : "没有找到数据",
                "sInfo" : "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
                "sInfoEmpty" : "记录数为0",
                "sInfoFiltered" : "(全部记录数 _MAX_ 条)",
                "sInfoPostFix" : "",
                "sSearch" : "查询",
                "sUrl" : "",
                "oPaginate" : {
                    "sFirst" : "第一页",
                    "sPrevious" : "上一页",
                    "sNext" : "下一页",
                    "sLast" : "最后一页"
                }
            },
            // "aoColumnDefs": [
            //     { "bSortable": false, "aTargets": [ 0 ] }
            // ],
            // "aaSorting": [[1, 'asc']]
        });

    });



} );