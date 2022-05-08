const {ipcMain, app, BrowserWindow} = require('electron');
const {autoUpdate} = require("./electron-auto-updater");
const cheerio = require('cheerio')

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

    ipcMain.on('http', function (event, args) {
        console.log(args.elemName)
        let a = 0;
        var win = new BrowserWindow({width: 800, height: 600, show: true});
        win.loadURL(args.url);
        // setTimeout(() => {
        //     console.log(document.body.innerHTML)
        //     document.body.innerHTML
        // }, 2000)
        win.webContents.on('dom-ready', function () {
            let interval = setInterval(() => {
                win.webContents.executeJavaScript(`
                console.log('触发')
                console.log(document.body)
                document.body.innerHTML
            `).then((result) => {
                    const $ = cheerio.load(result)
                    console.log($(args.elemName));
                    if (a === 3) {
                        clearInterval(interval)
                    }
                    a++
                })
            }, 2000)
        })
        win.webContents.toggleDevTools()
    })
}


function test(win) {

}
