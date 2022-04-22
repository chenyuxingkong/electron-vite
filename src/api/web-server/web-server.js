import request from "../../utils/request";

export function isRun() {
    return request({
        url: '/isRun',
        method: 'get',
    })
}
