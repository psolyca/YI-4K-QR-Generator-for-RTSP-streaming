var qrcode = new QRCode("qrcode");

$('input[type=text]').on('keydown', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        makeCode();
    }
});

function makeCode() {
    var ssid = $("#ssid").val();
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

    if (!ssid) {
        $('.modal-header').html("Error");
        $("#qrcode").hide();
        $("#modal").modal("toggle");
        $('#info').html("<h3>Please input at least SSID</h3>");
        return;
    }

    qrcode.makeCode('{"res":"' + res + '","sign":"","url":"rtmp://' + ip + '","ak":"","ssid":"' + ssid +
        '","pwd":"' + pwd + '","rate":"' + rate + '","dur":""}');
    $("#info").empty();
    $('.modal-header').html("Scan QR with YI 4K+ Action Camera");
    $('#info').append("SSID: " + ssid + "<br />").append("IP: " + ip + "<br />").append("Resolution: " + res +
        "<br />").append("Bitrate: " + rate + "<br />").append("Pass: " + pwd);
    $("#modal").modal("toggle");
    $("#qrcode").show();
}