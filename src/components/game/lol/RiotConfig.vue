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
import {lolConfigData, setRiotConfig} from "../../../store/modules/local-store/riot-config";
import store from '../../../store'

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
  setRiotConfig(lolConfigData.value)
  emit('close')
}

onMounted(() => {
  lolConfigData.value = store.state.config.riotConfig
})


</script>

<style scoped>

</style>
