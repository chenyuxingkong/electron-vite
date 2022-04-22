import request from "../../utils/request";


export function serverQuit() {
    return request({
        url: '/system/serverQuit',
        method: 'get'
    })
}
