<template>
  <modal width="1200"
         v-model="site2_last24_modal"
         :title=title
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row>
      <el-col :span="12">
        <div id="taAvgChartSite2" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rhAvgChartSite2" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="wsWvc1ChartSite2" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="paAvgChartSite2" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rainChartSite2" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../../../util/drawCharts.js"

  export default {
    name: "Site2Last24Modal",
    data() {
      return {
        title:"",
        site2_last24_modal: false,
        taAvgChartSite2: null,
        rhAvgChartSite2: null,
        wsWvc1ChartSite2: null,
        paAvgChartSite2: null,
        rainChartSite2: null,
        siteId: null,
      }
    },
    methods: {
      openSite2Last24Modal() {
        this.site2_last24_modal = true;
        this.siteId = 2;
        this.title = "西人工岛气象站最近24小时数据时间序列图";

        this.taAvgChartSite2 = this.$echarts.init(document.getElementById('taAvgChartSite2'));
        this.rhAvgChartSite2 = this.$echarts.init(document.getElementById('rhAvgChartSite2'));
        this.wsWvc1ChartSite2 = this.$echarts.init(document.getElementById('wsWvc1ChartSite2'));
        this.paAvgChartSite2 = this.$echarts.init(document.getElementById('paAvgChartSite2'));
        this.rainChartSite2 = this.$echarts.init(document.getElementById('rainChartSite2'));

        this.taAvgChartSite2.clear();
        this.rhAvgChartSite2.clear();
        this.wsWvc1ChartSite2.clear();
        this.paAvgChartSite2.clear();
        this.rainChartSite2.clear();

        //请求最近24小时数据并绘图
        this.querySite2Last24Data();
      },
      querySite2Last24Data() {
        var api = `/api/SZTDService/querySiteLast24.action`;
        this.$axios.get(api, {
          params: {
            id: this.siteId,
          }
        }).then((response) => {
          drawCharts.drawSiteTaAvg(response.data, this.taAvgChartSite2);
          drawCharts.drawSiteRhAvg(response.data, this.rhAvgChartSite2);
          drawCharts.drawSiteWsWvc1(response.data, this.wsWvc1ChartSite2);
          drawCharts.drawSitePaAvg(response.data, this.paAvgChartSite2);
          drawCharts.drawSiteRain(response.data, this.rainChartSite2);
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
