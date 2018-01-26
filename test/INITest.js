
var INI = require("../lib/INI");//INI模块
var ini = INI.createINI();//创建一个新的INI

ini.count = 12;//ini文件的Start(没有Section的属性)

//创建一个Section[httpserver]
var httpServer = ini.getOrCreateSection("httpserver");
httpServer['host'] = "127.0.0.1";
httpServer.port = 8080;


// 控制台打印
// count = 12
//[httpserver]
//host= 127.0.0.1
//port= 8080
console.log("**********************\n" + ini);

var fs = require('fs');

fs.writeFileSync('conf.ini', ini);//INI 写入 conf.ini

var ini___ = INI.loadFileSync("conf.ini")//从conf.ini读取配置

console.log("**********************\n" + ini___);

var se = ini___.getOrCreateSection("httpserver");//取得httpserver
se.root = "/temp";//添加新的属性
se['host'] = "192.168.1.2";//修改属性

var new_se = ini___.getOrCreateSection("new_se");//添加新的Section
new_se.test = true;

console.log("**********************\n" + ini___);

fs.writeFileSync('conf.ini', ini___);//写入文件