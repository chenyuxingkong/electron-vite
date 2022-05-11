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
      <el-button @click="text">测试</el-button>
    </el-header>
    <el-main>
      <webview :src="qqUrl" style="  height:630px"></webview>
    </el-main>
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
import {stringIsBlank} from "@/utils/public/blank-utils.ts";
import {ElMessageBox} from "element-plus";
import {heroPositionChinese} from "@/utils/game/lol/lol-utils";
import {callLOLApi} from "@/utils/game/lol/riot-games";
import {getRuneList} from "@/api/game-mod/lol/lol-qq";
import {BizException, ExceptionEnum} from "../../../utils/exception/BizException.ts";
import {vueReptile} from "../../../utils/public/vue-reptile";
import {setCallback} from "../../../utils/game/lol/riot-games";

const cheerio = require('cheerio')

let OPGG_URL_PREFIX = 'https://www.op.gg/champions'
let LOL_CN_PREFIX = 'https://101.qq.com/#/hero-detail?'

const data = ref('')
const positionList = ref([])
const position = ref('')
const roomType = ref('')
const runeList = ref('')

const qqUrl = ref('')


const heroRune = ref([])

const parseHeroData = async () => {
  data.value = router.currentRoute.value.params.data
  data.value = '{"heroId":"3","name":"正义巨像","alias":"Galio","title":"加里奥",' +
      '"roles":["tank","mage"],"isWeekFree":"0","attack":"1","defense":"10",' +
      '"magic":"6","difficulty":"5",' +
      '"selectAudio":"https://game.gtimg.cn/images/lol/act/img/vo/choose/3.ogg",' +
      '"banAudio":"https://game.gtimg.cn/images/lol/act/img/vo/ban/3.ogg",' +
      '"isARAMweekfree":"0","ispermanentweekfree":"0",' +
      '"changeLabel":"无改动","goldPrice":"3150","couponPrice":"2000",' +
      '"camp":"","campId":"","keywords":"正义巨像,加里奥,Galio,jla,zyjx,' +
      'zhengyijuxiang,jialiao","position":{"mid":"252","support":"78"},' +
      '"positionStr":"mid，support"}'
  if (stringIsBlank(data.value)) {
    ElMessageBox.alert('请先选择英雄', '提示', {
      type: 'error'
    }).then(() => {
      router.push('/riot/lol')
    }).catch(() => {
      router.push('/riot/lol')
    })
  }
  // 获取当前房间的类型是大乱斗还是峡谷
  roomType.value = await getRoomType()
  data.value = JSON.parse(data.value)
  positionList.value = data.value.positionStr.split('，')
  position.value = positionList.value[0]
  let opggUrl = `${OPGG_URL_PREFIX}/${data.value.alias}`
  qqUrl.value = `${LOL_CN_PREFIX}heroid=${data.value.heroId}&datatype=${roomType.value}`
  // 打开opgg的页面
  // await openBrowserPage(opggUrl)
  // 打开 lol 官网页面
  // await openBrowserPage(qqUrl)
  // await crawlRunes(qqUrl.value, data.value)
}

// 爬取国服 lol 官网的符文数据
const crawlRunes = (url, data) => {
  if (stringIsBlank(position.value)) {
    throw new BizException(ExceptionEnum.MESSAGE_ERROR, "没有该英雄的数据");
  }
  url += `&tab=rune&lane=${position.value}`
  let html = vueReptile(url, 'rune-container')
  // console.log(html)
  const $ = cheerio.load(html)
  let runeData = []


  $('.rune-container').find('.rune-item').each((i, elem) => {
    $(elem).children('div').each((i1, el) => {
      console.log($(el).find('div div').text());
    })
    console.log($(elem).children('div div'))
  })
}

const getRoomType = async () => {
  let data = await callLOLApi('get', '/lol-gameflow/v1/session')
  try {
    // 峡谷
    if (data.map.gameMode === "CLASSIC") {
      return "5v5"
      // 大乱斗
    } else if (data.map.gameMode === "ARAM") {
      return "fight"
    }
  } catch (e) {
  }
  return "5v5"
}

/**
 * 每个人的符文页是有上限的 所以需要删了重新插入
 * @returns {Promise<void>}
 */
const text = async () => {
  const te = {
    "autoModifiedSelections": [],
    "current": true,
    "id": 2069068589,
    "isActive": false,
    "isDeletable": true,
    "isEditable": true,
    "isValid": true,
    "lastModified": Date.now(),
    "name": "测试4",
    "order": 0,
    "primaryStyleId": 8000,
    "selectedPerkIds": [
      8005,
      9101,
      9104,
      8014,
      8126,
      8136,
      5008,
      5008,
      5001
    ],
    "subStyleId": 8100
  }

  const list = await callLOLApi('get', '/lol-perks/v1/pages')
  const current = list.find((i) => i.current && i.isDeletable);
  if (typeof current === 'undefined') {
    return
  }
  if (current.id) {
    console.log(await callLOLApi('delete', `/lol-perks/v1/pages/${current.id}`));
  }
  let gaibian = await callLOLApi('post', `/lol-perks/v1/pages`, te)
  console.log(await callLOLApi('get', '/lol-perks/v1/pages'));
  console.log(gaibian)

}

onActivated(async () => {
  runeList.value = await getRuneList()
  // console.log(runeList.value.rune)
  await parseHeroData()
  setCallback('message', function (data) {
    // console.log(data)
  })
})


</script>

<style lang="scss" scoped>
:deep(.el-header) {
  padding: 0;
}

</style>
