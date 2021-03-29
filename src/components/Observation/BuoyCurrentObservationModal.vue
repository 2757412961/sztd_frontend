<template>
  <modal width="1000"
         v-model="buoy_current_observation_modal"
         title="浮标海流观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">

    <el-form :inline="true" :model="buoyCurrentObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="浮标">
        <el-select @change="changeLevel0LabelTemp" v-model="buoyCurrentObsForm.name" placeholder="请选择浮标" size="mini" style="width:100px">
          <el-option label="1" value="Buoy1"></el-option>
          <el-option label="2" value="Buoy2"></el-option>
          <el-option label="3" value="Buoy3"></el-option>
          <el-option label="4" value="Buoy4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="海流层级">
        <el-select size="mini" v-model="buoyCurrentObsForm.level" style="width:260px"
                   multiple placeholder="请选择层级">
          <el-option
            v-for="item in buoyCurrentObsForm.levelList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="buoyCurrentObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryBuoyCurrentHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="buoyCurrentObservationChart" :style="{width: '950px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../../util/drawCharts"
    export default {
      name: "BuoyCurrentObservationModal",
      data(){
        return {
          labelTemp:'',
          buoy_current_observation_modal:false,
          buoyCurrentObsForm:{
            name:"",
            timeRange:[],
            level: [],
            levelList:
              [
                {
                  value: 0,
                  label: '10m平均',
                },
                {
                  value: 1,
                  label: '1'
                },
                {
                  value: 2,
                  label: '2'
                },
                {
                  value: 3,
                  label: '3'
                },
                {
                  value: 4,
                  label: '4'
                },
                {
                  value: 5,
                  label: '5'
                },
                {
                  value: 6,
                  label: '6'
                },
                {
                  value: 7,
                  label: '7'
                },
                {
                  value: 8,
                  label: '8'
                },
                {
                  value: 9,
                  label: '9'
                },
                {
                  value: 10,
                  label: '10'
                },
                {
                  value: 11,
                  label: '11'
                },
                {
                  value: 12,
                  label: '12'
                },
                {
                  value: 13,
                  label: '13'
                },
                {
                  value: 14,
                  label: '14'
                },
                {
                  value: 15,
                  label: '15'
                },

              ]
          },
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        changeLevel0LabelTemp(){
          this.buoyCurrentObsForm.levelList[0].label = this.buoyCurrentObsForm.name.substring(4) == 1 ? '垂直平均流' : '10m平均';
          this.labelTemp=this.buoyCurrentObsForm.levelList[0].label;
        },
        openBuoyCurrentObservationModal() {
          this.buoy_current_observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('buoyCurrentObservationChart'))
          this.chart.clear()
        },
        queryBuoyCurrentHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryFubHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.buoyCurrentObsForm.name.substring(4),
              startTime:this.buoyCurrentObsForm.timeRange[0].getTime(),
              endTime:this.buoyCurrentObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData != null)
            {
              for(var i=0;i<this.buoyCurrentObsForm.level.length;i++)
              {
                if(tableData[this.buoyCurrentObsForm.level[i]].length==0)
                {
                  this.$confirm('没有相关数据！', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning'
                  });
                  return null;
                }
              }
              drawCharts.drawCurrentFlowV(tableData,this.buoyCurrentObsForm.level,this.labelTemp,this.chart);
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
