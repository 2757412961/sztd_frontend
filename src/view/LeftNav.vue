<template>
  <el-menu
    @mouseenter.native="collapseOpen"
    @mouseleave.native="collapseClose"
    @select="selectMenu"
    class="el-menu-vertical-demo"
    :collapse="isCollapse">

    <el-submenu index="observation">
      <template slot="title">
        <i class="el-icon-search"></i>
        <span slot="title">实时观测数据</span>
      </template>
      <el-menu-item index="buoyCurrentObservation" style="padding-left:60px">浮标海流观测</el-menu-item>
      <el-menu-item index="buoyWaveObservation" style="padding-left:60px">浮标海浪观测</el-menu-item>
      <el-menu-item index="densityObservation" style="padding-left:60px">密度观测</el-menu-item>
      <el-menu-item index="seaLevelObservation" style="padding-left:60px">潮位观测</el-menu-item>
      <el-menu-item index="weatherSiteObservation" style="padding-left:60px">气象站</el-menu-item>
    </el-submenu>
    <el-menu-item index="predictPaper">
      <i class="el-icon-document"></i>
      <span slot="title">综合预报单</span>
    </el-menu-item>
    <el-submenu index="production">
      <template slot="title">
        <i class="el-icon-picture-outline"></i>
        <span slot="title">数值预报</span>
      </template>
      <el-menu-item index="weatherProduction" style="padding-left:60px">气象数值预报</el-menu-item>
      <el-menu-item index="waveProduction" style="padding-left:60px">海浪数值预报</el-menu-item>
      <el-menu-item index="refineWeatherProduction" style="padding-left:60px">精细化气象数值预报</el-menu-item>
      <el-menu-item index="refineWaveProduction" style="padding-left:60px">精细化海浪数值预报</el-menu-item>
      <el-menu-item index="refineCurrentProduction" style="padding-left:60px">精细化海流数值预报</el-menu-item>
      <!--el-menu-item index="tideProduction" style="padding-left:60px">潮汐数值预报</el-menu-item-->
    </el-submenu>
    <!--<el-submenu index="monitor">-->
      <!--<template slot="title">-->
        <!--<i class="el-icon-date"></i>-->
        <!--<span slot="title">现场监测</span>-->
      <!--</template>-->
      <!--<el-menu-item index="realTimeMonitor" style="padding-left:60px">最新观测数据</el-menu-item>-->
      <!--<el-menu-item index="historyMonitor" style="padding-left:60px">历史观测数据</el-menu-item>-->
      <!--&lt;!&ndash;<el-menu-item index="forecastAllMonitor" style="padding-left:60px">预报数据全深度查询</el-menu-item>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-menu-item index="forecastSingleMonitor" style="padding-left:60px">预报数据单深度查询</el-menu-item>&ndash;&gt;-->
    <!--</el-submenu>-->
    <!--<el-menu-item index="strongConvection">-->
      <!--<i class="el-icon-setting"></i>-->
      <!--<span slot="title">强对流</span>-->
    <!--</el-menu-item&ndash;&gt;-->
  </el-menu>
</template>

<script>
    export default {
      name: "LeftNav",
      data() {
        return {
          isCollapse: true
        };
      },
      methods: {
        collapseOpen() {
          this.isCollapse = false;
        },
        collapseClose() {
          this.isCollapse = true;
        },
        selectMenu(key){
          this.$emit('openModal',key);
        }
      },
    }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
</style>
