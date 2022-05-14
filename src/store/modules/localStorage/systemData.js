/**
 * <p>
 * 描述：本系统需要使用的数据
 * </p>
 * @author xc
 * @date 2022-03-22 15:22
 */
const state = () => ({
    config: {
        autoStart: true
    }
})

const mutations = {
    setConfig(state, val) {
        state.autoStart = val
    }
}

export default {
    // 开启命名空间
    namespaced: true,
    state,
    mutations,
}

