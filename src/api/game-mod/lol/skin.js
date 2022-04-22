import request from '@/utils/request'

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-18 18:36
 */
let url = '/lolSkin'

export function getTheNewVersionOfTheSkin() {
    return request({
        url: url + '/getTheNewVersionOfTheSkin',
        method: 'get',
    })
}


export function openSkin(name) {
    return request({
        url: url + '/openSkin',
        method: 'get',
        params: {name}
    })
}

