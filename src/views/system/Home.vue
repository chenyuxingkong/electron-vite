<template>
  <el-container>
    当前版本:{{ appVersion }}
  </el-container>
</template>

<script name="Home" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-04-12 22:17
 */
import {ref} from "vue";

const {ipcRenderer} = require('electron')

const appVersion = ref('')

onMounted(() => {
  let data = {
    url: 'https://101.qq.com/#/hero-detail?heroid=1&datatype=5v5&tab=rune&lane=mid',
    elemName: 'rune-container'
  }
  console.log(ipcRenderer.sendSync('http', data));
  appVersion.value = ipcRenderer.sendSync('get-app-version')
})
</script>

<style scoped>

</style>
