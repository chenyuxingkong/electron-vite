<template>
  <el-container>
    <el-dialog v-model="dialog"
               :close-on-click-modal="false"
               title="英雄符文设置"
               width="60%" @closed="emit('close')">
      <div class="hero_info">
        <div>
          <el-avatar :size="50" :src="heroImg(props.currentHero.alias)"/>
        </div>
        <div style="display: grid;margin-left: 10px">
          <strong> {{ props.currentHero.title }} </strong>
          <em>{{ props.currentHero.name }}</em>
        </div>
        <el-divider direction="vertical"></el-divider>
        <el-radio-group v-model="gameMode">
          <el-radio-button label="CLASSIC">召唤师峡谷</el-radio-button>
          <el-radio-button label="ARAM">大乱斗</el-radio-button>
          <el-radio-button label="URF">无限火力</el-radio-button>
        </el-radio-group>
      </div>
      <el-tag type="success">当前符文 : {{ currentRune.name }}</el-tag>
      <div class="rune_box">
        <template v-for="(item,index) in currentRune.selectedPerkIds">
          <el-popover :width="index > 5 ? 20 :300" placement="top">
            <template #reference>
              <el-avatar :src="props.runeData[item].icon"></el-avatar>
            </template>
            <template #default>
              <div v-html="props.runeData[item].longdesc"></div>
            </template>
          </el-popover>
        </template>
        <el-button text type="primary" @click="addRunes">添加</el-button>
      </div>
      <el-tag type="success">已配置符文</el-tag>
      <div v-if="listIsNotBlanK(heroRune[props.currentHero.alias])">
        <div v-for="(fatherItme,fatherIndex) in heroRune[props.currentHero.alias]"
             v-show="fatherItme.gameMode === gameMode"
             style="align-items: center;display: flex;margin-bottom: 10px">
          <el-input v-model="fatherItme.name" style="width: 90px"/>
          <template v-for="(item,childIndex) in fatherItme.selectedPerkIds">
            <el-popover :width="childIndex > 5 ? 20 :300" placement="top">
              <template #reference>
                <el-avatar :src="props.runeData[item].icon" style="margin-left: 10px"></el-avatar>
              </template>
              <template #default>
                <div v-html="props.runeData[item].longdesc"></div>
              </template>
            </el-popover>
          </template>
          <el-button style="margin-left: 20px" text type="primary" @click="useThisRune(fatherIndex)">应用</el-button>
          <el-button text type="danger" @click="deleteRune(fatherIndex)">删除</el-button>
          <el-button :icon="fatherItme.default ?  StarFilled : Star" text
                     @click="favoriteRunes(fatherIndex)"></el-button>
        </div>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="emit('close')">关闭</el-button>
        <el-button type="success" @click="confirm">保存</el-button>
      </span>
      </template>
    </el-dialog>
  </el-container>
</template>
<script name="HeroRuneConfig" setup>
/**
 * <p>
 * 描述：
 * </p>
 * @author xc
 * @date 2022-05-12 20:17
 */
import store from '@/store'
import {clone} from "../../../utils/public/clone";
import {callLOLApi, setCallback, setRune} from "../../../utils/game/lol/riot-games";
import {listIsNotBlanK} from "../../../utils/public/blank-utils.ts";
import {Star, StarFilled} from '@element-plus/icons'

const props = defineProps({
  runeData: {
    type: Object
  },
  currentHero: {
    type: Object
  }
})

const dialog = ref(true)
const emit = defineEmits(['close'])
const heroRune = ref({})
const currentRune = ref({})

const gameMode = ref('CLASSIC')


watch(() => store.state.app.lol.gameMod, () => {
  if (store.state.app.lol.gameMod !== 'TFT') {
    gameMode.value = store.state.app.lol.gameMod
  }
})

const heroImg = (val) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${val}.png`;
}

const addRunes = () => {
  let data = {
    name: currentRune.value.name,
    default: heroRune.value[props.currentHero.alias].findIndex(i => i.default && i.gameMode === gameMode.value) === -1,
    gameMode: gameMode.value,
    selectedPerkIds: currentRune.value.selectedPerkIds
  }
  if (listIsNotBlanK(heroRune.value[props.currentHero.alias])) {
    let lookForDuplicates = heroRune.value[props.currentHero.alias].find((i) => i.gameMode === gameMode.value && JSON.stringify(i.selectedPerkIds) === JSON.stringify(currentRune.value.selectedPerkIds))
    if (typeof lookForDuplicates !== 'undefined') {
      return ElMessage.error('请勿重复添加')
    }
    if (heroRune.value[props.currentHero.alias].length > 14) {
      return ElMessage.error('最多添加15个')
    }
  } else {
    heroRune.value[props.currentHero.alias] = []
  }
  heroRune.value[props.currentHero.alias].push(data)
}

const useThisRune = async (index) => {
  await setRune(props.currentHero.alias, index)
}

const deleteRune = (index) => {
  heroRune.value[props.currentHero.alias].splice(index, 1)
}

const favoriteRunes = (index) => {
  heroRune.value[props.currentHero.alias].forEach(item => {
    if (item.gameMode === gameMode.value) {
      item.default = false
    }
  })
  heroRune.value[props.currentHero.alias][index].default = true
}

const confirm = () => {
  store.commit('riotData/setRuneList', heroRune.value)
  emit('close')
  ElMessage.success('保存成功')
}

onMounted(async () => {
  heroRune.value = clone(store.state.riotData.runeList)
  const list = await callLOLApi('get', '/lol-perks/v1/pages')
  currentRune.value = list.find((i) => i.current && i.isDeletable)
  gameMode.value = store.state.app.lol.gameMod
  setCallback('/lol-perks/v1/pages', function (data) {
    let current = data.data.find((i) => i.current)
    if (typeof current !== 'undefined') {
      currentRune.value = data.data.find((i) => i.current);
    }
  })
})

</script>

<style lang="scss">
.hero_info {
  display: flex;
}

.rune_box {
  display: flex;
  justify-content: space-between;

  div {
    border: 1px solid #000;
    width: 120px;
    line-height: 40px;

    .rune_img {
      width: 100%;
      height: 100%;
    }
  }

  .button {
    width: 40px;
  }
}
</style>
