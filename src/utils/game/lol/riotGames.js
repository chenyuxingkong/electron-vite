import axios from "axios";
import store from '../../../store'
import {openSkin} from "./lolUtils";
import {ElMessage} from "element-plus";

const {exec} = require("child_process");
const iconv = require('iconv-lite'); //用于解决中文输出乱码
const getGameLaunchInfo = 'WMIC PROCESS WHERE name="LeagueClientUx.exe" GET commandline';
const getRunStatusCMD = 'wmic process get name | find "LeagueClientUx.exe"'; //用于检测游戏是否运行

//端口
let port;
//用户名,默认riot
let username = 'riot';
//密码
let password;
//协议,一般是https
let protocol = 'https';

// 开启换肤标志
let openSkinFlag = true
// 开启运行监听
let startRunningSign = true

export function turnOnAutoSkinning() {
    try {
        exec(getRunStatusCMD, {encoding: 'buffer'}, async function (err, stdout, stderr) {
            // 获取命令行执行的输出并解析
            const stdoutStr = iconv.decode(stdout, 'cp936');
            const arr = stdoutStr.split("\r\r\n");
            let newArr = arr.filter(i => i && i.trim()).filter(i => i.trim()); //过滤为空的字符串
            const lolAppName = newArr[0]; //获取到了进程名则说明游戏正在运行
            if (typeof (lolAppName) != 'undefined' && lolAppName.trim() !== '') { //这里需要利用短路功能
                ElMessage.success('游戏已启动')
                startRunningSign = true
                //游戏启动了,进行下一步获取游戏路径
                await clientListening()
            } else {
                if (startRunningSign) {
                    setTimeout(() => {
                        turnOnAutoSkinning()
                    }, 1000)
                }
            }
        });
    } catch (err) {
        console.log(err)
    }
}

export function turnOffClientMonitoring() {
    startRunningSign = false
}

// 开启客户端监听
async function clientListening() {
    await getPortAndPassword()
    await getTheSelectedHero()
}

// 定时器
let turnOnTheTimer = null

async function getTheSelectedHero() {
    if (turnOnTheTimer === null) {
        turnOnTheTimer = setInterval(async () => {
            // 离开了lol页面这个就没有必要要了
            if (startRunningSign) {
                const res = await callLOLApi('PATCH', '/lol-champ-select-legacy/v1/session/my-selection');
                console.log(res)
                if (res.status !== 404) {
                    // analyticalData(res)
                } else {
                    openSkinFlag = true
                }
            } else {
                clearInterval(turnOnTheTimer)
                turnOnTheTimer = null
            }

        }, 1000)
    }
}


/**
 * 根据 gameId 中的 id 去 actions 这个数组的 actorCellId 字段 如果一致那么就是你本人]
 * actions completed 是否选中了
 * championId 英雄 id
 * @param val
 */
function analyticalData(val) {
    console.log(val)
    // 获取全部玩家的信息 不知道为什么是 一个数组里面还有一个数组
    let actions = val.actions[0]
    // 获取你在这个房间的 id
    let gameId = val.gameId
    for (let i = 0; i < actions.length; i++) {
        let data = actions[i]
        // 循环 根据你在这个房间的id来获取你的信息
        if (data.actorCellId === gameId) {
            // 判断你是否选中了
            if (data.completed) {
                let championId = data.championId
                // 获取所有的英雄数据
                let heroData = store.state.app.lol.heroData
                for (let j = 0; j < heroData.length; j++) {
                    // 循环根据 英雄id来获取英雄名
                    if (heroData[j].heroId.toString() === championId.toString()) {
                        // 只能开启一次,开了就不能在开启了.
                        if (openSkinFlag) {
                            openSkinFlag = false
                            openSkin(heroData[j].alias)
                        }
                        return
                    }
                }
            }
            return
        }
    }
}

//用于替代解析Lockfile文件的方法来获取端口号和密码， 原理：通过获取游戏启动参数来获取信息
function getPortAndPassword() {
    return new Promise(resolve => {
        try {
            exec(getGameLaunchInfo, {encoding: 'buffer'}, function (err, stdout, stderr) {
                var stdoutStr = iconv.decode(stdout, 'cp936');
                // 通过正则表达式解析游戏启动参数
                // 获取游戏的端口
                let protReg = new RegExp('--app-port=([0-9]*)');
                // 获取 token
                let authTokenReg = new RegExp('--remoting-auth-token=([\\w-]*)');

                port = stdoutStr.match(protReg)[1];
                password = stdoutStr.match(authTokenReg)[1];
                console.log('port: ' + port);
                console.log('auth-token: ' + password);

                var authStr = Buffer.from(username + ':' + password);
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

//拼接并异步调用lolapi
function callLOLApi(method, route) {
    return new Promise(resolve => {
        try {
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


