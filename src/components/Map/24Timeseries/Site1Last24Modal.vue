<template>
  <modal width="1200"
         v-model="site1_last24_modal"
         :title=title
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row>
      <el-col :span="12">
        <div id="taAvgChartSite1" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rhAvgChartSite1" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="wsWvc1ChartSite1" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="paAvgChartSite1" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../../../util/drawCharts.js"

  export default {
    name: "Site1Last24Modal",
    data() {
      return {
        title:"",
        site1_last24_modal: false,
        taAvgChartSite1: null,
        rhAvgChartSite1: null,
        wsWvc1ChartSite1: null,
        paAvgChartSite1: null,
        siteId: null,
      }
    },
    methods: {
      openSite1Last24Modal() {
        this.site1_last24_modal = true;
        this.siteId = 1;
        this.title = "桂山牛头岛气象站最近24小时数据时间序列图";
        this.taAvgChartSite1 = this.$echarts.init(document.getElementById('taAvgChartSite1'));
        this.rhAvgChartSite1 = this.$echarts.init(document.getElementById('rhAvgChartSite1'));
        this.wsWvc1ChartSite1 = this.$echarts.init(document.getElementById('wsWvc1ChartSite1'));
        this.paAvgChartSite1 = this.$echarts.init(document.getElementById('paAvgChartSite1'));

        this.taAvgChartSite1.clear();
        this.rhAvgChartSite1.clear();
        this.wsWvc1ChartSite1.clear();
        this.paAvgChartSite1.clear();

        //请求最近24小时数据并绘图
        this.querySite1Last24Data();
      },
      querySite1Last24Data() {
        var api = `/api/SZTDService/querySiteLast24.action`;
        this.$axios.get(api, {
          params: {
            id: this.siteId,
          }
        }).then((response) => {
          drawCharts.drawSiteTaAvg(response.data, this.taAvgChartSite1);
          drawCharts.drawSiteRhAvg(response.data, this.rhAvgChartSite1);
          drawCharts.drawSiteWsWvc1(response.data, this.wsWvc1ChartSite1);
          drawCharts.drawSitePaAvg(response.data, this.paAvgChartSite1);
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
