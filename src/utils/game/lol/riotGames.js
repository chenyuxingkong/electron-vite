import axios from "axios";
import store from '../../../store'
import {openSkin} from "./lolUtils";
import {ElMessage} from "element-plus";
import router from '../../../router'

const {exec} = require("child_process");
const iconv = require('iconv-lite'); //用于解决中文输出乱码
const getGameLaunchInfo = 'WMIC PROCESS WHERE name="LeagueClientUx.exe" GET commandline';
const getRunStatusCMD = 'wmic process get name | find "LeagueClientUx.exe"'; //用于检测游戏是否运行

let port; //端口
let username; //用户名,默认riot
let password; //密码
let protocol; //协议,一般是https

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
                //游戏启动了,进行下一步获取游戏路径
                await clientListening()
            } else {
                if (router.currentRoute.value.path === '/lol') {
                    setTimeout(() => {
                        console.log("判断启动")
                        turnOnAutoSkinning()
                    }, 1000)
                }
            }
        });
    } catch (err) {
        console.log(err)
    }
}

async function clientListening() {
    await getPortAndPassword()
    await getTheSelectedHero()
}

let turnOnTheTimer = null

async function getTheSelectedHero() {
    // 根据 gameId 中的 id 去 actions 这个数组的 actorCellId 字段 如果一致那么就是你本人
    // actions completed 是否选中了
    // championId 英雄 id
    if (turnOnTheTimer === null) {
        turnOnTheTimer = setInterval(async () => {
            if (router.currentRoute.value.path !== '/lol') {
                clearInterval(turnOnTheTimer)
                turnOnTheTimer = null
            }
            const res = await callLOLApi('get', '/lol-champ-select/v1/session');
            if (res.status !== 404) {
                analyticalData(res)
            } else {
                openSkinFlag = true
            }
        }, 1000)
    }
}

let openSkinFlag = true

function analyticalData(val) {
    let actions = val.actions[0]
    let gameId = val.gameId
    for (let i = 0; i < actions.length; i++) {
        let data = actions[i]
        if (data.actorCellId === gameId) {
            if (data.completed) {
                let championId = data.championId
                let heroData = store.state.app.lol.heroData
                for (let j = 0; j < heroData.length; j++) {
                    if (heroData[j].heroId.toString() === championId.toString()) {
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
                let protReg = new RegExp('--app-port=([0-9]*)');
                let authTokenReg = new RegExp('--remoting-auth-token=([\\w-]*)');

                port = stdoutStr.match(protReg)[1];
                username = 'riot';
                password = stdoutStr.match(authTokenReg)[1];
                protocol = 'https';
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


