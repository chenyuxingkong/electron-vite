const fs = require('fs')
const {ipcRenderer} = require('electron')

export function initLocalStorageData(path, name, data) {
    let appPath = ipcRenderer.sendSync('app-path') + '\\' + path
    let filerName = appPath + '\\' + name + '.json'
    if (fs.existsSync(filerName)) {
        // 读取配置文件的数据
        const config = JSON.parse(fs.readFileSync(filerName, {encoding: "utf-8"}))
        // 配置文件的数据覆盖原来的数据
        console.log(config)
        Object.assign(data, config)
        return data
    } else {
        writeFileRecursive(appPath, JSON.stringify(data), filerName)
        return data
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


