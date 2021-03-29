<template>
  <modal width="700"
         v-model="buoy123_last24_modal"
         :title=title
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-scrollbar wrap-class="list">
      <el-form :inline="true" :model="buoy123Last24Form" class="demo-form-inline"
               style="margin-left: 50px;line-height:10px;">
        <el-form-item label="海流层级">
          <el-select size="mini" v-model="buoy123Last24Form.level" style="width:350px"
                     multiple placeholder="请选择层级">
            <el-option
              v-for="item in buoy123Last24Form.levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="queryBuoy123CurrentLevelLast24Data" type="primary" plain>查询</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <div id="buoy123CurrentFlowVChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy123WaveWHChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy123WaveWHTChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
    </el-scrollbar>
    <!--<el-row>-->
    <!--<el-col :span="12">-->
    <!--<div id="buoy123CurrentFlowVChartDIV" :style="{width: '550px', height: '210px'}"></div>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <!--<el-row :style="{marginTop: '15px'}">-->
    <!--<el-col :span="12">-->
    <!--<div id="buoy123WaveWHChartDIV" :style="{width: '550px', height: '210px'}"></div>-->
    <!--</el-col>-->
    <!--<el-col :span="12">-->
    <!--<div id="buoy123WaveWHTChartDIV" :style="{width: '550px', height: '210px'}"></div>-->
    <!--</el-col>-->
    <!--</el-row>-->
  </modal>

</template>

<script>
  import drawCharts from "../../../util/drawCharts.js"

  export default {
    name: "Buoy123Last24Modal",
    data() {
      return {
        title: "",
        buoy123_last24_modal: false,
        labelTemp: '10m平均',
        buoy123Last24Form: {
          level:  [0],
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
        buoy123CurrentFlowVChart: null,
        buoy123WaveWHChart: null,
        buoy123WaveWHTChart: null,
        buoyId: null,
        queryStatus: false,
      }
    },
    methods: {
      openBuoy123Last24Modal(id) {
        this.buoy123_last24_modal = true;
        this.buoyId = id;

        this.labelTemp = this.buoyId == 1 ? '垂直平均流' : '10m平均';
        this.title = this.buoyId.toString() + "号浮标最近24小时数据时间序列图";

        this.buoy123CurrentFlowVChart = this.$echarts.init(document.getElementById('buoy123CurrentFlowVChartDIV'));
        this.buoy123WaveWHChart = this.$echarts.init(document.getElementById('buoy123WaveWHChartDIV'));
        this.buoy123WaveWHTChart = this.$echarts.init(document.getElementById('buoy123WaveWHTChartDIV'));
        this.buoy123CurrentFlowVChart.clear();
        this.buoy123WaveWHChart.clear();
        this.buoy123WaveWHTChart.clear();

        //请求最近24小时数据并绘图
        this.queryBuoy123Last24Data();
      },
      queryBuoy123Last24Data() {
        this.buoy123CurrentFlowVChart.clear();
        this.buoy123WaveWHChart.clear();
        this.buoy123WaveWHTChart.clear();
        this.queryStatus = true;
        var api = `/api/SZTDService/queryBuoy123Last24.action`;
        this.$axios.get(api, {
          params: {
            id: this.buoyId,
          }
        }).then((response) => {
          var tableData=response.data;
          if (tableData.buoywvList != null) {
            drawCharts.drawWaveAllWH(tableData.buoywvList, this.buoy123WaveWHChart);
            drawCharts.drawWaveAllWHT(tableData.buoywvList, this.buoy123WaveWHTChart);
          }
          else
            this.$confirm('没有相关数据！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });

          if(tableData.fubList != null)
          {
            for(var i=0;i<this.buoy123Last24Form.level.length;i++)
            {
              if(tableData.fubList[this.buoy123Last24Form.level[i]].length==0)
              {
                this.$confirm('没有相关数据！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
                return null;
              }
            }
            drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy123Last24Form.level, this.labelTemp, this.buoy123CurrentFlowVChart);
          }
          else
            this.$confirm('没有相关数据！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
        }).catch((response) => {
          //失败回调
          this.$confirm('服务器失联！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }).finally((response) => {
          this.queryStatus = false;
        })
      }
      ,
      queryBuoy123CurrentLevelLast24Data() {
        var api = `/api/SZTDService/queryBuoy123Last24.action?`;
        this.$axios.get(api, {
          params: {
            id: this.buoyId,
          }
        }).then((response) => {
          var tableData=response.data;
          if(tableData.fubList != null)
          {
            for(var i=0;i<this.buoy123Last24Form.level.length;i++)
            {
              if(tableData.fubList[this.buoy123Last24Form.level[i]].length==0)
              {
                this.$confirm('没有相关数据！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
                return null;
              }
            }
            this.buoy123CurrentFlowVChart.clear();
            drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy123Last24Form.level, this.labelTemp, this.buoy123CurrentFlowVChart);
          }
          else
            this.$confirm('没有相关数据！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
        }).catch((response) => {
          //失败回调
          this.$confirm('服务器失联！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }).finally((response) => {

        })
      },

    }
  }
</script>

<style>

  /*展示列表的区域，超过200px出现滚动条*/
  .list {
    max-height: 630px;
  }

</style>
