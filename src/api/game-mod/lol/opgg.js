import request from "../../../utils/public/request";


export function getOpggHtml(position) {
    return request({
        url: 'https://www.op.gg/champions',
        method: 'get',
        headers: {'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'},
        params: {position}
    })
}

export function heroDetailsApi(url) {
    return request({
        url: url,
        method: 'get',
        headers: {'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'},
    })
}
