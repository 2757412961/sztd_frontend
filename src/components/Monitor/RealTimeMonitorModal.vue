<template>
  <modal
    width="1230"
    v-model="real_time_monitor_modal"
    title="各站点最新时刻水深-流速曲线图"
    :mask-closable="false"
    :draggable="true"
    :footer-hide="true"
    style="text-align:center;margin-top:0;line-height:2;font-size:200%;font-weight:bold;"
    class="monitor_modal">
    <el-row>
      <el-col :span="24">
        <div id="allRealTimeMonitorChart" :style="{width: '1300px', height: '600px'}"></div>
      </el-col>
    </el-row>
  </Modal>
</template>

<script>
  import drawCharts from "../../util/drawCharts"

  export default {
    name: "RealTimeMonitorModal",
    data() {
      return {
        real_time_monitor_modal: false,
        chart: "",
        queryStatus: false
      }
    },
    mounted() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      else {
        this.timer = setInterval(() => {
          this.queryRealTimeMonitor();
        }, 5 * 60 * 1000);//轮询5分钟更新一次
      }
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      openRealTimeMonitorModal() {
        this.real_time_monitor_modal = true;
        this.chart = this.$echarts.init(document.getElementById('allRealTimeMonitorChart'));
        this.chart.clear();
        this.queryRealTimeMonitor();
      },
      queryRealTimeMonitor() {
        this.chart.clear();
        this.queryStatus = true;
        var api = `/api/SZTDService/queryRealTimeMonitor.action`;
        this.$axios.get(api, {
          params: {
            //id:this.buoyCurrentObsForm.name.substring(4),
          }
        }).then((response) => {
          var tableData = response.data;
          if (tableData.length != 0) {
            drawCharts.drawRealTimeMonitorVelocDir(tableData, this.chart);
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
    }
  }
</script>

<style>

  .monitor_modal .ivu-modal-header {
    border-bottom: 1px solid #e8eaec;
    padding: 6px 2px;
    line-height: 1;
  }

  .monitor_modal .ivu-modal-header .ivu-modal-header-inner{
    display: inline-block;
    width: 100%;
    height: 50%;
    line-height: 1.5;
    font-size: 18px;
    color: #17233d;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


</style>
