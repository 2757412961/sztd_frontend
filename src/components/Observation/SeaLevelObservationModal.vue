<template>
  <modal width="800"
         v-model="sea_Level_Observation_modal"
         title="潮位观测数据查询"
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
          <el-dropdown-item command="潮位计1">潮位计1</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <label style="font-size:14px;line-height:2;margin-left: 40px;">起止时间：</label>
      <DatePicker type="datetimerange" v-model="timeRange" placeholder="开始时间-结束时间" style="width: 300px"></DatePicker>

      <el-button
        type="primary"
        :loading="queryStatus"
        size="small"
        style="margin-left: 30px;"
        @click="querySeaLevelHistory">查询</el-button>
    </el-row>
    <div id="seaLevelObservationChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
    export default {
      name: "SeaLevelObservationModal",
      data(){
        return {
          sea_Level_Observation_modal:false,
          site:"",
          timeRange:[],
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openSeaLevelObservationModal() {
          this.site = "潮位计1";
          this.sea_Level_Observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('seaLevelObservationChart'))
          this.chart.clear()
        },

        handleCommand(command){
          this.site=command;
        },

        querySeaLevelHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryTideHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.site.substring(3),
              startTime:this.timeRange[0].getTime(),
              endTime:this.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            console.log(tableData);
            if(tableData!=[])
              this.drawTideChart(tableData);
            else
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
          }).catch((response)=>{
            //失败回调
            this.$confirm(response.data, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{
            this.queryStatus=false;
          })

        },
        drawTideChart(tableData){
          var wlData = [];
          var maxWL =0;
          var minWL=10000;
          var i=0
          for(; i < tableData.length;i++){
            wlData[i]=[tableData[i].dt,tableData[i].wl];
            maxWL= tableData[i].wl>maxWL?tableData[i].wl:maxWL;
            minWL=tableData[i].wl<minWL?tableData[i].wl:minWL;
          }

          var option ={
            tooltip : {},
            legend : {
              data : ['潮位'],
              orient : 'horizontal',
              top:'25',
              right:'100'
            },
            xAxis : {
              name : "时间",
              nameLocation : 'middle',
              type : 'time',
              min :this.timeRange[0] ,
              max :this.timeRange[1],
              nameGap : '40',
            },
            yAxis:{
              name : "潮位(cm)",
              nameLocation : 'end',
              type : 'value',
              axisLine : {
                onZero : false
              },
              splitLine : {
                show : false
              },
              min :Math.floor(minWL) ,
              max :Math.ceil(maxWL),
              nameGap : '15'
            },
            dataZoom : [{
              type : 'slider',
              yAxisIndex :0,
              filterMode : 'empty',
              startValue : Math.floor(minWL),
              endValue:Math.ceil(maxWL),
              left:0,
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
            series : {
              name : '潮位',
              type : 'line',
              symbol:'circle',
              smooth : true,
              yAxisIndex : 0,
              data : wlData
            }
          };
          this.chart.setOption(option);
        }
      }
    }
</script>

<style scoped>

</style>
