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
    <el-table ref="tableRef" v-loading="loading" :data="heroWinRateRanking"
              :default-sort="{prop:'hierarchy',order:'ascending '}" :height="windowSize.h - 100"
              class="heroTable">
      <el-table-column type="index" width="40px"></el-table-column>
      <el-table-column label="头像" width="50px">
        <template #default="scope">
          <img :alt="scope.row.name" :src="scope.row.img" style="height: 32px;width: 32px"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name">
        <template #default="scope">
            <span>
              <strong> {{ scope.row.name }}</strong>
              <small>{{ scope.row.position }}</small>
             </span>
        </template>
      </el-table-column>
      <el-table-column label="胜率" prop="winRate" sortable width="70px"></el-table-column>
      <el-table-column label="出场率" prop="appearanceRate" sortable width="80px"></el-table-column>
      <el-table-column label="层级" prop="hierarchy" sortable width="70px"></el-table-column>
    </el-table>
  </el-main>
</template>

<script name="AsideOpggData" setup>
import {heroPosition} from "@/data/game";
import store from "@/store";
import {getOpggData} from "../../../utils/game/lol/opggUtiks";

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
const tableRef = ref(null)

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
  getOpggData(winningPosition.value).then((res) => {
    version.value = res.version
    heroWinRateRanking.value = res.data
    setTimeout(() => {
      loading.value = false
      tableRef.value.$refs.bodyWrapper.scrollTop = 0
    }, 200)
  })
}

// 点击位置查询
const clickToCheckTheWinningRate = (val) => {
  winningPosition.value = val
  getHeroWinRateEvent()
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
