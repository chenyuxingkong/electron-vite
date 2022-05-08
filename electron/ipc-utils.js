const {ipcMain, app, BrowserWindow} = require('electron');
const {autoUpdate} = require("./electron-auto-updater");

exports.ipcUtils = function (isDev, mainWindow) {
    // 获取版本号
    ipcMain.on('get-app-version', function (event, args) {
        event.returnValue = app.getVersion()
    })
    //更新
    ipcMain.on('check-for-updates', function (event, args) {
        if (!isDev) {
            // 只有在正式环境中才更新
            autoUpdate(mainWindow)
        }
    })
    // 最小化 window
    ipcMain.on('mini-window', function (event, args) {
        mainWindow.minimize()
    })
    // 关闭 app
    ipcMain.on('app-close', function (event, args) {
        mainWindow.close()
    })

    ipcMain.on('app-path', function (event, args) {
        event.returnValue = app.getPath('appData') + '\\cy-zs\\Data'
    })

    /**
     * 解决 vue 发开的网站页面爬取
     */
    ipcMain.on('vue-reptile', function (event, args) {
        // 计数 10 次就不在爬取了
        let a = 0;
        const win = new BrowserWindow({width: 800, height: 600, show: false});
        win.loadURL(args.url);
        win.webContents.on('dom-ready', function () {
            let interval = setInterval(() => {
                win.webContents.executeJavaScript(`
                document.body.innerHTML
            `).then((result) => {
                    // 判断是否出现指定元素
                    if (result.indexOf(args.elemName) > -1) {
                        event.returnValue = result
                        clearInterval(interval)
                        win.close()
                    } else if (a === 10) {
                        event.returnValue = ""
                        clearInterval(interval)
                        win.close()
                    }
                    a++
                })
            }, 500)
        })
        // win.webContents.toggleDevTools()
    })
}
