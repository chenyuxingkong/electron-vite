import request from '@/utils/request'

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-19 10:20
 */

export function getHeroData() {
    return request({
        url: 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js',
        method: 'get',
    })
}

export function qqHeroPosition() {
    return request(({
        url: 'https://lol.qq.com/act/lbp/common/guides/guideschampion_position.js',
        method: 'get'
    }))
}


