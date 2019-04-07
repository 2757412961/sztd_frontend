<template>
  <modal width="600"
         v-model="wind_time_series_modal"
         title="站点历史数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="atmWindTimeSeriesChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
    export default {
        name: "WindTimeSeriesModal",
      data() {
        return {
          wind_time_series_modal:false,
        }
      },
      methods:{
        openWindTimeSeriesModal(e){
          //判断是否在数据经纬度范围内
          if(e[0]>=this.$store.state.atmExtent[0] &
            e[0]<=this.$store.state.atmExtent[2] &
            e[1]>=this.$store.state.atmExtent[1] &
            e[1]<=this.$store.state.atmExtent[3]) {
            //请求nc时间序列数据并绘制图表
            this.wind_time_series_modal = true;
            this.queryNCdata(e);
          }
        },
        queryNCdata(e){
          var api=`/api/SZTDService/queryAtmWin10mNcData.action`;
          this.$axios.get(api,{
            params:{
              lon:e[0],
              lat:e[1]
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData!=[])
              this.drawWindTSChart(tableData);
            else
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })
        },
        /**
         * TODO 绘制大气数据十米风场时间序列图
         * @param tableData
         */
        drawWindTSChart(tableData){

        }
      }
    }
</script>

<style scoped>

</style>
