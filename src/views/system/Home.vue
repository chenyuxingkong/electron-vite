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
  appVersion.value = ipcRenderer.sendSync('get-app-version')
})
</script>

<style scoped>

</style>
