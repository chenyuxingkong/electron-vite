import {setLocalStoregeData} from "../public/persistent";

let PATH = 'riotData'
/**
 * <p>
 * 描述：本系统需要使用的数据
 * </p>
 * @author xc
 * @date 2022-03-22 15:22
 */
const state = () => ({
    riotConfig: {
        autoSkin: true,
        automaticJump: true,
        getHeroesAutomatically: true,
        autoChangeRune: true
    },
    runeList: {}
})

const mutations = {
    setRiotConfig(state, val) {
        state.riotConfig = val
        setLocalStoregeData(PATH, 'riotConfig', val)
    },
    setRuneList(state, val) {
        state.runeList = val
        setLocalStoregeData(PATH, 'runeList', val)
    }
}

export default {
    // 开启命名空间
    namespaced: true,
    state,
    mutations,
}

