import {getOpggHtml} from "../../../api/game-mod/lol/opgg";

const cheerio = require('cheerio');

/**
 * <p>
 * 描述： 爬取opgg的数据并且解析
 * </p>
 * @author xc
 * @date 2022-04-28 18:09
 */

export async function getOpggData(val) {
    let response = {
        version: '',
        data: []
    }
    await getOpggHtml(val).then(res => {
        const $ = cheerio.load(res)
        response.version = $('.css-coswxu em').text()
        const tr = $('.positionRank tbody tr')
        for (let i = 0; i < tr.length; i++) {
            let heroInfo = {
                name: '',
                position: '',
                winRate: '',
                appearanceRate: '',
                hierarchy: '',
                img: '',
            }
            let td = tr[i]
            $(td).find('td').each((i, elem) => {
                if (i === 1) {
                    let getName = $(elem).find("a span")
                    heroInfo.name = $(getName).find('strong').text()
                    heroInfo.position = $(getName).find('small').text()
                    heroInfo.img = $(elem).find('img')[0].attribs.src
                } else if (i === 2) {
                    heroInfo.winRate = $(elem).text()
                } else if (i === 3) {
                    heroInfo.appearanceRate = $(elem).text()
                } else if (i === 4) {
                    heroInfo.hierarchy = $(elem).text()
                }
                // console.log(heroInfo);
            })
            response.data.push(heroInfo)
        }
    })
    return response
}

