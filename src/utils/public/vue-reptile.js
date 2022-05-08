import {stringIsBlank} from "./blank-utils.ts";
import {BizException, ExceptionEnum} from "../exception/BizException.ts";

const {ipcRenderer} = require('electron')

/**
 * 解决 vue 开发的网站 爬取数据
 * @param url 爬取地址
 * @param elemName 要爬取的元素信息
 * @returns {any} 返回 静态页面
 */
export function vueReptile(url, elemName) {
    let data = {
        url: url,
        elemName: elemName
    }
    let returnValue = ipcRenderer.sendSync('vue-reptile', data)
    if (stringIsBlank(returnValue)) {
        throw new BizException(ExceptionEnum.MESSAGE_ERROR, '获取不到数据');
    }
    return returnValue;
}
