<template>
  <modal width="800"
         v-model="site_last24_modal"
         title="气象站最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="taAvg" :style="{width: '780px', height: '200px'}"></div>
    <div id="rhAvg" :style="{width: '780px', height: '200px'}"></div>
    <div id="wsWvc" :style="{width: '780px', height: '200px'}"></div>
    <div id="paAvg" :style="{width: '780px', height: '200px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../Observation/drawCharts.js"
    export default {
        name: "SiteLast24Modal",
      data(){
          return {
            site_last24_modal:false,
            taAvg:null,
            rhAvg:null,
            wsWvc:null,
            paAvg:null
          }
      },
      methods:{
        openSiteLast24Modal() {
          // this.site_last24_modal = true;
          this.taAvg = this.$echarts.init(document.getElementById('taAvg'));
          this.rhAvg = this.$echarts.init(document.getElementById('rhAvg'));
          this.wsWvc = this.$echarts.init(document.getElementById('wsWvc'));
          this.paAvg = this.$echarts.init(document.getElementById('paAvg'));

          this.taAvg.clear();
          this.rhAvg.clear();
          this.wsWvc.clear();
          this.paAvg.clear();

          //请求最近24小时数据并绘图
          this.queryLast24Data();
        },
        queryLast24Data(){
          var api = `/api/SZTDService/querySiteLast24.action`;
          this.$axios.get(api).then((response)=> {
            // drawCharts.drawCTDChart(response.data.bottomCtdList,this.chart1);
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })
        }
      }
    }
</script>

<style scoped>

</style>
