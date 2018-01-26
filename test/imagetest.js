fs = require("fs");
var net = require('net');
var cmds = require('../lib/commands');
var iconv = require("iconv-lite");

var BH = require('bufferhelper');
var d = new BH();
var INI_PAPER = new Buffer([0x1B, 0x40]);
var CUT_PAPER = new Buffer([0x1d, 0x56, 0x41]);
write(INI_PAPER);
//write(new Buffer("hello"));
//write(CUT_PAPER);
var h = 430;
var w = 430;

var bitMap = [w, h];


var readStream = fs.createReadStream("/Users/elva/Desktop/bytemap.bmp");
var filedata = new BH();
readStream.on('data', function (chunk) {
    filedata.concat(chunk);
    //console.log(chunk);
});

function write(data) {
    d.concat(data);
}

for (var x = 0; x < w; x++) {
    bitMap[x] = [];
    for (var y = 0; y < h; y++) {
    }
}


readStream.on('end', function () {
    //console.log(typeof filedata);
    var fileBuffer = filedata.toBuffer();
    console.log(fileBuffer.length);
    for (var ix = 0; ix < fileBuffer.length; ix++) {
        var gray = fileBuffer[ix];
        //console.log(gray);
        // bitMap[i] = x;
        if (gray < 128) {
            bitMap[parseInt(ix % w)][parseInt(ix / w)] = 0x00;
        } else {
            bitMap[parseInt(ix % w)][parseInt(ix / w)] = 0xFF;
        }
        //bitMap[i % w][i / w] = gray;
        //if (x != 0)
        // console.log(bitMap[i % w][i / w] );
        //bitMap[i / 4] = fileBuffer[i] << 4 +
        //   fileBuffer[i + 1] << 3 + fileBuffer[i + 2] << 2 + fileBuffer;
    }


    //return;
    //console.log(bitMap.length);
    var data = [0x1B, 0x33, 0x00];
    write(new Buffer(data));
    data[0] = 0x00;
    data[1] = 0x00;
    data[2] = 0x00; // 重置参数
    var escBmp = new Buffer([0x1B, 0x2A, 0x00, 0x00, 0x00]);
    escBmp[2] = 0x21;
    // nL, nH
    escBmp[3] = (w % 256);
    escBmp[4] = (h / 256);

    var pixelColor;
    // 每行进行打印
    for (var i = 0; i < h / 24 + 1; i++) {
        write(escBmp);//开始新的一行
        for (var j = 0; j < w; j++) {
            for (var k = 0; k < 24; k++) {
                if (((i * 24) + k) < h) {
                    pixelColor = bitMap[j] [((i * 24) + k)];
                    if (pixelColor != 0xFF) {//如果有颜色
                        data[parseInt(k / 8)] += (128 >> (k % 8));//对于的比特位置1
                    }
                }
            }
            console.log(data[0] >> 1, data[1] >> 1, data[2] >> 1);
            write(new Buffer(data));
            // 重置参数
            data[0] = 0x00;
            data[1] = 0x00;
            data[2] = 0x00;
        }
        // 换行
        var byte_send1 = new Buffer(2);
        byte_send1[0] = 0x0d;
        byte_send1[1] = 0x0a;
        write(byte_send1);
    }


    var port = 9100;
    var host = "192.168.123.100";
    var client = new net.Socket();

    client.connect(port, host, function () {
        console.log('CONNECTED TO: ' + host + ':' + port);
        client.write(d.toBuffer());
        client.end();
    });

});
