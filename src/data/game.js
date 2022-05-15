import yxlm from '../assets/img/yxlm.jpg'

export const gameData = [
    {
        path: '/youxi/riot',
        title: '英雄联盟',
        img: yxlm,
    },
]

export const heroPosition = [
    {label: '上单', value: 'top'},
    {label: '打野', value: 'jungle'},
    {label: '中路', value: 'mid'},
    {label: '下路', value: 'adc'},
    {label: '辅助', value: 'support'},
]

// 'ARAM','URF','CLASSIC'
export const riotGameMod = {
    'ARAM': '极地大乱斗',
    'URF': '无限火力',
    'CLASSIC': '召唤师峡谷',
    'TFT': '云顶之弈',
}

