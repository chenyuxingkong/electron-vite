import request from "../../../utils/request";


export function getOpggWinRate(position) {
    return request({
        url: 'https://www.op.gg/_next/data/kkZie6baquw8sNDbJM8b8/champions.json',
        method: 'get',
        headers: {'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'},
        params: {position}
    })
}


