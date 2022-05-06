<template>
  <el-container>
    <el-aside width="600px">
      <AsideOpggData/>
    </el-aside>
    <el-container>
      <el-header>
        <el-input v-model="heroName" :suffix-icon="Search" clearable placeholder="搜索" style="width: 120px;"></el-input>
        <el-divider direction="vertical"/>
        <el-radio-group v-model="position">
          <el-radio-button label="">全部</el-radio-button>
          <template v-for="item in heroPosition">
            <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
          </template>
        </el-radio-group>
        <!--        <el-button :type="sameVersion ? 'success' : 'warning'" @click="checkVersion">-->
        <!--          <el-icon>-->
        <!--            <check v-if="sameVersion"/>-->
        <!--            <circle-close-filled v-else/>-->
        <!--          </el-icon>-->
        <!--          &nbsp;&nbsp;换肤版本-->
        <!--        </el-button>-->
      </el-header>
      <el-main>
        <MainLoLData :data="selectHeroData"/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script name="LOL" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-12 18:58
 */
import store from '@/store'
import AsideOpggData from '@/components/game/lol/AsideOpggData';
import {Search} from "@element-plus/icons";
import {heroPosition} from '@/data/game'
import {getHeroData, qqHeroPosition} from '@/api/game-mod/lol/lol-qq';
import {stringIsNotBlank} from '@/utils/blankUtils.ts';
import {createARoomType, getSkinName, openSkin} from '@/utils/game/lol/lolUtils';
import {ElMessageBox} from "element-plus";
import {openLoLConnection, setCallback} from "@/utils/game/lol/riotGames";


const windowSize = computed(() => {
  return store.state.app.windowSize
})
// 搜索英雄名
const heroName = ref('')

// 英雄位置
const position = ref('')
// 版本
const version = ref('')
// 版本标志 flag
const sameVersion = ref(false)
let LeagueClienTimer = null

// 查询英雄
const selectHeroData = computed(() => {
  return store.state.app.lol.heroData.filter(item => {
    return item.keywords.indexOf(heroName.value) > -1 && item.positionStr.indexOf(position.value) > -1
  })
})

/**
 * 英雄位置解析
 * @param data 药解析的数据
 */
function analysisOfTheHeroBranch(data) {
  let index = 0;
  data.positionStr = ''
  if (data.position !== null) {
    for (let key in data.position) {
      let keyStr = key
      if (keyStr === 'bottom') {
        keyStr = 'adc'
      }
      data.positionStr += index === 0 ? keyStr : '，' + keyStr
      index++
    }
  }
}

const {shell} = require('electron');

/**
 * 查询版本是否对应
 */
const checkVersion = () => {
  let nationalServiceVersion = 'LOLPRO ' + version.value + '.1.exe'
  if (nationalServiceVersion === getSkinName()
  ) {
    sameVersion.value = true
  } else {
    ElMessageBox.confirm('当前版本不一致,请及时更新。', '提示', {
      type: 'warning',
      confirmButtonText: '前往下载',
      cancelButtonText: '取消'
    }).then(() => {
      shell.openExternal('http://leagueskin.net/p/download-mod-skin-2020-chn');
    }).catch((e) => {
    })
    sameVersion.value = false
  }
}

/**
 * 获取国服的英雄数据
 */
const nationalServiceData = () => {
  qqHeroPosition().then((res) => {
    // 获取英雄位置，转成 json 对象
    let newString = JSON.parse(res.toString().split("=")[1].split(";")[0])
    // 判断状态
    if (newString.status === '0') {
      // 获取英雄数据
      getHeroData().then((res) => {
        version.value = res.version
        res.hero.forEach(item => {
          // 根据英雄 id 来获取位置
          if (stringIsNotBlank(item.heroId)) {
            item.position = newString.list[item.heroId]
            // 拼接位置
            analysisOfTheHeroBranch(item)
            // 存放数据
            store.commit('app/pushHeroData', item)
          }
        })
        checkVersion()
      })
    }
  })
}

const openSkinsAccordingToHeroes = () => {
  // 监听 /lol-loadouts/v4/loadouts/scope/champion/
  // 这个 api 这个只有点击锁定英雄才会触发 但是会跟着一个 英雄id所以要用到 indexOf
  // 还有 /lol-champ-select/v1/session 这个也可以获取到你选中的 英雄但是太麻烦了，就没有用
  setCallback('/lol-loadouts/v4/loadouts/scope/champion/', (data) => {
    let index = data.uri.split("/")
    let championId = index[index.length - 1]
    let heroData = store.state.app.lol.heroData
    for (let i = 0; i < heroData.length; i++) {
      // 循环根据 英雄id来获取英雄名
      if (heroData[i].heroId.toString() === championId.toString()) {
        // 通过英雄名字来开启
        openSkin(heroData[i].alias)
        heroName.value = heroData[i].alias
        return
      }
    }
  })
}


onMounted(() => {
  nationalServiceData()
  createARoomType()
})

onActivated(() => {
  openLoLConnection(true)
  openSkinsAccordingToHeroes()
})


</script>

<style lang="scss" scoped>
.image {
  width: 66px;
  height: 65px;
}

.tab {
  display: flex;
  border: 1px solid #e9eff4;
  flex: 1;
  border-radius: 4px;
  overflow: hidden;

  div {
    text-align: center;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    flex: 1;
  }

  div:hover {
    background: #3894FF;
    color: white;
  }
}

.active {
  background: #3894FF;
  color: white;
}

.unselected {
  border-right: 1px solid #e9eff4;
  background: #ffffff;
}

.heroTable span {
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;

  a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }


  strong {
    font-weight: normal;
    color: #4a4a4a;
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  small {
    line-height: 15px;
    font-size: 12px;
    color: #b6b6b6;
    margin-top: 2px;
  }
}

</style>
