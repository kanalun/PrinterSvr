
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