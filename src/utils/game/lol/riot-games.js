import axios from "axios";
import {ElMessage} from "element-plus";
import {BizException, ExceptionEnum} from "@/utils/exception/BizException.ts";
import router from "@/router";
import store from "@/store"
import {stringIsBlank} from "@/utils/blank-utils.ts";
// 没有这个 websocket 就连接不上 允许 未经授权
const WebSocket = require('ws');


const {exec} = require("child_process");
//用于解决中文输出乱码
const iconv = require('iconv-lite');
// lol 启动参数
const getGameLaunchInfo = 'WMIC PROCESS WHERE name="LeagueClientUx.exe" GET commandline';
//用于检测游戏是否运行
const getRunStatusCMD = 'wmic process get name | find "LeagueClientUx.exe"';

//端口
let port;
//用户名,默认riot
let username = 'riot';
//密码
let password;
//协议,一般是https
let protocol = 'https';
// 保存的回调函数
let globalCallback = new Map();
// 重试连接
let retryConnection = true
// lolWebSocket
let ws = null;

export function setCallback(path, callback) {
    if (callback !== null) {
        globalCallback[path] = callback
    }
}

export function openLoLConnection(val) {
    if (val) retryConnection = true
    try {
        // 不是lol页面就不要连接了
        if (retryConnection) {
            exec(getRunStatusCMD, {encoding: 'buffer'}, async function (err, stdout, stderr) {
                // 获取命令行执行的输出并解析
                const stdoutStr = iconv.decode(stdout, 'cp936');
                const arr = stdoutStr.split("\r\r\n");
                let newArr = arr.filter(i => i && i.trim()).filter(i => i.trim()); //过滤为空的字符串
                const lolAppName = newArr[0]; //获取到了进程名则说明游戏正在运行
                if (typeof (lolAppName) != 'undefined' && lolAppName.trim() !== '') { //这里需要利用短路功能
                    //游戏启动了,进行下一步获取游戏路径
                    if (ws === null) {
                        await lolWebSocket()
                    }
                } else {
                    // 退出页面后 就不在尝试连接
                    setTimeout(() => {
                        openLoLConnection()
                    }, 2000)
                }
            });
        }
    } catch (err) {
        console.log(err)
        return false;
    }
}

/**
 * 连接 lol 的 WebSocket
 * https://hextechdocs.dev/getting-started-with-the-lcu-websocket/
 * 官网有介绍，
 * 这个的方法借鉴了，下面这个地址
 * https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15
 */
export async function lolWebSocket() {
    // 保证只能有一个在重试连接
    let flag = true
    await getPortAndPassword()
    const url = `wss://riot:${password}@127.0.0.1:${port}/`
    ws = new WebSocket(url)
    // 打开连接
    ws.onopen = function () {
        ElMessage.success('连接成功')
        flag = true
        // 连接成功后 订阅客户端发出的数据
        ws.send('[5, "OnJsonApiEvent"]')
        // 发送请求判断现在是什么房间
        callLOLApi('get', '/lol-gameflow/v1/session').then((data) => {
            currentRoom(data)
        })


    }

    // 获取发送的消息
    ws.onmessage = function (e) {
        try {
            // 转成json会报错因为有些不是json
            let json = JSON.parse(e.data)
            // 第三个 参数才是 真正的数据
            const res = json.slice(2)[0]
            // 判断 消息要发送到哪里
            if (globalCallback.hasOwnProperty(res.uri)) {
                globalCallback[res.uri](res)
                return;
            }
            // 如果想要 开启 模糊查询就打开这个
            for (let key in globalCallback) {
                if (res.uri.indexOf(key) > -1) {
                    globalCallback[key](res)
                    return
                }
            }
            globalCallback['message'](res)
        } catch (e) {
        }
    }
    // 发生了错误要重新连接
    ws.onerror = function (e) {
        if (flag) {
            openLoLConnection()
            flag = false
        }
        console.error(e)
    }
    // 客户端关闭了也要重新连接
    ws.onclose = function () {
        if (flag) {
            openLoLConnection()
            flag = false
        }
    }
}

// 只有在退出lol页面时 才不重新连接
export function closeLoLWebSocket() {
    retryConnection = false
    try {
        if (ws !== null) {
            ws.close()
            ws = null
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 *  用于替代解析Lockfile文件的方法来获取端口号和密码， *  原理：通过获取游戏启动参数来获取信息
 *  https://hextechdocs.dev/getting-started-with-the-lcu-api/
 *  lol 官网有说明
 * @returns {Promise<unknown>}
 */
function getPortAndPassword() {
    return new Promise(resolve => {
        try {
            // 解析 lol 的账号密码
            exec(getGameLaunchInfo, {encoding: 'buffer'}, function (err, stdout, stderr) {
                const stdoutStr = iconv.decode(stdout, 'cp936');
                // 通过正则表达式解析游戏启动参数
                // 获取游戏的端口
                let protReg = new RegExp('--app-port=([0-9]*)');
                // 获取 token 也就是密码
                let authTokenReg = new RegExp('--remoting-auth-token=([\\w-]*)');

                try {
                    port = stdoutStr.match(protReg)[1];
                } catch (e) {
                    throw new BizException(ExceptionEnum.LOGICAL_ERROR, "请使用管理员权限打开改页面。")
                }
                password = stdoutStr.match(authTokenReg)[1];
                console.log('port: ' + port);
                console.log('auth-token: ' + password);

                const authStr = Buffer.from(username + ':' + password);
                console.log('authStr:' + 'Basic ' + authStr.toString('base64'));
                resolve(true);
            })
        } catch (err) {
            console.log('游戏未启动，无法获取游戏启动参数！');
            console.log(err);
            resolve(false);
        }
    })
}

/**
 * 调用 lol 的 api
 * @param method 请求方法
 * @param route 路由
 * @returns {Promise<unknown>}
 */
export function callLOLApi(method, route) {
    return new Promise(async resolve => {
        try {
            if (stringIsBlank(password)) {
                await getPortAndPassword()
            }
            // 密码是需要变成 base64 不然无法调用
            const authStr = Buffer.from(username + ':' + password);
            axios({
                method: method,
                url: protocol + '://127.0.0.1:' + port + route,
                headers: {'Authorization': 'Basic ' + authStr.toString('base64')},
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                const result = err.response;
                resolve(result);
            })
        } catch (err) {
            resolve(false);
        }
    })
}

export function currentRoom(val) {
    if (store.state.config.riotConfig.automaticJump) {
        // ARAM 大乱斗
        if (val.phase === 'Lobby') {
            if (val.map.gameMode === 'TFT') {
                router.push('/youxi/riot/tft')
            } else {
                router.push('/youxi/riot/lol')
            }
        }
    }
}


