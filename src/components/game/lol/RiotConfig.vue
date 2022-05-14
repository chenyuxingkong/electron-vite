<template>
  <el-dialog v-model="dialog" :close-on-click-modal="false" draggable title="英雄联盟设置" width="380px"
             @closed="emit('close')">
    <el-form :model="lolConfigData"
             label-position="right"
             label-width="100px">
      <el-row>
        <el-form-item label="自动换肤" prop="autoSkin">
          <el-col>
            <el-switch
                v-model="lolConfigData.autoSkin"
                active-color="#13ce66"
                active-text="开启"
                inactive-color="#ff4949"
                inactive-text="关闭"
            />
          </el-col>
        </el-form-item>
        <el-col>
          <el-form-item label="自动跳转" prop="automaticJump">
            <el-switch
                v-model="lolConfigData.automaticJump"
                active-color="#13ce66"
                active-text="开启"
                inactive-color="#ff4949"
                inactive-text="关闭"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="自动打开英雄" prop="getHeroesAutomatically">
            <el-switch
                v-model="lolConfigData.getHeroesAutomatically"
                active-color="#13ce66"
                active-text="开启"
                inactive-color="#ff4949"
                inactive-text="关闭"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script name="RiotConfig" setup>
import store from '../../../store'
import {clone} from "@/utils/public/clone";

/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-07 20:37
 */
const emit = defineEmits(['close'])
const dialog = ref(true)

const confirm = () => {
  store.commit('riotData/setRiotConfig', lolConfigData.value)
  emit('close')
}

const lolConfigData = ref({})

onMounted(() => {
  lolConfigData.value = clone(store.state.riotData.riotConfig)
})


</script>

<style scoped>

</style>
