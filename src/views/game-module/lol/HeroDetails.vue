<template>
  <el-container>
    <el-header>
      <el-radio-group v-model="position">
        <template v-for="item in positionList">
          <el-radio-button :label="item">
            {{ heroPositionChinese(item) }}
          </el-radio-button>
        </template>
      </el-radio-group>
    </el-header>
    <el-container>
      <el-aside width="120px">
        天赋
      </el-aside>
      <el-main>
        主体
      </el-main>
    </el-container>
  </el-container>
</template>

<script name="HeroDetails" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-06 15:16
 */
import router from "@/router";
import {listIsBlank, stringIsBlank} from "@/utils/blank-utils.ts";
import {ElMessageBox} from "element-plus";
import {heroPositionChinese} from "@/utils/game/lol/lol-utils";
import {callLOLApi} from "@/utils/game/lol/riot-games";

const cheerio = require('cheerio')
const {ipcRenderer} = require('electron')

let OPGG_URL_PREFIX = 'https://www.op.gg/champions'
let LOL_CN_PREFIX = 'https://101.qq.com/#/hero-detail?'

const props = defineProps({
  data: {}
})
const emit = defineEmits(['close'])

const data = ref('')
const positionList = ref([])
const position = ref('')
const roomType = ref('')

const parseHeroData = async () => {
  data.value = '{"heroId":"3","name":"正义巨像","alias":"Galio","title":"加里奥","roles":["tank","mage"],"isWeekFree":"0","attack":"1","defense":"10","magic":"6","difficulty":"5","selectAudio":"https://game.gtimg.cn/images/lol/act/img/vo/choose/3.ogg","banAudio":"https://game.gtimg.cn/images/lol/act/img/vo/ban/3.ogg","isARAMweekfree":"0","ispermanentweekfree":"0","changeLabel":"无改动","goldPrice":"3150","couponPrice":"2000","camp":"","campId":"","keywords":"正义巨像,加里奥,Galio,jla,zyjx,zhengyijuxiang,jialiao","position":{"mid":"252","support":"78"},"positionStr":"mid，support"}'
  // router.currentRoute.value.params.data
  if (stringIsBlank(data.value)) {
    ElMessageBox.alert('请先选择英雄', '提示', {
      type: 'error'
    }).then(() => {
      router.push('/lol')
    }).catch(() => {
      router.push('/lol')
    })
  }
  // 获取当前房间的类型是大乱斗还是峡谷
  roomType.value = await getRoomType()
  data.value = JSON.parse(data.value)
  positionList.value = data.value.positionStr.split('，')
  position.value = positionList.value[0]
  let opggUrl = `${OPGG_URL_PREFIX}/${data.value.alias}`
  let qqUrl = `${LOL_CN_PREFIX}heroid=${data.value.heroId}&datatype=${roomType.value}`
  // 打开opgg的页面
  // await openBrowserPage(opggUrl)
  // 打开 lol 官网页面
  // await openBrowserPage(qqUrl)
  await crawlRunes(data.value, qqUrl)
}

// 爬取国服 lol 官网的符文数据
const crawlRunes = async (data, url) => {
  if (listIsBlank(positionList.value)) {
    ElMessageBox.alert('缺少改英雄的数据无法配置符文。', '提示', {
      type: 'warning'
    }).then(() => {
    })
  } else {
    console.log(roomType.value)
    // const htmlData = await crawlRunesApi(data.heroId, roomType.value, position.value, 'rune')

    let url = `https://101.qq.com/#/hero-detail?heroid=${data.heroId}&datatype=${roomType.value}&lane=${position.value}&tab=rune`
    ipcRenderer.sendSync('http', url)
  }
}

const getRoomType = async () => {
  let data = await callLOLApi('get', '/lol-gameflow/v1/session')
  // 峡谷
  if (data.map.gameMode === "CLASSIC") {
    return "5v5"
    // 大乱斗
  } else if (data.map.gameMode === "ARAM") {
    return "fight"
  }
  return "5v5"
}

onActivated(() => {
  parseHeroData()
})


</script>

<style lang="scss" scoped>
:deep(.el-header) {
  padding: 0;
}

</style>
