<template>
  <modal width="1000"
         v-model="density_observation_modal"
         title="密度观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">

    <el-form :inline="true" :model="densityObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="CTD">
        <el-select size="mini" v-model="densityObsForm.name" style="width:300px"
                   multiple placeholder="请选择CTD">
          <el-option
            v-for="item in densityObsForm.nameList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="densityObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryDensityHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="densityObservationChart" :style="{width: '950px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../../util/drawCharts"
    export default {
      name: "DensityObservationModal",
      data(){
        return {
          density_observation_modal:false,
          densityObsForm:{
            name:[],
            nameList:
              [
                {
                  value: 1,
                  label: '1号-平台底层CTD'
                },
                {
                  value: 2,
                  label: '2号-平台表层CTD',
                },
                // {
                //   value: 3,
                //   label: '3号-浮标底层CTD'
                // }
                {
                  value: 4,
                  label: '4号-浮标表层CTD'
                },
                {
                  value: 5,
                  label: '1号-航标CTD'
                },
                {
                  value: 6,
                  label: '2号-航标CTD'
                },
              ],
            timeRange:[],
          },
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openDensityObservationModal() {
          this.density_observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('densityObservationChart'))
          this.chart.clear()
        },
        queryDensityHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryCtdHistory.action`;
          this.$axios.get(api,{
            params:{
              startTime:this.densityObsForm.timeRange[0].getTime(),
              endTime:this.densityObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData.length!=0)
              drawCharts.drawCTDMultiChart(tableData,this.densityObsForm.name,this.chart);
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
