export default {
  drawCTDChart(tableData,chart){
    var densityData = [];
    var tempData = [];
    var maxDensity=0;
    var minDensity=10000;
    var maxTemp =0;
    var minTemp=100;
    var i=0
    for(; i < tableData.length;i++){
      densityData[i]=[tableData[i].dt,tableData[i].density];
      tempData[i]=[tableData[i].dt,tableData[i].wt];

      maxDensity= tableData[i].density>maxDensity?tableData[i].density:maxDensity;
      minDensity=tableData[i].density<minDensity?tableData[i].density:minDensity;
      maxTemp=tableData[i].wt>maxTemp?tableData[i].wt:maxTemp;
      minTemp=tableData[i].wt<minTemp?tableData[i].wt:minTemp;
    }

    // var currentDt = new Date();
    // var preDate = new Date(currentDt.getTime() - 24*60*60*1000);
    var chartTitle="";

    if(tableData[0].owner="platform")
      chartTitle+="平台";
    else if(tableData[0].owner="buoy")
      chartTitle+="浮标";

    if(tableData[0].position=="top")
      chartTitle+="表层CTD";
    else if(tableData[0].position=="bottom")
      chartTitle+="底层CTD";
    var option ={
      title: {
        text: chartTitle,//"CTD" + tableData[0].ctdid,
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
        min:minDensity,
        max:maxDensity,
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
        startValue : minDensity,
        endValue:maxDensity,
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
        itemStyle:{
          color:"#FF6666"
        },
        data : tempData
      },{
        name : '密度',
        type : 'line',
        symbol:'circle',
        smooth : true,
        yAxisIndex : 1,
        itemStyle:{
          color:"#336699"
        },
        data : densityData
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
    // var preDate = new Date(currentDt.getTime() - 24*60*60*1000);
    var option ={
      title: {
        text: "平台潮位",
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
        data : wlData,
        itemStyle:{
          color:"#99CC33"
        }
      }
    };
    chart.setOption(option);
  },
  /**
   * 气象站气温
   * @param tableData
   * @param chart
   */
  drawSiteTaAvg(tableData,chart){
    var taAvgData = [];

    var maxTaAvg=-1000;
    var minTaAvg=1000;

  },

  /**
   * 气象站相对湿度
   * @param tableData
   * @param chart
   */
  drawSiteRhAvg(tableData,chart) {
    var rhAvgData = [];

    var maxRhAvg=-1000;
    var minRhAvg=1000;


  },

  /**
   * 气象站风
   * @param tableData
   * @param chart
   */
  drawSiteWsWvc(tableData,chart) {
    var wsWvcData = [];

    var maxWsWvc=-1000;
    var minWsWvc=1000;



  },


  /**
   * 气象站气压
   * @param tableData
   * @param chart
   */
  drawSitePaAvg(tableData,chart) {
    var paAvgData = [];
    var maxPaAvg=0;
    var minPaAvg=10000;
  }


}
