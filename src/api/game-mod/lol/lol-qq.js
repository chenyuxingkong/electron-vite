import request from '@/utils/request'

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-19 10:20
 */
let url = '/lol/qq'

export function getHeroData() {
    return request({
        url: url + '/getHeroData',
        method: 'get',
    })
}

export function post() {
    return request({
        url: url + '/',
        method: 'post',
        data
    })
}
