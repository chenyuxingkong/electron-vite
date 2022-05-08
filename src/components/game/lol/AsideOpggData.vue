<template>
  <el-main>
    <el-tag type="success"> 当前版本：{{ version }}</el-tag>
    <el-tag type="warning"> 数据来源 opgg</el-tag>
    <div class="tab">
      <template v-for="item in heroPosition">
        <div :class="item.value === winningPosition ? 'active' : 'unselected' "
             @click="clickToCheckTheWinningRate(item.value)">
          {{ item.label }}
        </div>
      </template>
    </div>
    <el-table v-loading="loading" :data="heroWinRateRanking"
              :default-sort="{prop:'hierarchy',order:'ascending '}" :height="windowSize.h - 100"
              class="heroTable">
      <el-table-column width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
          <el-button v-if="scope.row.riseInRank > 0" :icon="CaretTop" style="color: green" type="text">
            {{ scope.row.riseInRank }}
          </el-button>
          <el-button v-else-if="scope.row.riseInRank < 0" :icon="CaretBottom" style="color: red" type="text">
            {{ Math.abs(scope.row.riseInRank) }}
          </el-button>
          <i v-else>= 0</i>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="50">
        <template #default="scope">
          <img :alt="scope.row.name" :src="nationalCostumeAvatar(scope.row.img)" style="height: 32px;width: 32px"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" show-overflow-tooltip width="80">
        <template #default="scope">
            <span>
              <strong> {{ scope.row.name }}</strong>
              <small>{{ scope.row.position }}</small>
             </span>
        </template>
      </el-table-column>
      <el-table-column label="胜率" prop="winRate" sortable width="70"></el-table-column>
      <el-table-column label="出场率" prop="appearanceRate" sortable width="80"></el-table-column>
      <el-table-column label="禁用率" prop="banRate" sortable width="80"></el-table-column>
      <el-table-column label="层级" prop="hierarchy" sortable width="70"></el-table-column>
      <el-table-column label="weakAgainst" prop="weakAgainst" width="120">
        <template #default="scope">
          <template v-for="item in scope.row.weakAgainst">
            <img :alt="item" :src="nationalCostumeAvatar(item)" style="height: 32px;width: 32px"/>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script name="AsideOpggData" setup>
import {heroPosition} from "@/data/game";
import store from "@/store";
import {getOpggDataNewHtml, getOpggDataOldHtml} from "@/utils/game/lol/opgg-utiks";
import {stringIsNotBlank} from "@/utils/public/blank-utils.ts";
import {CaretTop, CaretBottom} from "@element-plus/icons";

/**
 * <p>
 * 描述：英雄联盟，模块中的 opgg 胜率数据
 * </p>
 * @author xc
 * @date 2022-04-20 10:06
 */
const windowSize = computed(() => {
  return store.state.app.windowSize
})

const loading = ref(true)

// 英雄胜率数据
const heroWinRateRanking = ref([])
// 胜率位置
const winningPosition = ref('top')
// 版本
const version = ref('')

// 获取英雄胜率
const getHeroWinRateEvent = () => {
  loading.value = true
  heroWinRateRanking.value = []
  getOpggDataNewHtml(winningPosition.value).then(async (res) => {
    if (res.data.length === 0) {
      await getOpggDataOldHtml(winningPosition.value).then((oldRes) => {
        res = oldRes
      })
    }
    updateData(res)
  })
}

const updateData = (res) => {
  version.value = res.version
  heroWinRateRanking.value = res.data
  setTimeout(() => {
    loading.value = false
  }, 200)
}

// 点击位置查询
const clickToCheckTheWinningRate = (val) => {
  winningPosition.value = val
  getHeroWinRateEvent()
}

// 获取国服头像
const nationalCostumeAvatar = (val) => {
  return `https://game.gtimg.cn/images/lol/act/img/champion/${val}.png`
}

const rankingInformation = (val) => {
  if (stringIsNotBlank(val)) {
    if (val > 0) {
      return `<i style="color: green">${val}</i>`
    }
  }
}

onMounted(() => {
  getHeroWinRateEvent()
})
</script>

<style lang="scss" scoped>
.heroTable span {
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;

  a {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    white-space: nowrap;
    overflow: hidden;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

}

strong {
  font-weight: normal;
  color: #4a4a4a;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}

small {
  line-height: 15px;
  font-size: 12px;
  color: #b6b6b6;
  margin-top: 2px;
}

.tab {
  display: flex;
  border: 1px solid #e9eff4;
  flex: 1;
  border-radius: 4px;
  overflow: hidden;

  div {
    text-align: center;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    flex: 1;
  }

  div:hover {
    background: #3894FF;
    color: white;
  }

}

.active {
  background: #3894FF;
  color: white;
}

.unselected {
  border-right: 1px solid #e9eff4;
  background: #ffffff;
}

</style>
