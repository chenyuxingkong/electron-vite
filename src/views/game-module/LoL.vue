<template>
  <el-container>
    <el-aside width="400px">
      <AsideOpggData/>
    </el-aside>
    <el-container>
      <el-header>
        <el-input v-model="heroName" :suffix-icon="Search" clearable placeholder="搜索" style="width: 120px;"></el-input>
        <el-divider direction="vertical"/>
        <el-radio-group v-model="position">
          <el-radio label="">全部</el-radio>
          <template v-for="item in heroPosition">
            <el-radio :label="item.value">{{ item.label }}</el-radio>
          </template>
        </el-radio-group>
        <el-divider direction="vertical"/>
        <el-button :type="sameVersion ? 'success' : 'warning'" @click="checkVersion">
          <el-icon>
            <check v-if="sameVersion"/>
            <circle-close-filled v-else/>
          </el-icon>
          &nbsp;&nbsp;换肤版本
        </el-button>
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
import store from '../../store'
import {getHeroData} from "@/api/game-mod/lol/lol-qq";
import AsideOpggData from "@/components/game/lol/AsideOpggData";
import MainLoLData from "@/components/game/lol/MainLoLData";
import {Search} from "@element-plus/icons";
import {heroPosition} from '@/data/game'
import {getTheNewVersionOfTheSkin} from "@/api/game-mod/lol/skin";
import {ElMessage} from "element-plus";


const windowSize = computed(() => {
  return store.state.app.windowSize
})
// 搜索英雄名
const heroName = ref('')
// 英雄数据
const heroData = ref([])
// 英雄位置
const position = ref('')

const sameVersion = ref(false)

const selectHeroData = computed(() => {
  return heroData.value.filter(item => {
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

const checkVersion = () => {
  getTheNewVersionOfTheSkin().then(res => {
    sameVersion.value = true
    ElMessage({
      message: `当前版本与国服一致<br>换肤版本:${res.skinVersion}<br>国服版本:${res.version}`,
      type: 'success',
      duration: 4000,
      showClose: true,
      dangerouslyUseHTMLString: true
    })
  }).catch((e) => {
    sameVersion.value = false
  })
}


onMounted(() => {
  getHeroData().then((res) => {
    console.log(res)
    res.data.forEach(item => {
      analysisOfTheHeroBranch(item)
    })
    heroData.value = res.data
  })
})

onActivated(() => {
  checkVersion()
})


</script>

<style lang="scss" scoped>
.image {
  width: 66px;
  height: 65px;
}


.imgtextlist {
  float: left;
  padding: 30px 0 0;
  position: relative;
  overflow-x: hidden;

  li {
    float: left;
    width: 90px;
    height: 100px;
    margin-bottom: 22px;
    text-align: center;
    line-height: 15px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
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
