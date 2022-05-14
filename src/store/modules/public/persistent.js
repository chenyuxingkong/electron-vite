/**
 * <p>
 * 描述：把需要使用的一些放到本地缓存
 * </p>
 * @author xc
 * @date 2022-03-22 15:40
 */
import {initLocalStorageData} from "@/store/modules/public/local-store";

export default function Presistent({modules, modulesKeys}) {
    return (store) => {
        if (modulesKeys.local.length > 0) {
            for (let item of modulesKeys.local) {
                Object.keys(store.state[item]).forEach((c) => {
                    let name = 'set' + c[0].toUpperCase() + c.substr(1)
                    try {
                        initLocalStorageData(item, c, close(store.state[item][c]))
                    } catch (e) {
                        console.log(e)
                    }

                    //         console.log(data)
                    //         // store.commit(`${item}/${name}`, data)
                })
            }
        }

    }
}
