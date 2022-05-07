import {getLocalStorageData} from "@/store/modules/public/local-store";

const fs = require('fs')
const lolConfigData = {
    autoSkin: true,
    automaticJump: true,
}

export function getLolConfig() {
    console.log(getLocalStorageData('lolConfig', lolConfigData));
}
