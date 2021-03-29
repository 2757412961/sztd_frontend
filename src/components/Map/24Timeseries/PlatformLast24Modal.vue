<template>
  <modal width="760"
         v-model="platform_last24_modal"
         title="西人工岛观测站最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row>
      <div id="platformCtdChartDIV" :style="{width: '700px', height: '300px'}"></div>
    </el-row>
    <el-row>
      <div id="platformTideChartDIV" :style="{width: '700px', height: '300px'}"></div>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../../../util/drawCharts.js"

  export default {
    name: "PlatformLast24Modal",
    data() {
      return {
        platform_last24_modal: false,
        platformCtdChart: null,
        platformTideChart: null,
      }
    },
    methods: {
      openPlatformLast24Modal() {
        this.platform_last24_modal = true;

        this.platformCtdChart = this.$echarts.init(document.getElementById('platformCtdChartDIV'));
        this.platformTideChart = this.$echarts.init(document.getElementById('platformTideChartDIV'));
        this.platformCtdChart.clear();
        this.platformTideChart.clear();


        //请求最近24小时数据并绘图
        this.queryLast24Data();
      },
      queryLast24Data() {
        var api = `/api/SZTDService/queryPlatformLast24.action`;
        this.$axios.get(api).then((response) => {
          drawCharts.drawCTDChart(response.data.topCtdList, response.data.bottomCtdList, this.platformCtdChart);
          drawCharts.drawTideChart(response.data.tideList, this.platformTideChart);
        }).catch((response) => {
          //失败回调
          this.$confirm('服务器失联！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }).finally((response) => {

        })

      }
    }
  }
</script>

<style scoped>

</style>
