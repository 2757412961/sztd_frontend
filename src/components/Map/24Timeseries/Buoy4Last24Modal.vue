<template>
  <modal width="760"
         v-model="buoy4_last24_modal"
         title="4号浮标最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-scrollbar wrap-class="list">
      <el-form :inline="true" :model="buoy4Last24Form" class="demo-form-inline" style="margin-left: 40px;">
        <el-form-item label="海流层级">
          <el-select size="mini" v-model="buoy4Last24Form.level" style="width:450px" multiple placeholder="请选择层级">
            <el-option
              v-for="item in buoy4Last24Form.levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button size="mini" @click="queryBuoy4CurrentLevelLast24Data" type="primary" plain>查询</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <div id="buoy4CurrentFlowVChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy4CtdChartDIV" :style="{width: '700px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy4WaveWHChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy4WaveWHTChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
    </el-scrollbar>
  </modal>
</template>

<script>
  import drawCharts from "../../../util/drawCharts.js"

  export default {
    name: "Buoy4Last24Modal",
    data() {
      return {
        labelTemp:'10m平均',
        buoy4_last24_modal: false,
        buoy4Last24Form: {
          level: [0],
          levelList: [
            {
              value: 0,
              label: '10m平均'
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
        buoy4CurrentFlowVChart: null,
        buoy4CtdChart: null,
        buoy4WaveWHChart: null,
        buoy4WaveWHTChart: null,
      }
    },
    methods: {
      openBuoy4Last24Modal(id) {
        this.buoy4_last24_modal = true;

        this.buoy4CurrentFlowVChart = this.$echarts.init(document.getElementById('buoy4CurrentFlowVChartDIV'));
        this.buoy4CtdChart = this.$echarts.init(document.getElementById('buoy4CtdChartDIV'));
        this.buoy4WaveWHChart = this.$echarts.init(document.getElementById('buoy4WaveWHChartDIV'));
        this.buoy4WaveWHTChart = this.$echarts.init(document.getElementById('buoy4WaveWHTChartDIV'));
        this.buoy4CurrentFlowVChart.clear();
        this.buoy4CtdChart.clear();
        this.buoy4WaveWHChart.clear();
        this.buoy4WaveWHTChart.clear();

        //请求最近24小时数据并绘图
        this.queryBuoy4Last24Data(id);
      },
      queryBuoy4Last24Data(id) {
        var api = `/api/SZTDService/queryBuoy4Last24.action?id=${id}`;
        this.$axios.get(api).then((response) => {
          var tableData=response.data;

          if (tableData.buoywvList != null) {
            drawCharts.drawWaveAllWH(tableData.buoywvList, this.buoy4WaveWHChart);
            drawCharts.drawWaveAllWHT(tableData.buoywvList, this.buoy4WaveWHTChart);
          }
          if (tableData.topCtdList != null && tableData.bottomCtdList != null) {
            drawCharts.drawCTDChart(tableData.topCtdList, tableData.bottomCtdList, this.buoy4CtdChart);
          }

          if(tableData.fubList != null)
          {
            for(var i=0;i<this.buoy4Last24Form.level.length;i++)
            {
              if(tableData.fubList[this.buoy4Last24Form.level[i]].length==0)
              {
                this.$confirm('没有相关数据！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
                return null;
              }
            }
            this.buoy4CurrentFlowVChart.clear();
            drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy4Last24Form.level, this.labelTemp, this.buoy4CurrentFlowVChart);
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
      queryBuoy4CurrentLevelLast24Data() {
        var api = `/api/SZTDService/queryBuoy4Last24.action?id=${4}`;
        this.$axios.get(api).then((response) => {
          var tableData=response.data;
          if(tableData.fubList != null)
          {
            for(var i=0;i<this.buoy4Last24Form.level.length;i++)
            {
              if(tableData.fubList[this.buoy4Last24Form.level[i]].length==0)
              {
                this.$confirm('没有相关数据！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
                return null;
              }
            }
            this.buoy4CurrentFlowVChart.clear();
            drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy4Last24Form.level, this.labelTemp, this.buoy4CurrentFlowVChart);
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
