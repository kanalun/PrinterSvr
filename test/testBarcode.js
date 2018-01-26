fs = require("fs");
var net = require('net');
var cmds = require('../lib/commands');
var iconv = require("iconv-lite");
var BH = require('bufferhelper');
var _queue = new BH();

var port = 9100;
var host = "192.168.123.100";
var client = new net.Socket();

function _writeCmd(cmd) {
    if (cmds[cmd]) {
        _queue.concat(new Buffer(cmds[cmd]));
    }
}

client.connect(port, host, function () {
    console.log('CONNECTED TO: ' + host + ':' + port);
    var INI_PAPER = new Buffer([0x1B, 0x40]);
    var CUT_PAPER = new Buffer([0x1d, 0x56, 0x41]);
    _queue.concat(INI_PAPER);
    _writeCmd('BARCODE_WIDTH');
    _writeCmd('BARCODE_HEIGHT');
    _writeCmd('BARCODE_FONT_A');
    _writeCmd('BARCODE_TXT_BLW');
    _writeCmd('BARCODE_UPC_E');
    _queue.concat(new Buffer("123111145\n"));
    client.write(_queue.toBuffer());
    client.end();
});