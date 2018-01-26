var url = require("url");
var path = require('path');
var querystring = require("querystring");
var PrintTask = require('./lib/PrintTask.js');
var NetPrinter = require('./lib/NetPrinter.js');

process.on('uncaughtException', function (e) {
    console.log("uncaughtExceprion", e);
});

process.on('unhandledRejection', function (e, p) {
    console.log("unhandledRejection", e);
});

/**
 * 设置打印状态
 * @param  {Function} callback 回调函数，当打印成功后执行该函数
 */
function TaskList() {
    this.taskList = []; //需返回的列表
}

TaskList.prototype = {
    /**
     * 增加状态列表
     * @param  {PrintTask} task 增加数据
     * @return {number}      列表编号
     */
    addTask: function (task) {
        if (task) {
            this.taskList.push(task);
        }
    },
    /**
     * 更新列表
     * @param  {number} number 列表编号
     * @param  {object} data   更新数据
     * @return {boolen}        是否已全部更新
     */
    getTask: function (taskId) {
        for (var i in taskList) {
            if (taskId == taskList[i]._id) {
                return taskList[i];
            }
        }
    },
    /**
     * 获取列表
     * @return {object} 列表数据
     */
    getList: function () {
        return this.taskList;
    }
};

function error(res, status, msg) {
    var data = {
        status: status,
        msg: msg
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.end(JSON.stringify(data));
}

function info(req, res) {
    console.log("-----info------");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<head><meta charset="utf-8"/></head>');
    res.write('<h2>XD-PrinterServ已经启动</h2>');
    res.write('<h3>您的局域网IP是:' + iptable.localIP + '</h3>');
    res.end('<h3>端口号是:' + port + '</h3>');
    //res.end('<b>亲爱的，你慢慢飞，小心前面带刺的玫瑰...</b>');
    //res.end(JSON.stringify(data));
}

function status(req, res) {
    console.log("-----status------");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok');
}

function version(req, res) {
    console.log("-----version------");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('2.6.1');
}


function _getData(req, res, chunk) {
    try {
        var print_data = JSON.parse(chunk);
        return print_data;
    } catch (e) {
        error(res, 0, "数据无法无法解析,格式不正确:" + e.toString());
        return null;
    }
}

function print(req, res, chunk) {
    console.log("-----print------");
    try {
        var print_data = _getData(req, res, chunk);
        if (!print_data) {
            return;
        }
        console.log("print: data:" + print_data);
        var tasks = new TaskList();
        //执行批量打印
        var np;
        for (var i = 0; i < print_data.length && i < 1; i++) {
            var task = new PrintTask(print_data[i].id, print_data[i].group_id);
            task.compile(print_data[i].content).ready();
            tasks.addTask(task);
            np = new NetPrinter(print_data[i].printer);
        }
        if (np) {
            np.printTasks(tasks, function (tasks, err, msg) {
                if (err) {
                    error(res, -1, msg);
                } else {
                    //todo
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(JSON.stringify(tasks.getList()[0].toJson()));
                }
            })
        } else {

        }
    } catch (e) {
        console.log(e);
    }
}

function cmd(req, res, chunk) {
    console.log("-----cmd------");
    var print_data = _getData(req, res, chunk);
    if (!print_data) {
        return;
    }
    //执行批量打印
    for (var i = 0; i < print_data.length && i < 1; i++) {
        //添加返回列表
    }
}

function printerstatus(req, res, chunk) {
    console.log("-----printerstatus------");
    try {
        var print_data = _getData(req, res, chunk);
        if (!print_data) {
            return;
        }
        for (var i = 0; i < print_data.length && i < 1; i++) {
            var np = new NetPrinter(print_data[i].printer);
            if (np) {
                np.status(function (status, msg, d) {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    var data = {
                        'status': status,
                        'msg': msg,
                        'res': d
                    };
                    res.end(JSON.stringify(data));
                })
            }
        }
    } catch (e) {
        console.log(e);
    }
}

//http请求响应
var app = require('http').createServer(function (req, res) {
    //var objectUrl = url.parse(req.url);
    //var objectQuery = querystring.parse(objectUrl.query);
    //console.log("query:->" + objectQuery);
    var pathname = url.parse(req.url).pathname;
    //var realPath = path.join("assets", pathname);
    //console.log("objectUrl:->" + objectUrl);
    console.log("pathname:->" + pathname);
    console.log("URL:->" + req.url);
    // console.log("pathname:->" + pathname);
    var chunk = '';
    req.on('data', function (data) {
        chunk += data;
        console.log("onData->" + chunk);
    });

    req.on('end', function () {
        try {
            if (pathname === "/" || pathname === "/info") {
                info(req, res);
            } else if (pathname === "/status") {
                status(req, res);
            } else if (pathname === "/version" || pathname === '/v') {
                version(req, res);
            } else if (pathname === "/print" && chunk) {
                print(req, res, chunk);
            } else if (pathname === "/cmd" && chunk) {
                cmd(req, res, chunk);
            } else if (pathname === "/printerstatus" && chunk) {
                printerstatus(req, res, chunk);
            } else {
                error(res, 0, "action unkonw or no data to print");
            }
        } catch (e) {
            error(res, 0, "未知的错误" + e.toString());
        }
    });
});


var os = require('os'),
    iptable = {},
    ifaces = os.networkInterfaces();

for (var dev in ifaces) {
    ifaces[dev].forEach(function (details, alias) {
        if ((details.family == 'IPv4') && (details.internal == false)) {
            //iptable[dev+(alias?':'+alias:'')]=details.address;
            iptable['localIP'] = details.address;
        }
    });
}

var port = process.env.PORT || 9200;
var host = "127.0.0.1";

if (iptable.localIP) {
    host = iptable.localIP;
}
app.listen(port, function () {
    console.log('打印服务器已经启动:' + host + ":" + port);
    console.log('配置->IP:' + host + " 端口:" + port);
    console.log('您也可以在浏览器中打开 http://' + host + ":" + port + "查看服务状态信息!");
    if (iptable.localIP) {
        console.log("您的局域网地址是:" + iptable.localIP);
    }
});

//throw "ERROR";