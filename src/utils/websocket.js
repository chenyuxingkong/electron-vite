const socketUrl = 'ws://localhost:9297/websocket/'

let webSocket = null
let globalCallback = null

let sid = 'cy-zs'
const isDev = process.env.IS_DEV === "true";

let ipcRenderer = require('electron').ipcRenderer;

export function setCallback(callback) {
    // 如果页面中药获取到 socket 的消息那需要先调用这个
    if (callback !== null) {
        globalCallback = callback
        console.log('global callback settled.')
    }
}

export function closeWebSocket() {
    if (webSocket !== null) {
        webSocket.close()
        webSocket = null
    }
}

export function initWebSocket() {
    if ('WebSocket' in window) {
        if (webSocket === null) {
            const url = socketUrl + sid
            webSocket = new WebSocket(url)
        }
    } else {
        alert('该浏览器不支持websocket!')
        webSocket = 'unsupport'
    }

    webSocket.onopen = function () {
        console.log('WebSocket连接成功')
    }

    webSocket.onmessage = function (e) {
        let data = JSON.parse(e.data)
        console.log("接受到的消息", data)

        if (globalCallback !== null) {
            globalCallback(data)
        }
    }

    webSocket.onclose = function () {
        webSocket = null
        setTimeout(() => {
            initWebSocket(sid)
        }, 3000)
    }

    webSocket.onerror = function () {
        console.error('WebSocket连接发生错误')
    }

}
