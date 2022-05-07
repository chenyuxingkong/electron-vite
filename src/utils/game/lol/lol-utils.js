// positionWinRate 胜率 positionPickRate 登场率 positionTier 层级
// positions 位置

import {getExtension} from "@/utils/file-utils";
import {stringIsBlank} from "@/utils/blank-utils.ts";
import {BizException, ExceptionEnum} from "@/utils/exception/BizException.ts";

const fs = require('fs')
const exec = require('child_process').exec


// 英雄位置转中文
export const heroPositionChinese = (val) => {
    switch (val) {
        case 'top':
            return '上单';
        case 'jungle':
            return '打野';
        case 'mid':
            return '中路';
        case 'adc':
            return '下路';
        case 'bottom':
            return '下路';
        case 'support':
            return '辅助';
        default:
            return "";
    }
}

// 下面是打开皮肤盒子的
export function openSkin(val) {
    if (stringIsBlank(val)) {
        throw new BizException(ExceptionEnum.MESSAGE_ERROR, '没有找到英雄。')
    }
    changeSetting('C:\\Fraps\\data\\Default\\Config.ini', val)
    changeSetting('C:\\Fraps\\data\\My\\Config.ini', val)
    open()
}

function changeSetting(path, name) {
    // 读取配置文件 并分割字符串
    const config = fs.readFileSync(path, {encoding: "utf-8"}).split("\r\n")
    // 循环判断 在  [TOP_CHAMPION] 下面一个修改要的英雄
    for (let i = 0; i < config.length; i++) {
        if (config[i] === '[TOP_CHAMPION]') {
            config[i + 1] = '0=' + name
        }
    }
    // 字符串用 \r\n 拼接起来
    let newConfig = config.join('\r\n')
    // 写入修改好的数据
    fs.writeFileSync(path, newConfig)
}

export function getSkinName() {
    try {
        const addirList = fs.readdirSync('C:\\Fraps')
        for (let i = 0; i < addirList.length; i++) {
            if (getExtension(addirList[i]) === 'exe') {
                if (addirList[i].indexOf("LOLPRO") > -1) {
                    return addirList[i]
                }
            }
        }
    } catch (e) {
        throw new BizException(ExceptionEnum.MESSAGE_HTML_ERROR, "<span style='color: teal'>LOL SKIN</span> 文件不存在，请先下载")
    }
    return ""
}

function open() {
    let skinName = getSkinName()
    if (stringIsBlank(skinName)) {
        return;
    }
    exec("taskkill /f /im " + "\"" + skinName + "\"", function (error, stdout, stderr) {
        exec("\"C:\\Fraps\\" + skinName + "\"", function (error, stdout, stderr) {
        })
    })
}

