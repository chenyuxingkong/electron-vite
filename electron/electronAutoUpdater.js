const {autoUpdater} = require("electron-updater");
const {error, info} = require('./logger')

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
        info("下载监听", progressObj)
    })
    // 下载完成
    autoUpdater.on('update-downloaded', () => {
        info("下载完成")
    })
    // // 执行更新检查
    // ipcMain.handle('check-update', () => {
    //     autoUpdater.checkForUpdates().catch(err => {
    //         error('网络连接问题', err)
    //     })
    // })
    // // 退出并安装
    // ipcMain.handle('confirm-update', () => {
    //     autoUpdater.quitAndInstall()
    // })
    // // 手动下载更新文件
    // ipcMain.handle('confirm-downloadUpdate', () => {
    //     autoUpdater.downloadUpdate().then(r => {
    //     })
    // })

}
