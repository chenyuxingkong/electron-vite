/**
 * <p>
 * 描述：把需要使用的一些放到本地缓存
 * </p>
 * @author xc
 * @date 2022-03-22 15:40
 */
import {clone} from "../../../utils/public/clone";

const fs = require('fs')
const {ipcRenderer} = require('electron')

export default function Presistent({modules, modulesKeys}) {
    return (store) => {
        if (modulesKeys.local.length > 0) {
            for (let item of modulesKeys.local) {
                Object.keys(store.state[item]).forEach((c) => {
                    initLocalStorageData(item, c, clone(store.state[item][c]), store)
                })
            }
        }

    }
}

function initLocalStorageData(path, name, data, store) {
    let appPath = ipcRenderer.sendSync('app-path') + '\\' + path
    let filerName = appPath + '\\' + name + '.json'
    if (fs.existsSync(filerName)) {
        // 读取配置文件的数据
        const config = JSON.parse(fs.readFileSync(filerName, {encoding: "utf-8"}))
        // 配置文件的数据覆盖原来的数据
        Object.assign(data, config)
        let storeName = 'set' + name[0].toUpperCase() + name.substr(1)
        store.commit(`${path}/${storeName}`, data)
    } else {
        writeFileRecursive(appPath, JSON.stringify(data), filerName)
    }
}

export function setLocalStoregeData(path, name, data) {
    let appPath = ipcRenderer.sendSync('app-path') + '\\' + path
    let filerName = appPath + '\\' + name + '.json'
    fs.writeFileSync(filerName, JSON.stringify(data))
}

const writeFileRecursive = (path, data, filerName) => {
    let pathList = path.split("\\")
    let tempPath = ''
    for (let i = 0; i < pathList.length; i++) {
        tempPath += pathList[i] + '\\'
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath)
        }
    }
    fs.writeFileSync(filerName, data)
}
