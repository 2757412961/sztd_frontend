<template>
  <modal width="800"
         v-model="density_observation_modal"
         title="密度观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row style="text-align:center;margin:0 auto">
      <label style="font-size: 14px;line-height:2;">站点：</label>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link" style="line-height:2;">
          {{site}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="CTD1">CTD1</el-dropdown-item>
          <el-dropdown-item command="CTD2">CTD2</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <label style="font-size:14px;line-height:2;margin-left: 40px;">起止时间：</label>
      <DatePicker type="datetimerange" v-model="timeRange" placeholder="开始时间-结束时间" style="width: 300px"></DatePicker>

      <el-button
        type="primary"
        :loading="queryStatus"
        size="small"
        style="margin-left: 30px;"
        @click="queryDensityHistory">查询</el-button>
    </el-row>
    <div id="densityObservationChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
    export default {
      name: "DensityObservationModal",
      data(){
        return {
          density_observation_modal:false,
          site:"",
          timeRange:[],
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openDensityObservationModal() {
          this.site = "CTD1";
          this.density_observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('densityObservationChart'))
          this.chart.clear()
        },
        handleCommand(command){
          this.site=command;
        },
        queryDensityHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryCtdHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.site.substring(3),
              startTime:this.timeRange[0].getTime(),
              endTime:this.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData!=[])
              this.drawCTDChart(tableData);
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
        },
        drawCTDChart(tableData){
          var saltData = [];
          var tempData = [];
          var maxSalt=0;
          var minSalt=100;
          var maxTemp =0;
          var minTemp=100;
          var i=0
          for(; i < tableData.length;i++){
            saltData[i]=[tableData[i].dt,tableData[i].sl];
            tempData[i]=[tableData[i].dt,tableData[i].wt];
            maxSalt= tableData[i].sl>maxSalt?tableData[i].sl:maxSalt;
            minSalt=tableData[i].sl<minSalt?tableData[i].sl:minSalt;
            maxTemp=tableData[i].wt>maxTemp?tableData[i].wt:maxTemp;
            minTemp=tableData[i].wt<minTemp?tableData[i].wt:minTemp;
          }

          var option ={
            tooltip : {},
            legend : {
              data : [ '温度', '密度' ],
              orient : 'horizontal',
              top:'25',
              right:'150'
            },
            xAxis : {
              name : "时间",
              nameLocation : 'middle',
              type : 'time',
              min :this.timeRange[0] ,
              max :this.timeRange[1],
              nameGap : '40',
            },
            yAxis:[{
              name : "温度(℃)",
              nameLocation : 'end',
              left:0,
              type : 'value',
              axisLine : {
                onZero : false
              },
              splitLine : {
                show : false
              },
              min :16,
              max :32,
              nameGap : '15'
            },{
              name : "密度(PSU)",
              nameLocation : 'end',
              type : 'value',
              axisLine : {
                onZero : false
              },
              splitLine : {
                show : false
              },
              min:10,
              max:34,
              nameGap : '15',
            } ], dataZoom : [{
              type : 'slider',
              yAxisIndex : 0,
              left:0,
              filterMode : 'empty',
              startValue : 16 ,
              endValue:32,
              realtime:false,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }, {
              type : 'slider',
              yAxisIndex : 1,
              filterMode : 'empty',
              startValue : 10 ,
              endValue:34,
              realtime:false,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }, {
              type : 'inside',
              xAxisIndex : 0,
              filterMode : 'empty'
            } ],
            series : [{
              name : '温度',
              type : 'line',
              symbol:'circle',
              smooth : true,
              yAxisIndex : 0,
              data : tempData
            },{
              name : '密度',
              type : 'line',
              symbol:'circle',
              smooth : true,
              yAxisIndex : 1,
              data : saltData
            } ]
          };
          this.chart.setOption(option);
        },
      }
    }
</script>

<style scoped>

</style>
