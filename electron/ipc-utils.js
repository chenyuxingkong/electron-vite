const {ipcMain, app, BrowserWindow} = require('electron');
const {autoUpdate} = require("./electron-auto-updater");
const {net} = require('electron')

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
        var win = new BrowserWindow({width: 800, height: 600, show: true});

        win.loadURL(args);
        // setTimeout(() => {
        //     console.log(document.body.innerHTML)
        //     document.body.innerHTML
        // }, 2000)

        win.webContents.executeJavaScript(`
            window.onload = function (){
            console.log('渲染完成没有')
            }
        
            `).then((result) => {
            console.log(result)
            event.returnValue = result
        })
        win.webContents.toggleDevTools()
    })
}

