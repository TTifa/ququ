//need require('application.js'), do not <script>application.js</script>
//node context

var net = require('net');
var fs = require('fs');

var upd = null, newAppPath = null;
//启动单个实例
var server = null;

exports.mainWindow = null;

exports.backgroundWindow = null;

//首次启动 null:未知  true:首次启动  false:非首次启动
exports.firstStart = null;

exports.dataPath = null;

exports.setMainWindow = function(mainWin) {
    exports.mainWindow = mainWin;
    if (!exports.mainWindow) {
        return;
    }
    exports.mainWindow.on("close", function (quit) {
        if (quit) {
            console.log("close main window");
            this.close(true);
        } else {
            console.log("hide main window");
            this.hide();
        }
    });
}

//显示加载页面， 在新窗口加载url
exports.loadURL = function(win, url) {
  win.once("loaded", function() {
     win.window.postMessage(url, "*");
  });
  return win;  
}

function getLogFilePath() {
  return exports.dataPath + "\\ququ_log.txt";
}

function main() {
    var appName = "ququ";
    if (process.platform === 'darwin') {
        exports.firstStart = true;
        return;
    }

    var socket = (process.platform === 'win32') ?
        '\\\\.\\pipe\\' + appName + '-sock' :
        pipe.join(os.tmpdir(), appName + '.sock');

    var client = net.connect( {path: socket}, function() {
        client.write("reboot", function() {
            client.end();
            process.exit(0);
        });
    }).on('error', function(err) {
        if (process.platform === 'win32') {
            try {
                fs.unlinkSync(socket);
            } catch (e) {
                if (e.code !== 'ENOENT') {
                  var p = getLogFilePath();
                  fs.appendFileSync(p, "unlink error:" + e.code);
                  process.exit(0);
                }
            }
        }

        server = net.createServer(function(connection) {
            connection.on('data', function(data) {
                console.log("reboot");
                if (exports.mainWindow) {
                    exports.mainWindow.show();
                    exports.mainWindow.focus();
                }
            });
        });

        server.on("listening", function() {
            console.log("booted");
            var p = getLogFilePath();
            fs.appendFileSync(p, "booted\n");
            exports.firstStart = true;
        });

        server.on("error", function(e) {
            console.log("listen error:" + e.code);
            var p = getLogFilePath();
            fs.appendFileSync(p, "listen error:" + e.code + "\n");
            process.exit(0);
        });
        var p = getLogFilePath();
        fs.writeFileSync(p, "listen...\n");
        server.listen(socket);
    });
}

exports.main = main;

var hasSaved = {};//是否已经触发过这个错误
process.on("uncaughtException", function (e) {
    var errText = e.stack;
    var fs = require('fs');
    var md5 = require('MD5');
    var key = md5(errText);

    if (hasSaved[key]) {
        return;
    }
    if (window && window.localStorage) {
        var historyError = window.localStorage.getItem('_uncaughtException_' + key);
        if (historyError != null) {
            return;//曾经触发过这个BUG 忽略
        }
    }
    if (errText.match(/dns.js|net.js/) != null) {
        return;//网络原因引起的BUG 忽略
    }

    hasSaved[key] = true;
    if (window && window.localStorage) {
        var historyError = window.localStorage.setItem('_uncaughtException_' + key, errText);
    }
    var nwPath = process.cwd();
    var date = new Date();
    var errText = "\r\n## 日期：" + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() +
        "\r\n##### 客户端版本： V" + process._nw_app.manifest.version +
        "\r\n##### 错误详情： \r\n```javascript\r\n" + errText + "\r\n```\r\n";
    fs.appendFile(nwPath + '/error.log', errText, function (err) {
        if (err) throw err;
    });
});
