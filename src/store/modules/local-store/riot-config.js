import {initLocalStorageData, setLocalStoregeData} from "../public/local-store";

let FILDER_NAME = 'RiotConfig.json'
let COMMIT = 'config/setRoitConfig'

export const lolConfigData = ref({
    autoSkin: true,
    automaticJump: true,
    getHeroesAutomatically: true
})

// 初始化配置文件
export function initRoitConfig() {
    initLocalStorageData(FILDER_NAME, lolConfigData.value, COMMIT)
}

export function setRiotConfig(val) {
    setLocalStoregeData(FILDER_NAME, val, COMMIT)
}
