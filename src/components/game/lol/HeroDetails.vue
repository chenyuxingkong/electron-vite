<template>
  <el-dialog
      v-model="dialog"
      :close-on-click-modal="false"
      :title="data.name"
      draggable
      @closed="emit('close')">
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
  </el-dialog>
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
import {listIsNotBlanK, stringIsBlank} from "@/utils/blank-utils.ts";
import {ElMessageBox} from "element-plus";
import {heroPositionChinese} from "../../../utils/game/lol/lolUtils";
import {heroDetailsApi} from "../../../api/game-mod/lol/opgg";

const props = defineProps({
  data: {}
})
const emit = defineEmits(['close'])

const dialog = ref(true)
const data = ref('')
const positionList = ref([])
const position = ref('')
const cheerio = require('cheerio')

const parseHeroData = () => {
  data.value = '{"heroId":"1","name":"黑暗之女","alias":"Annie","title":"安妮","roles":["mage"],"isWeekFree":"0","attack":"2","defense":"3","magic":"10","difficulty":"6","selectAudio":"https://game.gtimg.cn/images/lol/act/img/vo/choose/1.ogg","banAudio":"https://game.gtimg.cn/images/lol/act/img/vo/ban/1.ogg","isARAMweekfree":"0","ispermanentweekfree":"0","changeLabel":"无改动","goldPrice":"4800","couponPrice":"2000","camp":"","campId":"","keywords":"安妮,黑暗之女,火女,Annie,anni,heianzhinv,huonv,an,hazn,hn","position":{"mid":"104","adc":"12"},"positionStr":"mid，adc"}'
  // router.currentRoute.value.params.data
  if (stringIsBlank(data.value)) {
    ElMessageBox.alert('请先选择英雄', '提示', {
      type: 'error'
    }).then(() => {
      router.push('/lol')
    }).catch(() => {
      router.push('/lol')
    })
  } else {
    data.value = JSON.parse(data.value)
  }
  positionList.value = data.value.positionStr.split('，')
  let url = ''
  if (listIsNotBlanK(positionList.value)) {
    position.value = positionList.value[0]
    url = `https://www.op.gg/champions/${data.value.alias}/${position.value}/`
  } else {
    url = `https://www.op.gg/champions/${data.value.alias}`
  }
  // 打开opgg的页面
  // openBrowserPage(url + 'build')
  // 放弃使用爬虫 因为有些搞不到
  // analyticalTalent(url)
}

const asideData = ref([])

const analyticalTalent = (url) => {
  heroDetailsApi(url + 'runes').then((res) => {
    let $ = cheerio.load(res)
    let liList = $('aside').find('ul li')
    for (let i = 0; i < liList.length; i++) {
      if (i === liList.length - 1) {
        return
      }
      let cornerstone = {
        img: [],
        fieldNumber: '',
        mainTalentWinRate: '',
        secondaryWinRate: '',
      }
      let data = liList[i]
      $(data).find('div').each((i, divs) => {
        if (i === 0) {
          $(divs).find('img').each((i1, imgs) => {
            let img = {
              alt: $(imgs)[0].attribs.alt,
              src: $(imgs)[0].attribs.src
            }
            cornerstone.img.push(img)
          })
        } else if (i === 1) {
          $(divs).find('span').each((i2, spans) => {
            if (i2 === 0) {
              let quantity = $(spans).text().split('%')
              cornerstone.mainTalentWinRate = quantity[0] + '%'
              cornerstone.fieldNumber = quantity[1]
            } else if (i2 === 1) {
              cornerstone.secondaryWinRate = $(spans).text()
            }
          })
        }
      })
      asideData.value.push(cornerstone)
    }
  })
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
