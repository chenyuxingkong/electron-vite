// electron/electron.js
const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');


const isDev = process.env.IS_DEV === "true";
// 关闭 electron 的警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow = null;

function createWindow() {
    // 打开win窗口
    mainWindow = new BrowserWindow({
        width: isDev ? 1800 : 1280,
        height: 720,
        frame: false, //取消window自带的关闭最小化等
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
}

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






