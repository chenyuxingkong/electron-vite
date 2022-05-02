const {autoUpdater} = require("electron-updater");
const {error, info} = require('./logger')
const {ipcMain, dialog} = require('electron');


exports.autoUpdate = function (mainWindow) {
    // 这个先设置为 false 不然就直接下载了
    autoUpdater.autoDownload = false
    info("进入更新方法")

    autoUpdater.checkForUpdates().then(r => {
        info("检查更新")
    })
    // 当更新发生错误的时候触发。
    autoUpdater.on('error', (err) => {
        error('发送了错误', err)
        mainWindow.webContents.send('update-err')
    })
    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', (event, arg) => {
        info("开始更新了", arg)
        info("更新事件", event)
    })
    // 发现可更新数据时
    autoUpdater.on('update-available', (event, arg) => {
        mainWindow.webContents.send('updater-message', event)
        info("发现可更新数据", event, arg)
    })
    // 没有可更新数据时
    autoUpdater.on('update-not-available', (event, arg) => {
        info("没有可更新数据", arg)
        info("没有可更新数据", event)
    })
    // 下载监听
    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('app-download-progress', progressObj)
    })
    // 下载完成
    autoUpdater.on('update-downloaded', () => {
        info("下载完成")
        const dialogOpts = {
            type: 'info',
            buttons: ['重启', '之后'],
            title: '应用程序更新完成',
            detail: '已下载新版本,重新启动应用程序以更新应用.'
        }
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) {
                autoUpdater.quitAndInstall()
            }
        })
    })
    //
    ipcMain.on('confirm-download-update', function (event, args) {
        info("点击了确认更新")
        autoUpdater.downloadUpdate().then(r => {
            console.info(r)
        })
    })
}
