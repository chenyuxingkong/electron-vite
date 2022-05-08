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
  let a = ipcRenderer.sendSync('http', 'https://101.qq.com/#/hero-detail?heroid=1&datatype=5v5&tab=rune&lane=mid')
  appVersion.value = ipcRenderer.sendSync('get-app-version')
})
</script>

<style scoped>

</style>
