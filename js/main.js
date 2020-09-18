var firmware = "custom";
var wifi = "default";
var file = "conf";
var usb = "default";
var rtmp = "rtmp"
var qrcode = new QRCode("qrcode");

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/js/sw.js', { scope: '/'}).then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

            if(registration.installing) {
                console.log('Service worker installing');
              } else if(registration.waiting) {
                console.log('Service worker installed');
              } else if(registration.active) {
                console.log('Service worker active');
              }

        }, function(error) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}


$(function () {
    $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});
})

$("input[name=firmware]").on("click", function(e) {
    firmware = $(this).val()
    if ( firmware == "custom" ) {
        $("#usb_parameters").removeClass('d-none');
        $("#wifi_mode").removeClass('d-none');
        $("#rtmp_wifi").removeClass('d-none');
        wifi_mode("default");
    } else {
        $("#usb_parameters").addClass('d-none');
        $("#wifi_mode").addClass('d-none');
        $("#file_conf").addClass('d-none');
        $("#rtmp_wifi").addClass('d-none');
        file_conf("custom");
    }
})

function wifi_mode (mode = "") {
    wifi = !mode ? $("input[name=wifi_mode]:checked").val() : mode;
    if ( wifi == "sta" || wifi == "ap" ) {
        $("#file_conf").removeClass('d-none');
    } else {
        $("#label_wifi_sta").removeClass('active');
        $("#label_wifi_ap").removeClass('active');
        $("#radio_wifi_default").prop("checked", true);
        $("#label_wifi_default").addClass('active');
        $("#file_conf").addClass('d-none');
        $("#radio_file_conf").prop("checked", true);
        $("#label_file_custom").removeClass('active');
        $("#label_file_conf").addClass('active');
    }
    file_conf();
}

$("input[name=wifi_mode]").on("click", function() {wifi_mode();});

function file_conf (mode = "") {
    $("#ssid").val("");
    $("#pwd").val("");
    file = !mode ? $("input[name=file_conf]:checked").val() : mode;
    if ( file == "custom") {
        $("#ssid_input").removeClass('d-none');
        $("#pwd_input").removeClass('d-none');
    } else {
        $("#ssid_input").addClass('d-none');
        $("#pwd_input").addClass('d-none');
    }
}

$("input[name=file_conf]").on("click", function() {file_conf();});

$("input[name=usb_check]").on("click", function() {
    usb = $(this).val();
});

$("input[name=rtmp_wifi]").on("click", function() {
    rtmp = $(this).val();
    if ( rtmp == "wifi" ) {
        $("#rtmp_ip").addClass("d-none");
        $("#rtmp_settings").addClass("d-none");
        $("#ip").val("127.0.0.1/live");
    } else {
        $("#rtmp_ip").removeClass("d-none");
        $("#rtmp_settings").removeClass("d-none");
    }
});

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

    if ( !ssid && file === "custom" ) {
        $('.modal-header').html("Error");
        $("#qrcode").hide();
        $("#modal").modal("toggle");
        $('#info').html("<h3>Please input at least SSID</h3>");
        return;
    }

    if (firmware === "custom") {
        if (qrssid === "") {
            qrssid = "None"
        }

        if (wifi !== "default") {
            qrssid += "+" + wifi;
        }

        if ( usb === "fire") {
            qrssid += "+usb";
        } else if ( usb === "stop") {
            qrssid += "-usb";
        }

        if ( rtmp === "wifi" ) {
            qrssid += "-rtmp"
        }
    }

    qrcode.makeCode('{"res":"' + res + '","sign":"","url":"rtmp://' + ip + '","ak":"","ssid":"' + qrssid +
        '","pwd":"' + pwd + '","rate":"' + rate + '","dur":""}');
    $("#info").empty();
    $('.modal-header').html("Scan QR with YI 4K Action Camera");
    if ( ssid ) {
        $('#info').append("SSID: " + ssid + "<br />").append("Pass: " + pwd + "<br />")
    }
    $('#info').append("IP: " + ip + "<br />").append("Resolution: " + res +
        "<br />").append("Bitrate: " + rate + "<br />");
    $("#modal").modal("toggle");
    $("#qrcode").show();
}
