import {initLocalStorageData, setLocalStoregeData} from "../public/local-store";

/**
 * <p>
 * 描述：本系统需要使用的数据
 * </p>
 * @author xc
 * @date 2022-03-22 15:22
 */
let FILDER_NAME = 'RiotData.json'

const state = () => ({
    data: {
        config: {
            autoSkin: true,
            automaticJump: true,
            getHeroesAutomatically: true,
        },
        heroRuneList: []
    },
})

const mutations = {
    initRoitData(state) {
        state.data = initLocalStorageData(FILDER_NAME, state.data)
    },
    setRoitData(state, val) {
        setLocalStoregeData(FILDER_NAME, val)
        state.data = val
    }
}

export default {
    // 开启命名空间
    namespaced: true,
    state,
    mutations,
}

