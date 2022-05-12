/**
 * <p>
 * 描述：本系统需要使用的数据
 * </p>
 * @author xc
 * @date 2022-03-22 15:22
 */
const state = () => ({
    // 窗口大小
    windowSize: {
        width: 0,
        height: 0,
    },
    lol: {
        heroData: [],
        currentHero: {}
    },
})

const mutations = {
    setWindowSize(state, val) {
        state.windowSize = val
    },
    pushHeroData(state, val) {
        state.lol.heroData.push(val)
    },
    setCurrentHero(state, val) {
        console.log(val)
        state.lol.currentHero = val
    }
}

export default {
    // 开启命名空间
    namespaced: true,
    state,
    mutations,
}

