import echarts from 'echarts/lib/echarts';
import util from "../util/util.js";


export default {
  /**
   * CTD
   * @param tableData1,tableData2
   * @param chart
   */
  drawCTDChart(tableData1, tableData2, chart) {
    var densityData1 = [];
    var tempData1 = [];
    var maxDensity1 = 0;
    var minDensity1 = 10000;
    var maxTemp1 = 0;
    var minTemp1 = 100;
    var i = 0
    for (; i < tableData1.length; i++) {
      densityData1[i] = [tableData1[i].dt, util.toFixedTwo(tableData1[i].density)];
      tempData1[i] = [tableData1[i].dt, util.toFixedTwo(tableData1[i].wt)];

      maxDensity1 = tableData1[i].density > maxDensity1 ? tableData1[i].density : maxDensity1;
      minDensity1 = tableData1[i].density < minDensity1 ? tableData1[i].density : minDensity1;
      maxTemp1 = tableData1[i].wt > maxTemp1 ? tableData1[i].wt : maxTemp1;
      minTemp1 = tableData1[i].wt < minTemp1 ? tableData1[i].wt : minTemp1;
    }
    var minDate1 = tableData1[0].dt;
    var maxDate1
    if (i == 0)
      maxDate1 = minDate1;
    else
      maxDate1 = tableData1[i - 1].dt;


    var chartTitle = "";

    if (tableData1[0].owner = "platform")
      chartTitle += "平台";
    else if (tableData1[0].owner = "buoy")
      chartTitle += "浮标";


    var densityData2 = [];
    var tempData2 = [];
    var maxDensity2 = 0;
    var minDensity2 = 10000;
    var maxTemp2 = 0;
    var minTemp2 = 100;
    var i = 0
    for (; i < tableData2.length; i++) {
      densityData2[i] = [tableData2[i].dt, util.toFixedTwo(tableData2[i].density)];
      tempData2[i] = [tableData2[i].dt, util.toFixedTwo(tableData2[i].wt)];

      maxDensity2 = tableData2[i].density > maxDensity2 ? tableData2[i].density : maxDensity2;
      minDensity2 = tableData2[i].density < minDensity2 ? tableData2[i].density : minDensity2;
      maxTemp2 = tableData2[i].wt > maxTemp2 ? tableData2[i].wt : maxTemp2;
      minTemp2 = tableData2[i].wt < minTemp2 ? tableData2[i].wt : minTemp2;
    }
    var minDate2 = tableData2[0].dt;
    var maxDate2
    if (i == 0)
      maxDate2 = minDate2;
    else
      maxDate2 = tableData2[i - 1].dt;


    var maxDensity = maxDensity1 > maxDensity2 ? maxDensity1 : maxDensity2;
    var minDensity = minDensity1 < minDensity2 ? minDensity1 : minDensity2;
    var maxTemp = maxTemp1 > maxTemp2 ? maxTemp1 : maxTemp2;
    var minTemp = minTemp1 < minTemp2 ? minTemp1 : minTemp2;
    var maxDate = maxDate1 > maxDate2 ? maxDate1 : maxDate2;
    var minDate = minDate1 < minDate2 ? minDate1 : minDate2;


    var option = {
      title: {
        text: chartTitle + "CTD",//"CTD" + tableData[0].ctdid,
        left: 'center',
        top: '10',
      },
      tooltip: {
        trigger: 'axis',
        // formatter: function (params) {
        //     var danwei = params.seriesName.substring(5)=="密度" ? "kg/m³" : "℃";
        //     return [
        //       chartTitle+params.seriesName.substring(0,5),
        //       '时刻：' + util.formatDateTime(new Date(params.value[0])),
        //       params.seriesName.substring(5)+"("+danwei+")：" + params.value[1] ,
        //      ].join('<br>');
        // }
      },
      legend: {
        data: ['表层CTD温度', '表层CTD密度', '底层CTD温度', '底层CTD密度'],
        orient: 'horizontal',
        top: '40',
        right: '150'
      },
      grid: {
        left: 75,
        right: 75,
        top: 70,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: [{
        name: "温度(℃)",
        nameLocation: 'end',
        left: 0,
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 16,
        max: 32,
        nameGap: '15'
      }, {
        name: "密度(kg/m³)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: minDensity,
        max: maxDensity,
        nameGap: '15',
      }],
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: 16,
        endValue: 32,
        realtime: false,
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
        type: 'slider',
        yAxisIndex: 1,
        left: 670,
        filterMode: 'empty',
        startValue: minDensity,
        endValue: maxDensity,
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        name: '表层CTD温度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        itemStyle: {
          color: "#f9767d"
        },
        symbolSize: 0.5,
        data: tempData1
      }, {
        name: '表层CTD密度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: "#76aef9"
        },
        symbolSize: 0.5,
        data: densityData1
      }, {
        name: '底层CTD温度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        itemStyle: {
          color: "#A52A2A"
        },
        symbolSize: 0.5,
        data: tempData2
      }, {
        name: '底层CTD密度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: "#000080"
        },
        symbolSize: 0.5,
        data: densityData2
      }]
    };
    chart.setOption(option);
  },

  /**
   * CTD
   * @param tableData1,tableData2
   * @param chart
   */
  drawCTDMultiChart(tableData, name, chart) {
    //先声明一维
    let arrSize = 8; // 暂时设置8个大小
    var densityData = [];
    var tempData = [];

    var maxDensityAll = new Array(arrSize).fill(0);
    var minDensityAll = new Array(arrSize).fill(10000);
    var maxTempAll = new Array(arrSize).fill(0);
    var minTempAll = new Array(arrSize).fill(100);

    var minDateTemp = new Date('2200-01-01 00:00:00').getTime();
    var maxDateTemp = new Date('2000-01-01 00:00:00').getTime();
    var minDateAll = new Array(arrSize).fill(minDateTemp);
    var maxDateAll = new Array(arrSize).fill(maxDateTemp);

    // 根据name列表筛选数据，不包括所有的数据
    for (var filteri = 0; filteri < name.length; filteri++) {
      var i = name[filteri] - 1;
      var num = tableData[i].length;
      //声明二维，每一个一维数组里面的一个元素都是一个数组
      densityData[i] = new Array();
      tempData[i] = new Array();
      if (num > 0) {
        for (var j = 0; j < num; j++) {
          densityData[i][j] = [tableData[i][j].dt, util.toFixedTwo(tableData[i][j].density)];
          tempData[i][j] = [tableData[i][j].dt, util.toFixedTwo(tableData[i][j].wt)];
          //求四个CTD各自最大最小值
          maxDensityAll[i] = tableData[i][j].density > maxDensityAll[i] ? tableData[i][j].density : maxDensityAll[i];
          minDensityAll[i] = tableData[i][j].density < minDensityAll[i] ? tableData[i][j].density : minDensityAll[i];
          maxTempAll[i] = tableData[i][j].wt > maxTempAll[i] ? tableData[i][j].wt : maxTempAll[i];
          minTempAll[i] = tableData[i][j].wt < minTempAll[i] ? tableData[i][j].wt : minTempAll[i];
        }
        minDateAll[i] = tableData[i][0].dt;
        maxDateAll[i] = tableData[i][j - 1].dt;
      }
    }

    var maxDensity = maxDensityAll[0];
    var minDensity = minDensityAll[0];
    var maxTemp = maxTempAll[0];
    var minTemp = minTempAll[0];
    var maxDate = maxDateAll[0];
    var minDate = minDateAll[0];

    for (var i = 1; i < arrSize; i++) {
      //求四个CTD全部的最大最小值
      maxDensity = maxDensityAll[i] > maxDensity ? maxDensityAll[i] : maxDensity;
      minDensity = minDensityAll[i] < minDensity ? minDensityAll[i] : minDensity;
      maxTemp = maxTempAll[i] > maxTemp ? maxTempAll[i] : maxTemp;
      minTemp = minTempAll[i] < minTemp ? minTempAll[i] : minTemp;
      maxDate = maxDateAll[i] > maxDate ? maxDateAll[i] : maxDate;
      minDate = minDateAll[i] < minDate ? minDateAll[i] : minDate;
    }


    var nameAll = [];
    nameAll[0] = '1号-平台底层CTD';
    nameAll[1] = '2号-平台表层CTD';
    nameAll[2] = '3号-浮标底层CTD';
    nameAll[3] = '4号-浮标表层CTD';
    nameAll[4] = '1号-航标CTD';
    nameAll[5] = '2号-航标CTD';

    //temp红色系列
    var tempColor = [];
    tempColor[0] = '#8b1a1a';
    tempColor[1] = '#ee0000';
    tempColor[2] = '#FF00FF';
    tempColor[3] = '#FFAEB9';
    tempColor[4] = '#8e2768';
    tempColor[5] = '#4b040e';
    //density蓝色系列
    var densityColor = [];
    densityColor[0] = '#00008B';
    densityColor[1] = '#4169E1';
    densityColor[2] = '#00BFFF';
    densityColor[3] = '#87CEFA';
    densityColor[4] = '#19CAAD';
    densityColor[5] = '#D6D5B7';

    var chartTitle = "";

    var series = [];
    var legendData = [];
    for (var i = 0; i < name.length; i++) {
      var seriesTemp1 =
        {
          name: nameAll[name[i] - 1] + '温度',
          type: 'line',
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 0,
          itemStyle: {
            color: tempColor[name[i] - 1]
          },
          symbolSize: 0.5,
          data: tempData[name[i] - 1]
        };
      var seriesTemp2 =
        {
          name: nameAll[name[i] - 1] + '密度',
          type: 'line',
          symbol: 'circle',
          smooth: true,
          yAxisIndex: 1,
          itemStyle: {
            color: densityColor[name[i] - 1]
          },
          symbolSize: 0.5,
          data: densityData[name[i] - 1]
        };
      legendData.push(nameAll[name[i] - 1] + '温度');
      legendData.push(nameAll[name[i] - 1] + '密度');
      series.push(seriesTemp1);
      series.push(seriesTemp2);
      if (i == 0) {
        chartTitle = chartTitle + nameAll[name[i] - 1];
      } else {
        chartTitle = chartTitle + '、' + nameAll[name[i] - 1];
      }
    }

    var option = {
      title: {
        text: chartTitle,//"CTD" + tableData[0].ctdid,
        left: 'center',
        top: '10',
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: legendData,
        orient: 'horizontal',
        top: '45',
        right: '150'
      },
      grid: {
        left: 75,
        right: 100,
        top: 100,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        splitNumber: 12,
      },
      yAxis: [{
        name: "温度(℃)",
        nameLocation: 'end',
        left: 0,
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 16,
        max: 32,
        nameGap: '15'
      }, {
        name: "密度(kg/m³)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: minDensity,
        max: maxDensity,
        nameGap: '15',
      }],
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: 16,
        endValue: 32,
        realtime: false,
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
        type: 'slider',
        yAxisIndex: 1,
        left: 920,
        filterMode: 'empty',
        startValue: minDensity,
        endValue: maxDensity,
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: series,
    };
    chart.setOption(option);
  },

  /**
   * Tide
   * @param tableData
   * @param chart
   */
  drawTideChart(tableData, chart) {
    var wlData = [];
    var maxWL = 0;
    var minWL = 10000;
    var i = 0
    for (; i < tableData.length; i++) {
      wlData[i] = [tableData[i].dt, tableData[i].wlCorrect];
      maxWL = tableData[i].wlCorrect > maxWL ? tableData[i].wlCorrect : maxWL;
      minWL = tableData[i].wlCorrect < minWL ? tableData[i].wlCorrect : minWL;
    }

    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;
    // var currentDt = new Date();
    // var preDate = new Date(currentDt.getTime() - 24*60*60*1000);
    var option = {
      title: {
        text: "平台潮位",
        left: 'center',
        top: '10'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['潮位'],
        orient: 'horizontal',
        top: '40',
      },
      grid: {
        left: 75,
        right: 75,
        top: 70,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "潮位(cm)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minWL),
        max: Math.ceil(maxWL),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minWL),
        endValue: Math.ceil(maxWL),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '潮位',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: wlData,
        itemStyle: {
          color: "#99CC33"
        },
        symbolSize: 0.5,
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站气温
   * @param tableData
   * @param chart
   */
  drawSiteTaAvg(tableData, chart) {
    var taAvgData = [];

    var maxTaAvg = -1000;
    var minTaAvg = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      taAvgData[i] = [tableData[i].dt, tableData[i].taAvg];
      maxTaAvg = tableData[i].taAvg > maxTaAvg ? tableData[i].taAvg : maxTaAvg;
      minTaAvg = tableData[i].taAvg < minTaAvg ? tableData[i].taAvg : minTaAvg;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站气温",
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['气温'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "气温(℃)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minTaAvg),
        max: Math.ceil(maxTaAvg),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minTaAvg),
        endValue: Math.ceil(maxTaAvg),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '气温',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: taAvgData,
        itemStyle: {
          color: "#FF0000"
        },
        symbolSize: 0.5,
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站降水
   * @param tableData
   * @param chart
   */
  drawSiteRain(tableData, chart) {
    var rainData = [];

    var maxRain = -1000;
    var minRain = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      rainData[i] = [tableData[i].dt, tableData[i].rain];
      maxRain = tableData[i].rain > maxRain ? tableData[i].rain : maxRain;
      minRain = tableData[i].rain < minRain ? tableData[i].rain : minRain;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站降水",
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['降水'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "降水(mm)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minRain),
        max: Math.ceil(maxRain),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minRain),
        endValue: Math.ceil(maxRain),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '降水',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: rainData,
        itemStyle: {
          color: "#FF0000"
        },
        symbolSize: 0.5,
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站相对湿度
   * @param tableData
   * @param chart
   */
  drawSiteRhAvg(tableData, chart) {
    var rhAvgData = [];

    var maxRhAvg = -1000;
    var minRhAvg = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      rhAvgData[i] = [tableData[i].dt, tableData[i].rhAvg];
      maxRhAvg = tableData[i].rhAvg > maxRhAvg ? tableData[i].rhAvg : maxRhAvg;
      minRhAvg = tableData[i].rhAvg < minRhAvg ? tableData[i].rhAvg : minRhAvg;
    }

    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;


    var option = {
      title: {
        text: "气象站相对湿度",
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['相对湿度'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "相对湿度",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minRhAvg),
        max: Math.ceil(maxRhAvg),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minRhAvg),
        endValue: Math.ceil(maxRhAvg),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '相对湿度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: rhAvgData,
        itemStyle: {
          color: "#EEC900"
        },
        symbolSize: 0.5,
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站风m/s
   * @param tableData
   * @param chart
   */
  drawSiteWsWvc1(tableData, chart) {
    function waveLevel() {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      // return 'M-1,0 L-1,-8 L-3,-8 L0,-12 L3,-8 L1,-8 L1,0 L-1,0';
      // return 'M0,0 L0,-12 L-3,-8 L0,-12 L3,-8 L0,-12 L0,0';
      return 'M0,0 L0,-15 L-3,-11 L0,-15 L3,-11 L0,-15 L0,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.dt),
        api.value(dims.wsWvc1)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(),
        },
        rotation: (-api.value(dims.wsWvc2) + 180) * Math.PI / 180,//传入弧度制，风速朝里，逆时针旋转
        position: point,
        style: api.style({
          fill: '#000000',
          stroke: '#000000',
          lineWidth: 1
        })
      };
    }

    var data = echarts.util.map(tableData, function (entry) {
      return [entry.dt, entry.wsWvc1, entry.wsWvc2];
    });
    var dims = {
      dt: 0,
      wsWvc1: 1,
      wsWvc2: 2
    };


    var wsWvc1Data = [];

    var maxWsWvc1 = -1000;
    var minWsWvc1 = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      wsWvc1Data[i] = [tableData[i].dt, tableData[i].wsWvc1];
      maxWsWvc1 = tableData[i].wsWvc1 > maxWsWvc1 ? tableData[i].wsWvc1 : maxWsWvc1;
      minWsWvc1 = tableData[i].wsWvc1 < minWsWvc1 ? tableData[i].wsWvc1 : minWsWvc1;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站风速",
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['风速'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        splitNumber: 12,
      },
      yAxis: {
        name: "风速(m/s)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minWsWvc1),
        max: Math.ceil(maxWsWvc1),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minWsWvc1),
        endValue: Math.ceil(maxWsWvc1),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.dt,
          y: dims.wsWvc1
        },
        data: data,
        z: 10
      }, {
        name: '风速',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: wsWvc1Data,
        itemStyle: {
          color: "#99CC33"
        },
        symbolSize: 1,
      }]
    };
    chart.setOption(option);
  },

  /**
   * 气象站气压hPa
   * @param tableData
   * @param chart
   */
  drawSitePaAvg(tableData, chart) {
    var paAvgData = [];

    var maxPaAvg = -100000;
    var minPaAvg = 100000;

    var i = 0
    for (; i < tableData.length; i++) {
      paAvgData[i] = [tableData[i].dt, tableData[i].paAvg];
      maxPaAvg = tableData[i].paAvg > maxPaAvg ? tableData[i].paAvg : maxPaAvg;
      minPaAvg = tableData[i].paAvg < minPaAvg ? tableData[i].paAvg : minPaAvg;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站气压",
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['气压'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 80,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "气压(hPa)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minPaAvg),
        max: Math.ceil(maxPaAvg),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 5,
        filterMode: 'empty',
        startValue: Math.floor(minPaAvg),
        endValue: Math.ceil(maxPaAvg),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '气压',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: paAvgData,
        itemStyle: {
          color: "#87CEEB"
        },
        symbolSize: 0.5,
      }
    };
    chart.setOption(option);
  },

  /**
   * 海浪波高：最大波高、有效波高、平均波高、1/10波高
   * @param tableData
   * @param chart
   */
  drawWaveAllWH(tableData, chart) {
    //海浪最大波高
    var maxWHData = [];

    var maxMaxWH = -1000;
    var minMaxWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      maxWHData[i] = [tableData[i].dt, tableData[i].maxwh];
      maxMaxWH = tableData[i].maxwh > maxMaxWH ? tableData[i].maxwh : maxMaxWH;
      minMaxWH = tableData[i].maxwh < minMaxWH ? tableData[i].maxwh : minMaxWH;
    }
    var minDateMaxWH = tableData[0].dt;
    var maxDateMaxWH
    if (i == 0)
      maxDateMaxWH = minDateMaxWH;
    else
      maxDateMaxWH = tableData[i - 1].dt;

    //海浪有效波高
    var sigWHData = [];

    var maxSigWH = -1000;
    var minSigWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      sigWHData[i] = [tableData[i].dt, tableData[i].sigwh];
      maxSigWH = tableData[i].sigwh > maxSigWH ? tableData[i].sigwh : maxSigWH;
      minSigWH = tableData[i].sigwh < minSigWH ? tableData[i].sigwh : minSigWH;
    }
    var minDateSigWH = tableData[0].dt;
    var maxDateSigWH
    if (i == 0)
      maxDateSigWH = minDateSigWH;
    else
      maxDateSigWH = tableData[i - 1].dt;

    //海浪平均波高
    var averWHData = [];

    var maxAverWH = -1000;
    var minAverWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      averWHData[i] = [tableData[i].dt, tableData[i].averwh];
      maxAverWH = tableData[i].averwh > maxAverWH ? tableData[i].averwh : maxAverWH;
      minAverWH = tableData[i].averwh < minAverWH ? tableData[i].averwh : minAverWH;
    }
    var minDateAverWH = tableData[0].dt;
    var maxDateAverWH
    if (i == 0)
      maxDateAverWH = minDateAverWH;
    else
      maxDateAverWH = tableData[i - 1].dt;

    //海浪1/10波高
    var tenWHData = [];

    var maxTenWH = -1000;
    var minTenWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      tenWHData[i] = [tableData[i].dt, tableData[i].tenwh];
      maxTenWH = tableData[i].tenwh > maxTenWH ? tableData[i].tenwh : maxTenWH;
      minTenWH = tableData[i].tenwh < minTenWH ? tableData[i].tenwh : minTenWH;
    }
    var minDateTenWH = tableData[0].dt;
    var maxDateTenWH
    if (i == 0)
      maxDateTenWH = minDateTenWH;
    else
      maxDateTenWH = tableData[i - 1].dt;


    //x轴，最大日期和最小日期
    var maxDate = maxDateMaxWH > maxDateSigWH ? maxDateMaxWH : maxDateSigWH;
    var minDate = minDateMaxWH < minDateSigWH ? minDateMaxWH : minDateSigWH;

    var option = {
      title: {
        text: "海浪波高",
        left: 'center',
        top: '10',
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['最大波高', '有效波高', '平均波高', '1/10波高'],
        orient: 'horizontal',
        top: '40',
        selected: {
          '最大波高': true,
          '有效波高': true,
          '平均波高': false,
          '1/10波高': false,
        }
      },
      grid: {
        left: 75,
        right: 30,
        top: 70,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        splitNumber: 12,
      },
      yAxis: {
        name: "波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minMaxWH),
        max: Math.ceil(maxMaxWH),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minMaxWH),
        endValue: Math.ceil(maxMaxWH),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        name: '最大波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: maxWHData,
        itemStyle: {
          color: "#f9767d"
        },
        symbolSize: 0.5,
      }, {
        name: '有效波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: sigWHData,
        itemStyle: {
          color: "#76aef9"
        },
        symbolSize: 0.5,
      }, {
        name: '平均波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: averWHData,
        itemStyle: {
          color: "#f9f276"
        },
        symbolSize: 0.5,
      }, {
        name: '1/10波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: tenWHData,
        itemStyle: {
          color: "#76f97c"
        },
        symbolSize: 0.5,
      }]
    };
    chart.setOption(option);
  },

  /**
   * 海浪波高周期：最大波高周期、有效波高周期、平均波高周期、1/10波高周期
   * @param tableData
   * @param chart
   */
  drawWaveAllWHT(tableData, chart) {
    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      // return 'M-1,0 L-1,-8 L-3,-8 L0,-12 L3,-8 L1,-8 L1,0 L-1,0';
      // return 'M0,0 L0,-12 L-3,-8 L0,-12 L3,-8 L0,-12 L0,0';
      return 'M0,0 L0,-15 L-3,-11 L0,-15 L3,-11 L0,-15 L0,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.dt),
        api.value(dims.sigwht)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.sigwht)),
        },
        //以下是原始的：以y轴正方向为起点，逆时针转
        // rotation: (api.value(dims.maindire)) * Math.PI / 180,
        //要改成以y轴正方向为起点，顺时针转，那么 360-
        rotation: (360 - api.value(dims.maindire)) * Math.PI / 180,//传入弧度制
        position: point,
        style: api.style({
          fill: '#000000',
          stroke: '#000000',
          lineWidth: 1
        })
      };
    }

    var data = echarts.util.map(tableData, function (entry) {
      return [entry.dt, entry.sigwht, entry.maindire,];
    });
    var dims = {
      dt: 0,
      sigwht: 1,
      maindire: 2
    };

    //海浪最大波高周期
    var maxWHTData = [];

    var maxMaxWHT = -1000;
    var minMaxWHT = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      maxWHTData[i] = [tableData[i].dt, tableData[i].maxwht];
      maxMaxWHT = tableData[i].maxwht > maxMaxWHT ? tableData[i].maxwht : maxMaxWHT;
      minMaxWHT = tableData[i].maxwht < minMaxWHT ? tableData[i].maxwht : minMaxWHT;
    }
    var minDateMaxWHT = tableData[0].dt;
    var maxDateMaxWHT
    if (i == 0)
      maxDateMaxWHT = minDateMaxWHT;
    else
      maxDateMaxWHT = tableData[i - 1].dt;

    //海浪有效波高周期
    var sigWHTData = [];

    var maxSigWHT = -1000;
    var minSigWHT = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      sigWHTData[i] = [tableData[i].dt, tableData[i].sigwht];
      maxSigWHT = tableData[i].sigwht > maxSigWHT ? tableData[i].sigwht : maxSigWHT;
      minSigWHT = tableData[i].sigwht < minSigWHT ? tableData[i].sigwht : minSigWHT;
    }
    var minDateSigWHT = tableData[0].dt;
    var maxDateSigWHT
    if (i == 0)
      maxDateSigWHT = minDateSigWHT;
    else
      maxDateSigWHT = tableData[i - 1].dt;

    //海浪平均波高
    var averWHTData = [];

    var maxAverWHT = -1000;
    var minAverWHT = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      averWHTData[i] = [tableData[i].dt, tableData[i].averwht];
      maxAverWHT = tableData[i].averwht > maxAverWHT ? tableData[i].averwht : maxAverWHT;
      minAverWHT = tableData[i].averwht < minAverWHT ? tableData[i].averwht : minAverWHT;
    }
    var minDateAverWHT = tableData[0].dt;
    var maxDateAverWHT
    if (i == 0)
      maxDateAverWHT = minDateAverWHT;
    else
      maxDateAverWHT = tableData[i - 1].dt;

    //海浪1/10波高
    var tenWHTData = [];

    var maxTenWHT = -1000;
    var minTenWHT = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      tenWHTData[i] = [tableData[i].dt, tableData[i].tenwht];
      maxTenWHT = tableData[i].tenwht > maxTenWHT ? tableData[i].tenwht : maxTenWHT;
      minTenWHT = tableData[i].tenwht < minTenWHT ? tableData[i].tenwht : minTenWHT;
    }
    var minDateTenWHT = tableData[0].dt;
    var maxDateTenWHT
    if (i == 0)
      maxDateTenWHT = minDateTenWHT;
    else
      maxDateTenWHT = tableData[i - 1].dt;

    //x轴，最大日期和最小日期
    var maxDate = maxDateMaxWHT > maxDateSigWHT ? maxDateMaxWHT : maxDateSigWHT;
    var minDate = minDateMaxWHT < minDateSigWHT ? minDateMaxWHT : minDateSigWHT;

    var option = {
      title: {
        text: "海浪波高周期",
        top: '10',
        left: 'center'
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: ['最大波高周期', '有效波高周期', '平均波高周期', '1/10波高周期'],
        orient: 'horizontal',
        top: '40',
        selected: {
          '最大波高周期': true,
          '有效波高周期': true,
          '平均波高周期': false,
          '1/10波高周期': false,
        }
      },
      grid: {
        left: 75,
        right: 30,
        top: 70,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        splitNumber: 12,
      },
      yAxis: {
        name: "周期(s)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minMaxWHT),
        max: Math.ceil(maxMaxWHT),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minMaxWHT),
        endValue: Math.ceil(maxMaxWHT),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.dt,
          y: dims.sigwht
        },
        data: data,
        z: 10
      }, {
        name: '最大波高周期',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: maxWHTData,
        itemStyle: {
          color: "#f9767d"
        },
        symbolSize: 0.5,
      }, {
        name: '有效波高周期',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: sigWHTData,
        itemStyle: {
          color: "#76aef9"
        },
        symbolSize: 0.5,
      }, {
        name: '平均波高周期',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: averWHTData,
        itemStyle: {
          color: "#f9f276"
        },
        symbolSize: 0.5,
      }, {
        name: '1/10波高周期',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: tenWHTData,
        itemStyle: {
          color: "#76f97c"
        },
        symbolSize: 0.5,
      }]
    };
    chart.setOption(option);
  },

  /**
   * 海流流速和流向
   * @param tableData
   * @param chart
   */
  drawCurrentFlowV(tableData, level, labelTemp, chart) {
    var num = level.length;
    var maxFlowVAll = [];
    var minFlowVAll = [];
    var minDateAll = [];
    var maxDateAll = [];

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      maxFlowVAll[i] = -10000;
      minFlowVAll[i] = 10000;
      for (var j = 0; j < tableData[level[i]].length; j++) {
        tableDataAll[i][j] = [tableData[level[i]][j].dt, util.toFixedTwo(tableData[level[i]][j].flowv / 1000)];
        maxFlowVAll[i] = util.toFixedTwo(tableData[level[i]][j].flowv / 1000) > maxFlowVAll[i] ? util.toFixedTwo(tableData[level[i]][j].flowv / 1000) : maxFlowVAll[i];
        minFlowVAll[i] = util.toFixedTwo(tableData[level[i]][j].flowv / 1000) < minFlowVAll[i] ? util.toFixedTwo(tableData[level[i]][j].flowv / 1000) : minFlowVAll[i];
      }
      minDateAll[i] = tableData[level[i]][0].dt;
      maxDateAll[i] = tableData[level[i]][j - 1].dt;
    }

    var maxFlowV;
    var minFlowV;
    var maxDate;
    var minDate;

    maxFlowV = maxFlowVAll[0];
    minFlowV = minFlowVAll[0];
    maxDate = maxDateAll[0];
    minDate = minDateAll[0];

    for (var i = 1; i < num; i++) {
      maxFlowV = maxFlowV > maxFlowVAll[i] ? maxFlowV : maxFlowVAll[i];
      minFlowV = minFlowV < minFlowVAll[i] ? minFlowV : minFlowVAll[i];

      maxDate = maxDate > maxDateAll[i] ? maxDate : maxDateAll[i];
      minDate = minDate < minDateAll[i] ? minDate : minDateAll[i];
    }

    var seriesColor = [];
    seriesColor[0] = '#750611';
    seriesColor[1] = '#ff0a25';
    seriesColor[2] = '#fe7d20';
    seriesColor[3] = '#A0522D';
    seriesColor[4] = '#febc20';
    seriesColor[5] = '#fff60a';
    seriesColor[6] = '#84ff0a';
    seriesColor[7] = '#228d20';
    seriesColor[8] = '#528067';
    seriesColor[9] = '#0afff2';
    seriesColor[10] = '#0a9cff';
    seriesColor[11] = '#0a16ff';
    seriesColor[12] = '#7a0aff';
    seriesColor[13] = '#7817a6';
    seriesColor[14] = '#fb378b';
    seriesColor[15] = '#f99ae3';
    //color[15]='#fb37e6';

    var seriesName = [];
    seriesName[0] = labelTemp;
    for (var i = 1; i < 16; i++) {
      seriesName[i] = "第" + i + "层";
    }


    var series = [];
    var legendData = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp = {
        name: seriesName[level[i]] + '流速',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: tableDataAll[i],
        itemStyle: {
          color: seriesColor[level[i]],
        },
        symbolSize: 0.5,
      };
      series.push(seriesTemp);
      legendData.push(seriesName[level[i]] + '流速');
    }


    var option = {
      title: {
        text: "海流流速",
        left: 'center',
        top: '10',
      },
      tooltip: {trigger: 'axis',},
      legend: {
        data: legendData,
        orient: 'horizontal',
        top: '40',
        left: '100'
      },
      grid: {
        left: 75,
        right: 30,
        top: 90,
        bottom: 70
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "流速(m/s)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minFlowV),
        max: Math.ceil(maxFlowV),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minFlowV),
        endValue: Math.ceil(maxFlowV),
        realtime: false,
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
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: series,
    };
    chart.setOption(option);
  },

  /**
   * 实时监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawRealTimeMonitorVelocDir(tableData, chart) {

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-8 L-3,-8 L0,-12 L3,-8 L1,-8 L1,0 L-1,0';
    }


    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    var tableDataInfoList = [];
    for (var i = 0; i < 7; i++) {
      if (tableData.adcpinfoNewList[i] != null) {
        tableDataInfoList[i] = tableData.adcpinfoNewList[i];
      } else {
        tableDataInfoList[i] = "";
      }
    }

    var tableDataLevList = [];
    for (var i = 0; i < 7; i++) {
      if (tableData.adcplevNewListAll[i] != null) {
        tableDataLevList[i] = tableData.adcplevNewListAll[i];
      } else {
        tableDataLevList[i] = "";
        tableDataInfoList[i].dt = "";
        tableDataInfoList[i].p = "";
        tableDataInfoList[i].r = "";
      }
    }


    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < 7; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableDataLevList[i].length; j++) {
        tableDataAll[i][j] = [tableDataLevList[i][j].veloc / 1000, tableDataLevList[i][j].lev, tableDataLevList[i][j].u, tableDataLevList[i][j].v];
      }
    }


    var position = [];
    position[0] = "西点";
    position[1] = "西南点";
    position[2] = "东南点";
    position[3] = "基槽点";
    position[4] = "西北点";
    position[5] = "东北点";
    position[6] = "东点";


    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    var dataArrow = [];
    for (var i = 0; i < 7; i++) {
      dataArrow[i] = echarts.util.map(tableDataLevList[i], function (entry) {
        return [entry.lev, entry.veloc / 1000, entry.u, entry.v];
      });
    }

    var x = [];
    x[0] = 40;
    x[1] = 200;
    x[2] = 360;
    x[3] = 520;
    x[4] = 680;
    x[5] = 840;
    x[6] = 1000;

    var titleTempText = [];
    for (var i = 0; i < 7; i++) {
      if (tableDataInfoList[i].length != 0) {
        titleTempText[i] = position[i] + '（P:' + tableDataInfoList[i].p + ' R:' + tableDataInfoList[i].r + '）';
      } else {
        titleTempText[i] = position[i] + '（P:  Null   R: Null）';
      }
    }

    var titleTempSubtext = [];
    for (var i = 0; i < 7; i++) {
      if (tableDataInfoList[i].length != 0) {
        titleTempSubtext[i] = util.formatDateTime(new Date(tableDataInfoList[i].dt));
      } else {
        titleTempSubtext[i] = "";
      }
    }

    var title = [];
    for (var i = 0; i < 7; i++) {
      var titleTemp = {
        text: titleTempText[i],
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        subtext: titleTempSubtext[i],
        subtextStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i],
      };
      title.push(titleTemp);
    }

    var xAxis = [];
    for (var i = 0; i < 7; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 0,
        max: 2,
        interval: 0.4,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < 7; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "水深(m)",
        nameLocation: 'middle',
        nameGap: '25',
        type: 'value',
        min: 0,
        max: 50,
        splitNumber: 5,
        inverse: true,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < 7; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < 7; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6
      };
      series.push(seriesTemp2);
    }


    // x:坐标轴左边与边框的距离
    // y:坐标轴顶端与边框的距离
    // x2:坐标轴右边与边框的距离
    // y2:坐标轴底端与边框的距离
    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[0] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[1] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
              ].join('<br>');
            }

          }
        },
        grid: [
          {x: x[0], y: 45, width: 130,},
          {x: x[1], y: 45, width: 130},
          {x: x[2], y: 45, width: 130,},
          {x: x[3], y: 45, width: 130},
          {x: x[4], y: 45, width: 130},
          {x: x[5], y: 45, width: 130,},
          {x: x[6], y: 45, width: 130},
        ],
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: [0, 1, 2, 3, 4, 5, 6],//如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%',
            x: 1150
          },
        ]
      }
    ;
    chart.setOption(option);
  },

  /**
   * 历史监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawHistoryMonitorVelocDir(tableData, chart) {


    var num = tableData.length;

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableData[i].length; j++) {
        tableDataAll[i][j] = [tableData[i][j].veloc / 1000, tableData[i][j].lev, tableData[i][j].u, tableData[i][j].v, tableData[i][j].dt];
      }
    }

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-8 L-3,-8 L0,-12 L3,-8 L1,-8 L1,0 L-1,0';
    }

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    var dataArrow = [];
    for (var i = 0; i < num; i++) {
      dataArrow[i] = echarts.util.map(tableData[i], function (entry) {
        return [entry.lev, entry.veloc / 1000, entry.u, entry.v, entry.dt];
      });
    }


    var x = [];
    x[0] = 90;
    for (var i = 1; i < num; i++) {
      x[i] = x[i - 1] + 240;
    }

    var xAxis = [];
    for (var i = 0; i < num; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 0,
        max: 2,
        interval: 0.4,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < num; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "水深(m)",
        nameLocation: 'middle',
        nameGap: '25',
        type: 'value',
        min: 0,
        max: 50,
        splitNumber: 5,
        inverse: true,
        //show:false,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < num; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6
      };
      series.push(seriesTemp2);
    }

    var grid = [];
    for (var i = 0; i < num; i++) {
      var gridTemp = {
        x: x[i], y: 20, width: 180,
      }
      grid.push(gridTemp);
    }

    var titleTempText = [];
    for (var i = 0; i < num; i++) {
      titleTempText[i] = util.formatDateTime(new Date(tableData[i][1].dt));
    }

    var title = [];
    for (var i = 0; i < num; i++) {
      var titleTemp = {
        text: titleTempText[i],
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i] + 20,
        y: 0,
      };
      title.push(titleTemp);
    }

    var yAxisIndex = [];
    for (var i = 0; i < num; i++) {
      yAxisIndex.push(i);
    }

    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[0] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + util.formatDateTime(new Date(params.value[4]))
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[1] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + util.formatDateTime(new Date(params.value[4]))
              ].join('<br>');
            }

          }
        },
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: yAxisIndex,//如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%',
            x: 10
          },
        ]
      }
    ;
    chart.setOption(option);
  },

  /**
   * 预报监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawForecastAllMonitorVelocDir(tableData, chart, minDate, maxDate) {


    var num = tableData.length;

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableData[i].length; j++) {
        tableDataAll[i][j] = [tableData[i][j].dt, tableData[i][j].veloc / 1000, tableData[i][j].u, tableData[i][j].v, tableData[i][j].lev];
      }
    }

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-8 L-3,-8 L0,-12 L3,-8 L1,-8 L1,0 L-1,0';
    }

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    var dataArrow = [];
    for (var i = 0; i < num; i++) {
      dataArrow[i] = echarts.util.map(tableData[i], function (entry) {
        return [entry.veloc / 1000, entry.dt, entry.u, entry.v, entry.lev,];
      });
    }


    var x = [];
    var y = [];
    x[0] = 100;
    y[0] = 15;

    x[1] = 650;
    y[1] = 15;

    x[2] = 100;
    y[2] = 195;

    x[3] = 650;
    y[3] = 195;

    x[4] = 100;
    y[4] = 375;

    x[5] = 650;
    y[5] = 375;

    x[6] = 100;
    y[6] = 555;

    x[7] = 650;
    y[7] = 555;


    var xAxis = [];
    for (var i = 0; i < num; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "时间",
        nameLocation: 'middle',
        nameGap: '35',
        type: 'time',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        // min: minDate,//tableData[0].dt
        // max: maxDate,
        splitNumber: 12,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < num; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        min: 0,
        max: 2,
        interval: 0.4,
        //show:false,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < num; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6
      };
      series.push(seriesTemp2);
    }

    var grid = [];
    for (var i = 0; i < num; i++) {
      var gridTemp = {
        x: x[i], y: y[i], width: 500, height: 120
      }
      grid.push(gridTemp);
    }

    var titleTempText = [];
    for (var i = 0; i < num; i++) {
      //titleTempText[i] = formatDateTime(new Date(tableData[i][1].dt));
      titleTempText[i] = tableData[i][1].lev;
    }

    var title = [];
    for (var i = 0; i < num; i++) {
      var titleTemp = {
        text: 'H:-' + titleTempText[i] + 'm',
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i] + 450,
        y: y[i] - 20,
      };
      title.push(titleTemp);
    }

    var yAxisIndex = [];
    for (var i = 0; i < num; i++) {
      yAxisIndex.push(i);
    }

    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + util.formatDateTime(new Date(params.value[1]))
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + util.formatDateTime(new Date(params.value[0]))
              ].join('<br>');
            }

          }
        },
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: yAxisIndex,//如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%',
            x: 10
          },
        ]
      }
    ;
    chart.setOption(option);
  },

}
