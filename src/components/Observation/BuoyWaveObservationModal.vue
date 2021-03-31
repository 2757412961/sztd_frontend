<template>
  <modal width="800"
         v-model="buoy_wave_observation_modal"
         title="浮标海浪观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">

    <el-form :inline="true" :model="buoyWaveObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="浮标">
        <el-select v-model="buoyWaveObsForm.name" placeholder="请选择浮标" size="small" style="width:150px">
          <el-option label="1号浮标" value="Buoy1"></el-option>
          <el-option label="2号浮标" value="Buoy2"></el-option>
          <el-option label="3 / 5号浮标" value="Buoy3"></el-option>
          <el-option label="4号浮标" value="Buoy4"></el-option>
          <el-option label="1号航标" value="Buoy6"></el-option>
          <el-option label="2号航标" value="Buoy7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="buoyWaveObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryBuoyWaveHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="obsWaveWHChartDIV" :style="{width: '750px', height: '260px'}"></div>
    <div id="obsWaveWHTChartDIV" :style="{width: '750px', height: '260px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../../util/drawCharts"
    export default {
      name: "BuoyWaveObservationModal",
      data(){
        return {
          buoy_wave_observation_modal:false,
          buoyWaveObsForm:{
            name:"",
            timeRange:[],
          },
          obsWaveWHChart:null,
          obsWaveWHTChart:null,
          queryStatus:false
        }
      },
      methods: {
        openBuoyWaveObservationModal() {
          this.buoy_wave_observation_modal = true;
          this.obsWaveWHChart = this.$echarts.init(document.getElementById('obsWaveWHChartDIV'));
          this.obsWaveWHTChart = this.$echarts.init(document.getElementById('obsWaveWHTChartDIV'));
          this.obsWaveWHChart.clear();
          this.obsWaveWHTChart.clear();
        },
        queryBuoyWaveHistory(){
          this.obsWaveWHChart.clear();
          this.obsWaveWHTChart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryBuoyWVHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.buoyWaveObsForm.name.substring(4),
              startTime:this.buoyWaveObsForm.timeRange[0].getTime(),
              endTime:this.buoyWaveObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData.length!=0)
            {
              drawCharts.drawWaveAllWH(tableData,this.obsWaveWHChart);
              drawCharts.drawWaveAllWHT(tableData,this.obsWaveWHTChart);
            }
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
            this.queryStatus=false;
          })
        }
      }
    }
</script>

<style scoped>

</style>
