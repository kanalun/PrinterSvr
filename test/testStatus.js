var net = require('net');

function status(callback) {
    var _this = this;
    var client = new net.Socket();
    client.setTimeout(100);
    var res;
    var msg = "对方没有返回数据";
    var status = 0;//表示正常连接
    client.on("error", function () {
        console.log('---------onerror------------');
        //console.log('无法连接网络打印机:');
        msg = "无法连接网络打印机";
        status = -1;
        if (callback) {
            // callback.call(_this, -1, "无法连接网络打印机", res)
        }
    });
    client.on("data", function (data) {
        console.log('---------ondata------------');
        res = data[0];
        msg = "设备返回数据";
        status = 1;
        client.end();
    });
    client.on('end', function () {
        console.log('---------onend------------');
        if (callback) {
            // callback.call(_this, 1, "OK", res)
        }
    });
    client.on('close', function () {
        console.log('---------onclose------------');
        if (callback) {
            callback.call(_this, status, msg, res)
        }
    });
    client.on('drain', function () {
        console.log('---------ondrain------------');
    });
    client.connect(9100, "192.168.123.100", function () {
        console.log('---------connect------------');
        //client.write(new Buffer([0x10, 0x04, 0x01]));
        //client.end();
        //client.close();
        //1秒后还没有收到应答就关闭socket
    });
    setTimeout(function () {
        try {
            client.end();
        } catch (e) {
        }
    }, 1000)
}

status(function (c, msg, s) {
    console.log(c, msg, s);
});