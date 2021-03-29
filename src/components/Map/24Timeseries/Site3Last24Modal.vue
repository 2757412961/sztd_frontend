<template>
  <modal width="1200"
         v-model="site3_last24_modal"
         :title=title
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row>
      <el-col :span="12">
        <div id="taAvgChartSite3" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rhAvgChartSite3" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="wsWvc1ChartSite3" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="paAvgChartSite3" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rainChartSite3" :style="{width: '580px', height: '230px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../../../util/drawCharts"

  export default {
    name: "Site3Last24Modal",
    data() {
      return {
        title: "",
        site3_last24_modal: false,
        taAvgChartSite3: null,
        rhAvgChartSite3: null,
        wsWvc1ChartSite3: null,
        paAvgChartSite3: null,
        rainChartSite3: null,
        siteId: null,
      }
    },
    methods: {
      openSite3Last24Modal() {
        this.site3_last24_modal = true;
        this.siteId = 3;
        this.title = "龙穴船厂气象站最近24小时数据时间序列图";

        this.taAvgChartSite3 = this.$echarts.init(document.getElementById('taAvgChartSite3'));
        this.rhAvgChartSite3 = this.$echarts.init(document.getElementById('rhAvgChartSite3'));
        this.wsWvc1ChartSite3 = this.$echarts.init(document.getElementById('wsWvc1ChartSite3'));
        this.paAvgChartSite3 = this.$echarts.init(document.getElementById('paAvgChartSite3'));
        this.rainChartSite3 = this.$echarts.init(document.getElementById('rainChartSite3'));

        this.taAvgChartSite3.clear();
        this.rhAvgChartSite3.clear();
        this.wsWvc1ChartSite3.clear();
        this.paAvgChartSite3.clear();
        this.rainChartSite3.clear();

        //请求最近24小时数据并绘图
        this.querySite3Last24Data();
      },

      querySite3Last24Data() {
        var api = `/api/SZTDService/querySiteLast24.action`;
        this.$axios.get(api, {
          params: {
            id: this.siteId,
          }
        }).then((response) => {
          drawCharts.drawSiteTaAvg(response.data, this.taAvgChartSite3);
          drawCharts.drawSiteRhAvg(response.data, this.rhAvgChartSite3);
          drawCharts.drawSiteWsWvc1(response.data, this.wsWvc1ChartSite3);
          drawCharts.drawSitePaAvg(response.data, this.paAvgChartSite3);
          drawCharts.drawSiteRain(response.data, this.rainChartSite3);
        }).catch((response) => {
          //失败回调
          this.$confirm('服务器失联！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }).finally((response) => {

        })
      }

    },


  }
</script>

<style scoped>

</style>
