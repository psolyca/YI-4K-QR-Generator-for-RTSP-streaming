var firmware = "custom";
var wifi = "default";
var ethernet = false;
var qrcode = new QRCode("qrcode");

$(function () {
    $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});
})
function wifi_mode (mode = "") {
    $("#ssid").val("")
    $("#pwd").val("")
    wifi = !mode ? $("input[name=wifi_mode]:checked").val() : mode;
    if ( wifi == "sta" || wifi == "ap" ) {
        $("#ssid_input").removeClass('d-none');
        $("#pwd_input").removeClass('d-none');
        $("#ether_check").removeClass('d-none');
    } else {
        $("#ssid_input").addClass('d-none');
        $("#pwd_input").addClass('d-none');
        $("#ether_check").addClass('d-none');
    }
}

$("input[name=firmware]").change(function(e) {
    firmware = $(this).val()
    if ( firmware == "custom" ) {
        $("#custom_parameters").removeClass('d-none');
        wifi_mode();
    } else {
        $("#custom_parameters").addClass('d-none');
        wifi_mode("sta");
    }
})

$("input[name=wifi_mode]").change(function() {wifi_mode();});

$("#ethernet").on("click", function() {
    ethernet = $("#ethernet").is(":checked");
    if ( ethernet ) {
        $("#ether_switch").text("on");
    } else {
        $("#ether_switch").text("off");
    }
})

$('input[type=text]').on('keydown', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        makeCode();
    }
});

function makeCode() {
    var ssid = $("#ssid").val();
    var qrssid = ssid
    var ip = $("#ip").val();
    var res = $("#res").val();
    var pwd = $("#pwd").val();
    var rate = $("#rate").val();

    if (rate == "1.37 Mbps") {
        rate = 3;
    }
    if (rate == "1.1 Mbps") {
        rate = 2;
    }
    if (rate == "0.9 Mbps") {
        rate = 1;
    }

    if ( !ssid && wifi !== "default" ) {
        $('.modal-header').html("Error");
        $("#qrcode").hide();
        $("#modal").modal("toggle");
        $('#info').html("<h3>Please input at least SSID</h3>");
        return;
    }

    if (firmware === "custom") {
        if (wifi === "default") {
            qrssid = "None";
        } else {
            qrssid += "-" + mode;
        }

        if ( ethernet ) {
            qrssid += "-ethernet"
        }
    }

    qrcode.makeCode('{"res":"' + res + '","sign":"","url":"rtmp://' + ip + '","ak":"","ssid":"' + qrssid +
        '","pwd":"' + pwd + '","rate":"' + rate + '","dur":""}');
    $("#info").empty();
    $('.modal-header').html("Scan QR with YI 4K Action Camera");
    if ( wifi !== "default") {
        $('#info').append("SSID: " + ssid + "<br />").append("Pass: " + pwd + "<br />")
    }
    $('#info').append("IP: " + ip + "<br />").append("Resolution: " + res +
        "<br />").append("Bitrate: " + rate + "<br />");
    $("#modal").modal("toggle");
    $("#qrcode").show();
}