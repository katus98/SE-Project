$(document).ready(function () {
    let status = $('#temp').text();
    if (status === '10') {
        $('#conIM').attr("checked", true);
        $('#conAUTO').prop("disabled", true);
    } else if (status === '01') {
        $('#conIM').prop("disabled", true);
        $('#conAUTO').attr("checked", true);
    } else if (status === '11') {
        $('#conIM').attr("checked", true);
        $('#conAUTO').attr("checked", true);
    }
    $('#conIM').change(function () {
        if (status.charAt(0) === '0') {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: "/home/start",
                data: {},
                success: function (result) {
                    alert(result);
                    $('#conAUTO').prop("disabled", true);
                    status = '1' + status.charAt(1);
                },
                error: function () {
                    alert("Start failed!");
                }
            });
        } else {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: "/home/stop",
                data: {},
                success: function (result) {
                    alert(result);
                    $('#conAUTO').prop("disabled", false);
                    status = '0' + status.charAt(1);
                },
                error: function () {
                    alert("Stop failed!");
                }
            });
        }
    });
    $('#conAUTO').change(function () {
        if (status.charAt(1) === '0') {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: "/home/startSystem",
                data: {},
                success: function (result) {
                    alert(result);
                    $('#conIM').prop("disabled", true);
                    status = status.charAt(0) + '1';
                },
                error: function () {
                    alert("Start System Error!");
                }
            });
        } else {
            $.ajax({
                type: "POST",
                dataType: "text",
                url: "/home/stopSystem",
                data: {},
                success: function (result) {
                    alert(result);
                    $('#conIM').prop("disabled", false);
                    status = status.charAt(0) + '0';
                },
                error: function () {
                    alert("Stop System Error!");
                }
            });
        }
    });
});