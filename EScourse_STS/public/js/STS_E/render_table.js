
var align = "class=\"center hidden-phone\"";
var _switch = "<label class=\"switch\"><input type=\"checkbox\" checked><span class=\"slider round\"></span></label>";

String.prototype.format = function () {
    var args = [].slice.call(arguments);
    return this.replace(/(\{\d+\})/g, function (a){
        return args[+(a.substr(1,a.length-2))||0];
    });
};

var record_template = "<tr>\
    <td></td>\
    <td>{0}</td>\
    <td>{1}</td>\
    <td>{2}</td>\
    <td>{3}</td>\
    <td>{4}</td>\
    <td>{5}</td>\
    <td>{6}</td>\
    <td>{7}</td>\
    <td>{8}</td>\
    <td>{9}</td>\
    <td>{10}</td>\
    <td>{11}</td>\
    </tr>";


const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function render_table(data) {
    $('#auth_table').empty();
    console.log(data.length);
    $('#hidden-table-info').DataTable({
        data:data
    });
    // for (let record of data) {
    //     let content = record_template.format(record['code'], record['name_stock'], record['current_price'],1,1,
    //         record['start_price'], record['end_price'], record['high_price'], record['low_price'], record['low_price'],
    //         record['volumn'], _switch);
    //     $('#auth_table').append(content);
    // }


}

// function refresh_table(){
//     $.ajax('/dynamic_table/refresh', {
//         type: 'GET',
//         dataType: 'json',
//         success: function (data) {
//             console.log(data);
//             render_table(data);
//         },
//         error: function () {
//             alert('渲染失败！')
//         }
//     });
// }

$(document).ready(function(){
    //sleep(5000).then(()=>{
        refresh_table();
    //});
});