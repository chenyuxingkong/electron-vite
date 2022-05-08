import request from '@/utils/public/request'

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

// https://101.qq.com/#/hero-detail?heroid=3&datatype=5v5&tab=rune&lane=mid
export function crawlRunesApi(heroid) {
    let url = `https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${heroid}.js?ts=${Date.now() / 600000 >> 0}`
    return request({
        url: url,
        method: 'get',
    })
}

export function getRuneList() {
    return request({
        url: 'https://game.gtimg.cn/images/lol/act/img/js/runeList/rune_list.js',
        method: 'get',
    })
}


