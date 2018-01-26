var net = require('net');

/**
 * 字符串IP地址转32位int
 * @param ipStr
 * @returns {Number}
 */
function ipStrToInt32(ipStr) {
    var ipstrs = ipStr.split('.');
    var ipInt = parseInt(parseInt(ipstrs[3]) + (parseInt(ipstrs[2]) << 8)
        + (parseInt(ipstrs[1]) << 16) + (parseInt(ipstrs[0]) << 24));
    return ipInt;
}

/**
 * 32位ipint转.分隔符字符串
 * @param ipInt
 * @returns {string}
 */
function ipInt32ToStr(ipInt) {
    var ipStr = ((ipInt & 0xFF000000) >>> 24) + "." +
        ((ipInt & 0xFF0000) >>> 16) + "." + ((ipInt & 0xFF00) >>> 8) + "." + (ipInt & 0xFF);
    return ipStr;
}

/**
 * 返回局域网内IP地址列表
 * @param ipStr
 * @param netMaskSt
 * @returns {Array}
 */
function getIps(ipStr, netmaskStr) {
    var res = [];
    var ip = ipStrToInt32(ipStr);
    var netmask = ipStrToInt32(netmaskStr);
    var net = ip & netmask;
    var max = ipStrToInt32("255.255.255.255") - netmask;
    for (var ip_ = net + 1; ip_ < net + max; ip_++) {
        //console.log(ipInt32ToStr(ip_));
        res.push(ipInt32ToStr(ip_))
    }
    return res;
}

/**
 * 网路打印机对象
 * @param  {string}   name 打印机名:在这里是host:port
 * @param  {function} callback     function(err,msg),当获取打印机后执行,如果不存在指定打印机，返回err信息
 */
var NetPrinter = function (name) {
    if (!name || name == "") {
        name = "127.0.0.1:9100";
        console.log("printer name undefied use default:" + name);
    }
    var names = name.split(":");
    if (names.length != 2) {
        console.log('printer name mast be host:port');
        //throw e
        return;
    }
    this.host = names[0];
    try {
        this.port = parseInt(names[1]);
    } catch (e) {
        this.port = 9100;
    }
};

NetPrinter.prototype = {
    /**
     * 搜索局域网打印机,暂不可用
     */
    searchPrinter: function () {
        var os = require('os'),
            iptable = {},
            ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function (details, alias) {
                if ((details.family == 'IPv4') && (details.internal == false)) {
                    //iptable[dev+(alias?':'+alias:'')]=details.address;
                    iptable['localIP'] = details.address;
                    iptable['LocalNetmask'] = details.netmask;
                }
            });
        }
        //TODO 同步问题
        var found = [];
        if (iptable.localIP != null && iptable.LocalNetmask != null) {
            //console.log("" + iptable.localIP);
            //console.log("" + iptable.LocalNetmask);
            var ip = iptable.localIP;
            var netmask = iptable.LocalNetmask;
            var searchIps = getIps(ip, netmask);
            searchIps.forEach(function (ip_) {
                var client = new net.Socket();
                client.setTimeout(200);
                client.on("error", function () {
                    console.log('无法连接网络打印机: ' + ip_ + ':9100');
                });
                client.connect(9100, ip_, function () {
                    console.log("打印机器:" + ip_);
                    client.end();
                });
            });
        }
    },
    /**
     * 查询打印机状态
     * @param callback
     *            包含3个参数的fun(status,msg,res)status表示连接状态,res表示连接打印机之后打印机返回的信息
     */
    status: function (callback) {
        var _this = this;
        var client = new net.Socket();
        client.setTimeout(1000, function () {
            console.log('---------timeout2------------');
            client.end();
        });
        var res;
        var msg = "打印机(或许是别的设备)没有返回数据";
        var status = 0;//表示正常连接
        client.on("error", function () {
            console.log('---------onerror------------');
            console.log('无法连接网络打印机:');
            msg = "无法连接网络打印机";
            status = -1;
        });
        client.on("data", function (data) {
            console.log('---------ondata------------');
            res = data[0];
            msg = "恭喜,设备返回数据";
            status = 1;
            client.end();
        });
        client.on('end', function () {
            console.log('---------onend------------');
        });
        client.on('close', function () {
            console.log('---------onclose------------');
            if (callback) {
                callback.call(_this, status, msg, res)
            }
        });
        client.connect(_this.port, _this.host, function () {
            console.log('---------connect------------');
            //写入状态查询命令
            client.write(new Buffer([0x10, 0x04, 0x01]));
        });
        //1秒后还没有收到应答就关闭socket
        setTimeout(function () {
            try {
                console.log('---------timeout1------------');
                client.end();
            } catch (e) {
            }
        }, 1000);
    },
    /**
     * 打印任务
     * @param taskList 打印任务列表
     * @param  {Function} callback function(err,msg),当执行打印后，回调该函数，打印错误返回err信息
     */
    printTasks: function (taskList, callback) {
        var _taskList = taskList;
        var _this = this;
        try {
            var client = new net.Socket();
            client.on("error", function () {
                console.log('无法连接网络打印机: ' + _this.host + ':' + _this.port);
                if (callback) {
                    callback.call(_this, taskList, "NET_ERROR", 'Print_failed');
                }
            });
            client.on('close', function (data) {
                console.log('打印机断开' + data);
                //if(callback){callback.call(_this, null, 'Prin_OK');}
            });
            client.on('data', function (data) {
                console.log('打印机发来贺电:' + data);
                //if(callback){callback.call(_this, null, 'Prin_OK');}
            });
            // client.setTimeout(800);
            client.connect(_this.port, _this.host, function () {
                console.log('CONNECTED TO: ' + _this.host + ':' + _this.port);
                var taskArr = _taskList.getList();
                for (var i in taskArr) {
                    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
                    client.write(taskArr[i]._queue.toBuffer());
                    taskArr[i]._status = 5;
                    taskArr[i]._statusMsg = "ok";
                }
                client.end();
                if (callback) {
                    callback.call(_this, taskList, null, 'Print_OK');
                }
            });
            console.log("END!!!!");
        } catch (e) {
            if (callback) {
                callback.call(_this, taskList, e, 'Print_Failed');
            }
        }
    }
};
module.exports = NetPrinter;
//var np = new NetPrinter("192.168.123.100:9100").status();