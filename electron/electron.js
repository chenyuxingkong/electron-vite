// electron/electron.js
const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const {autoUpdate} = require("./electronAutoUpdater");
const {info, error} = require('./logger')
const {autoUpdater} = require("electron-updater");

const isDev = process.env.IS_DEV === "true";
// 关闭 electron 的警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow = null;

function createWindow() {
    // 打开win窗口
    mainWindow = new BrowserWindow({
        width: isDev ? 1800 : 1280,
        height: 720, frame: false, //取消window自带的关闭最小化等
        resizable: false,//禁止改变主窗口尺寸
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            allowRunningInsecureContent: true, // 如果想要 axios 可以跨域就开启 这个和下面的，这两个会有警告
            webSecurity: false,
            // webviewTag: true, // 启用 <webview> tag 标签
        },
        title: 'CY-助手工具',
        show: true,
        icon: path.join(__dirname, 'favicon.ico'),
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    ).then(r => {
    });
    // 打开开发工具。
    if (isDev) {
        mainWindow.webContents.openDevTools({mode: 'right'});
    }

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('get-app-version', app.getVersion())
        info("发送版本号", app.getVersion())
    })
}

ipcMain.on('check-for-updates', function (event, args) {
    if (!isDev) {
        // 只有在正式环境中才更新
        getUpdater()
    }
})

ipcMain.on("minWindow", function (event, args) {
    mainWindow.minimize()
})

ipcMain.on("quitApp", function (event, args) {
    mainWindow.close()
})


// 此方法将在 Electron 完成时调用
// 初始化并准备好创建浏览器窗口。
// 某些 API 只能在此事件发生后才能使用。
app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icons is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// 关闭所有窗口后退出，macOS 除外。那里，很常见
// 让应用程序及其菜单栏保持活动状态，直到用户退出
// 用 Cmd + Q 明确表示。
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})


function getUpdater() {
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
        mainWindow.webContents.send('updater-message', arg)
        info("发现可更新数据", event)
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
