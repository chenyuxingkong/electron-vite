const fs = require('fs')

export function getLocalStorageData(name, data) {
    let path = 'CY-ZS\\Data\\' + name + '.json'
    let stringify = JSON.stringify(data)
    if (fs.existsSync(path)) {

    } else {
        writeFileRecursive(path, stringify)
    }

    return stringify
}

const writeFileRecursive = function (path, data) {
    let pathList = path.split("\\")
    let mkdirPath = 'C:\\'
    pathList.forEach(item => {
        mkdirPath += item + "\\"
        console.log(mkdirPath)
    })
    // console.log(path)
}


