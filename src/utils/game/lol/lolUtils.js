// positionWinRate 胜率 positionPickRate 登场率 positionTier 层级
// positions 位置

import {toPercent} from "@/utils/percentageUtils";
import {ElMessage} from "element-plus";
import {getExtension} from "@/utils/fileUtils";
import {stringIsBlank} from "@/utils/blankUtils.ts";

const fs = require('fs')
const exec = require('child_process').exec


// 获取 opgg 的英雄胜率信息
export function analyzeHeroWinRate(val) {
    let data = []
    val.forEach(item => {
        data.push({
            name: item.name,
            img: replaceAvatar(item.image_url),
            position: getPosition(item.positions),
            winRate: toPercent(item.positionWinRate),
            appearanceRate: toPercent(item.positionPickRate),
            hierarchy: item.positionTier
        })
        // console.log(item)
    })
    // console.log(data)
    return data
}

function replaceAvatar(val) {
    const imgList = val.split("/")
    return "https://game.gtimg.cn/images/lol/act/img/champion/" + imgList[imgList.length - 1]
}

function getPosition(val) {
    let name = ""
    for (let i = 0; i < val.length; i++) {
        name += (i === 0 ? '' : ',') + heroPositionChinese(val[i].name.toLowerCase())
    }
    return name
}

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
    if (!fs.existsSync("C:\\Fraps")) {
        ElMessage.error("LOL SKIN 文件不存在，请先下载")
        return
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
    const addirList = fs.readdirSync('C:\\Fraps')
    for (let i = 0; i < addirList.length; i++) {
        if (getExtension(addirList[i]) === 'exe') {
            if (addirList[i].indexOf("LOLPRO") > -1) {
                return addirList[i]
            }
        }
    }
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

