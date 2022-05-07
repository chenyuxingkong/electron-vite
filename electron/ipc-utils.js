const {ipcMain, app} = require('electron');
const {autoUpdate} = require("./electron-auto-updater");
const path = require('path');

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
}

