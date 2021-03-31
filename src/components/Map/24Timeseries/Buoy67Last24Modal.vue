<template>
  <modal width="760"
         v-model="buoy67_last24_modal"
         title="6号浮标最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-scrollbar wrap-class="list">
      <el-form :inline="true" :model="buoy67Last24Form" class="demo-form-inline" style="margin-left: 40px;">
        <el-form-item label="海流层级">
          <el-select size="mini" v-model="buoy67Last24Form.level" style="width:450px" multiple placeholder="请选择层级">
            <el-option
              v-for="item in buoy67Last24Form.levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="queryBuoy67CurrentLevelLast24Data" type="primary" plain>查询</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <div id="buoy67CurrentFlowVChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy67WaveWHChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy67WaveWHTChartDIV" :style="{width: '650px', height: '300px'}"></div>
      </el-row>
      <el-row>
        <div id="buoy67CtdChartDIV" :style="{width: '700px', height: '300px'}"></div>
      </el-row>
    </el-scrollbar>
  </modal>
</template>

<script>
import drawCharts from "../../../util/drawCharts.js"

export default {
  name: "Buoy67Last24Modal",
  data() {
    return {
      buoyId: 6,
      labelTemp: '10m平均',
      buoy67_last24_modal: false,
      buoy67Last24Form: {
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
      buoy67CurrentFlowVChart: null,
      buoy67CtdChart: null,
      buoy67WaveWHChart: null,
      buoy67WaveWHTChart: null,
    }
  },
  methods: {
    openBuoy67Last24Modal(id) {
      this.buoyId = id;
      this.buoy67_last24_modal = true;

      this.buoy67CurrentFlowVChart = this.$echarts.init(document.getElementById('buoy67CurrentFlowVChartDIV'));
      this.buoy67WaveWHChart = this.$echarts.init(document.getElementById('buoy67WaveWHChartDIV'));
      this.buoy67WaveWHTChart = this.$echarts.init(document.getElementById('buoy67WaveWHTChartDIV'));
      this.buoy67CtdChart = this.$echarts.init(document.getElementById('buoy67CtdChartDIV'));
      this.buoy67CurrentFlowVChart.clear();
      this.buoy67WaveWHChart.clear();
      this.buoy67CtdChart.clear();
      this.buoy67WaveWHTChart.clear();

      //请求最近24小时数据并绘图
      this.queryBuoy67Last24Data(id);
    },
    queryBuoy67Last24Data(id) {
      var api = `/api/SZTDService/queryBuoy67Last24.action?id=${id}`;
      this.$axios.get(api).then((response) => {
        var tableData = response.data;

        if (tableData.buoywvList != null) {
          drawCharts.drawWaveAllWH(tableData.buoywvList, this.buoy67WaveWHChart);
          drawCharts.drawWaveAllWHT(tableData.buoywvList, this.buoy67WaveWHTChart);
        }
        if (tableData.topCtdList != null && tableData.bottomCtdList != null) {
          drawCharts.drawCTDChart(tableData.topCtdList, tableData.bottomCtdList, this.buoy67CtdChart);
        }

        if (tableData.fubList != null) {
          for (var i = 0; i < this.buoy67Last24Form.level.length; i++) {
            if (tableData.fubList[this.buoy67Last24Form.level[i]].length == 0) {
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return null;
            }
          }
          this.buoy67CurrentFlowVChart.clear();
          drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy67Last24Form.level, this.labelTemp, this.buoy67CurrentFlowVChart);
        } else
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
    queryBuoy67CurrentLevelLast24Data() {
      var api = `/api/SZTDService/queryBuoy67Last24.action?id=${this.buoyId}`;
      this.$axios.get(api).then((response) => {
        var tableData = response.data;
        if (tableData.fubList != null) {
          for (var i = 0; i < this.buoy67Last24Form.level.length; i++) {
            if (tableData.fubList[this.buoy67Last24Form.level[i]].length == 0) {
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
              return null;
            }
          }
          this.buoy67CurrentFlowVChart.clear();
          drawCharts.drawCurrentFlowV(tableData.fubList, this.buoy67Last24Form.level, this.labelTemp, this.buoy67CurrentFlowVChart);
        } else
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
