import store from '../../../store'

const fs = require('fs')
const {ipcRenderer} = require('electron')

export function initLocalStorageData(name, data, commit) {
    let appPath = ipcRenderer.sendSync('app-path') + '\\'
    let stringify = JSON.stringify(data)
    let filerName = appPath + name
    if (fs.existsSync(filerName)) {
        // 读取配置文件的数据
        const config = fs.readFileSync(filerName, {encoding: "utf-8"})
        // 配置文件的数据覆盖原来的数据
        Object.assign(data, JSON.parse(config))
        store.commit(commit, data)
    } else {
        writeFileRecursive(appPath, stringify, filerName)
        store.commit(commit, data)
    }
    return data
}

export function setLocalStoregeData(name, data, commit) {
    let appPath = ipcRenderer.sendSync('app-path') + '\\'
    let filerName = appPath + name
    fs.writeFileSync(filerName, JSON.stringify(data))
    store.commit(commit, data)
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


