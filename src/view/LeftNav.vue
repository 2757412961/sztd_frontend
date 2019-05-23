<template>
  <el-menu
    @mouseenter.native="collapseOpen"
    @mouseleave.native="collapseClose"
    @select="selectMenu"
    class="el-menu-vertical-demo"
    :collapse="isCollapse">

    <el-submenu index="observation">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">实时观测数据</span>
      </template>
      <el-menu-item index="buoyCurrentObservation" style="padding-left:60px">浮标海流观测</el-menu-item>
      <el-menu-item index="buoyWaveObservation" style="padding-left:60px">浮标海浪观测</el-menu-item>
      <el-menu-item index="densityObservation" style="padding-left:60px">密度观测</el-menu-item>
      <el-menu-item index="seaLevelObservation" style="padding-left:60px">潮位观测</el-menu-item>
      <el-menu-item index="weatherBase" style="padding-left:60px">气象站</el-menu-item>
    </el-submenu>
    <el-menu-item index="predictPaper">
      <i class="el-icon-document"></i>
      <span slot="title">综合预报单</span>
    </el-menu-item>
    <el-submenu index="production">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">数值预报</span>
      </template>
      <el-menu-item index="weatherProduction" style="padding-left:60px">气象数值预报</el-menu-item>
      <el-menu-item index="refineWeatherProduction" style="padding-left:60px">精细化气象预报</el-menu-item>
      <el-menu-item index="waveProduction" style="padding-left:60px">海浪数值预报</el-menu-item>
      <el-menu-item index="currentProduction" style="padding-left:60px">海流数值预报</el-menu-item>
      <!--el-menu-item index="tideProduction" style="padding-left:60px">潮汐数值预报</el-menu-item-->
    </el-submenu>
    <!--el-menu-item index="buoyHistory">
      <i class="el-icon-setting"></i>
      <span slot="title">现场实时监测</span>
    </el-menu-item>
    <el-menu-item index="strongConvection">
      <i class="el-icon-setting"></i>
      <span slot="title">强对流</span>
    </el-menu-item-->
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
