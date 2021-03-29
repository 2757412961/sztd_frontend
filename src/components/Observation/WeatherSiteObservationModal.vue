<template>
  <modal width="900"
         v-model="weather_site_Observation_modal"
         title="气象站数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-form :inline="true" :model="weatherSiteObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="气象站">
        <el-select v-model="weatherSiteObsForm.siteName" placeholder="请选择气象站" size="small" style="width:150px">
          <el-option label="桂山牛头岛气象站" value="1"></el-option>
          <el-option label="西人工岛气象站" value="2"></el-option>
          <el-option label="龙穴船厂气象站" value="3"></el-option>
          <!--<el-option label="3" value="Site3"></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="要素">
        <el-select v-model="weatherSiteObsForm.name" placeholder="请选择要素" size="small" style="width:120px">
          <el-option label="气温" value="TaAvg"></el-option>
          <el-option label="湿度" value="RhAvg"></el-option>
          <el-option label="风速" value="WsWvc1"></el-option>
          <el-option label="气压" value="PaAvg"></el-option>
          <el-option label="降水" value="Rain"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="weatherSiteObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryWeatherSiteHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="weatherSiteObservationChart" :style="{width: '850px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../../util/drawCharts"
    export default {
      name: "WeatherSiteObservationModal",
      data(){
        return {
          weather_site_Observation_modal:false,
          weatherSiteObsForm:{
            siteName:"",
            name:"",
            timeRange:[],
          },

          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openWeatherSiteObservationModal() {
          this.weather_site_Observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('weatherSiteObservationChart'));
          this.chart.clear();
        },

        handleCommand(command){
          this.site=command;
        },

        queryWeatherSiteHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/querySiteHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.weatherSiteObsForm.siteName,
              startTime:this.weatherSiteObsForm.timeRange[0].getTime(),
              endTime:this.weatherSiteObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData.length!=0)
            {
              if(this.weatherSiteObsForm.name=="TaAvg")
                drawCharts.drawSiteTaAvg(tableData,this.chart);
              else if(this.weatherSiteObsForm.name=="RhAvg")
                drawCharts.drawSiteRhAvg(tableData,this.chart);
              else if(this.weatherSiteObsForm.name=="WsWvc1")
                drawCharts.drawSiteWsWvc1(tableData,this.chart);
              else if(this.weatherSiteObsForm.name=="PaAvg")
                drawCharts.drawSitePaAvg(tableData,this.chart);
              else if(this.weatherSiteObsForm.name=="Rain")            
                drawCharts.drawSiteRain(tableData,this.chart);
            }
            else
            {
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
          }).catch((response)=>{
            //失败回调
            this.$confirm(response.data, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{
            this.queryStatus=false;
          })

        }
      }
    }
</script>

<style scoped>

</style>
