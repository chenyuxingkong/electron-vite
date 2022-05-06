<template>
  <el-container>

  </el-container>
</template>

<script name="HeroDetails" setup>/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-06 15:16
 */
import router from "@/router";
import {listIsNotBlanK, stringIsBlank} from "@/utils/blank-utils.ts";
import {ElMessageBox} from "element-plus";

const data = ref('')
const positionList = ref([])

const parseHeroData = () => {
  data.value = '{"heroId":"1","name":"黑暗之女","alias":"Annie","title":"安妮","roles":["mage"],"isWeekFree":"0","attack":"2","defense":"3","magic":"10","difficulty":"6","selectAudio":"https://game.gtimg.cn/images/lol/act/img/vo/choose/1.ogg","banAudio":"https://game.gtimg.cn/images/lol/act/img/vo/ban/1.ogg","isARAMweekfree":"0","ispermanentweekfree":"0","changeLabel":"无改动","goldPrice":"4800","couponPrice":"2000","camp":"","campId":"","keywords":"安妮,黑暗之女,火女,Annie,anni,heianzhinv,huonv,an,hazn,hn","position":{"mid":"104"},"positionStr":"mid"}'
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
    console.log(data.value);
  }
  positionList.value = data.value.positionStr.split('，')
  console.log(positionList.value);
  let url = ''
  if (listIsNotBlanK(positionList.value)) {
    url = `https://www.op.gg/champions/${data.value.name}/${positionList.value[0]}/build`
  } else {
    url = `https://www.op.gg/champions/${data.value.name}`
  }



}


onActivated(() => {
  parseHeroData()
})


</script>

<style scoped>

</style>
