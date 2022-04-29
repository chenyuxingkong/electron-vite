<template>
  <el-container>
    当前版本:{{ appVersion }}
  </el-container>
</template>

<script lang="ts" name="Home" setup>
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

ipcRenderer.on('get-app-version', function (event, args) {
  console.log(event, args)
  appVersion.value = args
})

</script>

<style scoped>

</style>
