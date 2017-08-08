var gui = require('nw.gui');
var appUrl = "";//gui.App.manifest.appUrl;
var newWin = null,
    currentWin = gui.Window.get(),
    isConnected = true,
    reloadTimer = null,
    isLoadWindowOpen = false,
    lastNetState = false;


gui.App.clearCache(); // 清除缓存
//让加载页窗口跳转到newWin后台打开的项目首页（可直接复用缓存到浏览器中的项目首页资源）
function loadContentInCurrentWindow(currentWin, appUrl) {
    console.log(appUrl);
    currentWin.window.location.href = appUrl;
}

function reloadAppRes() {
    if (!isLoadWindowOpen) {
        gui.Window.open(appUrl, {
            "show": false
        }, function (win) {
            newWin = win;
            newWin.once('loaded', function () {
                newWin.close(true);
                loadContentInCurrentWindow(currentWin, appUrl);
            });
            isLoadWindowOpen = true;
        });
    } else {
        newWin.window.location.href = appUrl;
    }
}

function startLoadApp() {
    console.log("load main page");
    reloadAppRes();
}


isConnected = navigator.onLine;


var checkNetStatus = function () {
    isConnected = navigator.onLine;
    checkConnetionUpdateText();
    if (isConnected) {
        startLoadApp();
    }
};

window.addEventListener('online', checkNetStatus);
window.addEventListener('offline', checkNetStatus);

reloadTimer = setInterval(function () {
    if (isConnected) {
        startLoadApp();
    }
}, 20 * 1000);


function reload() {
    clearInterval(reloadTimer);
    //让加载中显示一下
    setTimeout(function () {
        checkNetStatus();
    }, 500);

    reloadTimer = setInterval(function () {
        if (isConnected) {
            startLoadApp();
        }
    }, 10 * 1000);
}

window.addEventListener('message', function (event) {
    appUrl = event.data
    console.log("appurl:" + appUrl);
    checkNetStatus();
}, false);


function Request(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var rs = window.location.search.substr(1).match(reg);
    if (rs != null) return unescape(rs[2]); return null;
}
var url = Request("url");
if (url) {
    appUrl = url;
    console.log("appurl:" + appUrl);
    checkNetStatus();
}

