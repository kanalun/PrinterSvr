var arr = [];
arr[parseInt(1 / 8)] = "fdsfsd";
console.log(arr[0]);
console.log(0x61);
console.log(0x45);
console.log(128 >> 4);


function ipStrToInt32(ipStr) {
    var ipstrs = ipStr.split('.');
    // console.log(ipstrs);
    var ipInt = parseInt(parseInt(ipstrs[3]) + (parseInt(ipstrs[2]) << 8)
        + (parseInt(ipstrs[1]) << 16) + (parseInt(ipstrs[0]) << 24));
    // console.log(ipInt);
    return ipInt;
}

function ipInt32ToStr(ipInt) {
    var ipStr = ((ipInt & 0xFF000000) >>> 24) + "." +
        ((ipInt & 0xFF0000) >>> 16) + "." + ((ipInt & 0xFF00) >>> 8) + "." + (ipInt & 0xFF);
    //console.log(ipStr);
    return ipStr;
}

function getIps(ipStr, netMaskSt) {
    var res = [];
    var ip = ipStrToInt32(ipStr);
    var netmask = ipStrToInt32(netMaskSt);
    var net = ip & netmask;
    var max = ipStrToInt32("255.255.255.255") - netmask;
    for (var ip_ = net + 1; ip_ < net + max; ip_++) {
        console.log(ipInt32ToStr(ip_));
        res.push(ipInt32ToStr(ip_))
    }
    return res;
}

return;

console.log("---------------------------");
var ipstr = "192.168.123.101";
var ip = ipStrToInt32(ipstr);
var netmask = ipStrToInt32("255.255.255.0");
var net = ip & netmask;
//var host = (ip - net);
//var hosts =
console.log("net:" + ipInt32ToStr(net));
//最大主机数(包含网络地址和广播地址)
max = ipStrToInt32("255.255.255.255") - netmask;
//hostmax = max & netmask;
console.log(max)
console.log("---------------------------");
for (var ip_ = net + 1; ip_ < net + max; ip_++) {
    console.log(ipInt32ToStr(ip_));
    //console.log(ipInt32ToStr(ip_))
}

//ipStrToInt32("0.0.0.1");
//var x = new Buffer();