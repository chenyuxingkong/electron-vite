import {getOpggHtml} from "../../../api/game-mod/lol/opgg";
import {getFileName} from "../../fileUtils";

const cheerio = require('cheerio');

/**
 * <p>
 * 描述： 爬取opgg的数据并且解析,这里是老版本的数据
 * </p>
 * @author xc
 * @date 2022-04-28 18:09
 */
export async function getOpggDataOldHtml(val) {
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
                    let img = getFileName($(elem).find('img')[0].attribs.src).split("/")
                    heroInfo.img = img[img.length - 1]
                } else if (i === 2) {
                    heroInfo.winRate = $(elem).text()
                } else if (i === 3) {
                    heroInfo.appearanceRate = $(elem).text()
                } else if (i === 4) {
                    heroInfo.hierarchy = $(elem).text()
                }
            })
            response.data.push(heroInfo)
        }
    })
    return response
}

export async function getOpggDataNewHtml(val) {
    let response = {
        version: '',
        data: []
    }
    await getOpggHtml(val).then(res => {
        const $ = cheerio.load(res)
        response.version = $('.css-ee3hyw').find('span').text()
        const tr = $('main table tbody tr')
        for (let i = 0; i < tr.length; i++) {
            let heroInfo = {
                name: '',
                position: '',
                winRate: '',
                appearanceRate: '',
                hierarchy: '',
                img: '',
                riseInRank: 0,
                banRate: '',
                weakAgainst: [],
            }
            let td = tr[i]
            $(td).find('td').each((i, elem) => {
                switch (i) {
                    case 0:
                        heroInfo.riseInRank = $($(elem).find('span')[1]).text()
                        break;
                    case 1:
                        const a = $(elem).find('a')
                        let img = getFileName($(a).find('img')[0].attribs.src).split('/')
                        heroInfo.img = img[img.length - 1]
                        heroInfo.name = $(a).find('strong').text()
                        break;
                    case 2:
                        heroInfo.hierarchy = $(elem).text()
                        break;
                    case 3:
                        heroInfo.winRate = $(elem).text()
                        break;
                    case 4:
                        heroInfo.appearanceRate = $(elem).text()
                        break;
                    case 5:
                        heroInfo.banRate = $(elem).text()
                        break;
                    case 6:
                        $(elem).find('div').each((i, div) => {
                            let img = getFileName($(div).find('img')[0].attribs.src).split('/')
                            heroInfo.weakAgainst.push(img[img.length - 1])
                        })
                        break;
                }
            })
            response.data.push(heroInfo)
        }
    })
    return response
}



