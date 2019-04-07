<template>
  <modal width="800"
         v-model="site_last12_modal"
         title="站点最近12小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="siteLast12Chart1" :style="{width: '780px', height: '200px'}"></div>
    <div id="siteLast12Chart2" :style="{width: '780px', height: '200px'}"></div>
    <div id="siteLast12Chart3" :style="{width: '780px', height: '200px'}"></div>
  </modal>
</template>

<script>
    export default {
      name: "SiteLast12Modal",
      data(){
        return {
          site_last12_modal:false,
          features:"",
          chart1:"",
          chart2:"",
          chart3:"",
        }
      },
      methods:{
        openSiteLast12Modal(features) {
          if(features != null&&features.length!=0){
            this.features=features;
          }else{
            return;
          }
          this.site_last12_modal = true;

          this.chart1 = this.$echarts.init(document.getElementById('siteLast12Chart1'));
          this.chart2 = this.$echarts.init(document.getElementById('siteLast12Chart2'));
          this.chart3 = this.$echarts.init(document.getElementById('siteLast12Chart3'));
          this.chart1.clear();
          this.chart2.clear();
          this.chart3.clear();

          //请求最近12小时数据并绘图
          this.queryLast12Data();
        },
        queryLast12Data(){
          for(var i=0;i<this.features.length;i++){
            var siteName =  this.features[i].get('name')
            if(siteName.includes("CTD")){
              var api=`/api/SZTDService/queryCtdLast12.action`;
              this.$axios.get(api,{
                params:{id:siteName.substring(3)}
              }).then((response)=> {
                var id=response.config.params.id;
                if(id==1){
                  this.drawCTDChart(response.data,this.chart1);
                }else if(id==2){
                  this.drawCTDChart(response.data,this.chart2);
                }
              }).catch((response)=>{
                //失败回调
                this.$confirm('服务器失联！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
              }).finally((response)=>{

              })
            }else{
              //潮位计
              var api=`/api/SZTDService/queryTideLast12.action`;
              this.$axios.get(api,{
                params:{
                  id:siteName.substring(4)
                }
              }).then((response)=> {
                var id=response.config.params.id;
                if(id==1){
                  this.drawTideChart(response.data,this.chart3)
                }
              }).catch((response)=>{
                //失败回调
                this.$confirm(response.data, '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
              }).finally((response)=>{

              })
            }
          }
        },
        drawCTDChart(tableData,chart){
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
          // var currentDt = new Date();
          // var preDate = new Date(currentDt.getTime() - 12*60*60*1000);
          var option ={
            title: {
              text: "CTD" + tableData[0].ctdid,
              left: 'center'
            },
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
              min :tableData[0].dt,
              max :tableData[i-1].dt,
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
          chart.setOption(option);
        },
        drawTideChart(tableData,chart){
          var wlData = [];
          var maxWL =0;
          var minWL=10000;
          var i=0
          for(; i < tableData.length;i++){
            wlData[i]=[tableData[i].dt,tableData[i].wl];
            maxWL= tableData[i].wl>maxWL?tableData[i].wl:maxWL;
            minWL=tableData[i].wl<minWL?tableData[i].wl:minWL;
          }
          // var currentDt = new Date();
          // var preDate = new Date(currentDt.getTime() - 12*60*60*1000);
          var option ={
            title: {
              text: "潮位计" + tableData[0].tideid,
              left: 'center'
            },
            tooltip : {},
            legend : {
              data : ['潮位'],
              orient : 'horizontal',
              top:'25',
              right:'150'
            },
            xAxis : {
              name : "时间",
              nameLocation : 'middle',
              type : 'time',
              min :tableData[0].dt,
              max :tableData[i-1].dt,
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
              yAxisIndex : 0,
              left:0,
              filterMode : 'empty',
              startValue : Math.floor(minWL) ,
              endValue: Math.ceil(maxWL),
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
          chart.setOption(option);
        }
      }
    }
</script>

<style scoped>

</style>
