var net = require('net');
var cmds = require('../lib/commands');
var iconv = require("iconv-lite");

var port = 9100;
var host = "192.168.123.100";

var client = new net.Socket();
var BH = require('bufferhelper');


function qrcode(_queue, text, size, lsb, msb) {
    size = size ? size : '\x06';
    if (!/^[\w\:\/\.\?\&\=]+$/.test(text)) {
        _queue.concat(iconv.encode('二维码请使用英文和数字打印', "GB18030"));
        return;
    }
    _queue.concat(new Buffer(cmds['QRCODE_SIZE_MODAL']));
    _queue.concat(new Buffer(cmds['QRCODE_SIZE'] + size));
    _queue.concat(new Buffer(cmds.QRCODE_ERROR));
    _queue.concat(new Buffer(cmds['QRCODE_AREA_LSB'] + lsb + msb + cmds['QRCODE_AREA_MSB']));
    _queue.concat(new Buffer(text));
    _queue.concat(new Buffer(cmds.QRCODE_PRINT));
    return;
}

var data = new BH();
data.concat(new Buffer(cmds.INITIAL_PRINTER));
data.concat(new Buffer(cmds.CHN_TEXT));
//data.concat(new Buffer("abcdefg"));
data.concat(iconv.encode("开始打印", 'GB18030'));

data.concat(new Buffer(cmds.NEW_LINE));

qrcode(data,'ABCD_10086','\x0f','\x04','\x00');

for (var i = 0; i < 8; i++) {
    data.concat(new Buffer(cmds.NEW_LINE));
}
//data.concat(new Buffer(cmds.PAPER_CUTTING));

client.connect(port, host, function () {
    console.log('CONNECTED TO: ' + host + ':' + port);
    // var b = new Buffer("ab")
    client.write(data.toBuffer());
    client.end();
});


// var app = require('http').createServer(function (req, res) {
//
// });
//
// app.listen(8787, function () {
//     // console.log('打印服务器已经启动:' + host + ":" + port);
//     //// console.log('配置->IP:' + host + " 端口:" + port);
//     // console.log('您也可以在浏览器中打开 http://' + host + ":" + port + "查看服务状态信息!");
//     // if (iptable.localIP) {
//     console.log("您的局域网地址是:");
//     // }
// });