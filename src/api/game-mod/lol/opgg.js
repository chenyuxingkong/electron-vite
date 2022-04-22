import request from "../../../utils/request";


export function getOpggWinRate(position) {
    return request({
        url: '/opgg/getOpggWinRate',
        method: 'get',
        params: {position}
    })
}


