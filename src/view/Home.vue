<template>
  <el-container style="height:100%;">
    <!--导航栏-->
    <el-header height="60px" >
      <HeadNav></HeadNav>
    </el-header>
    <!--网页主体-->
    <el-container style="top:60px;bottom:0">
      <!--侧边栏-->
      <!--el-aside width="300px">
        <router-view/>    </el-aside-->
      <el-aside style="width:auto">
        <LeftNav @openModal="openModal"></LeftNav>
      </el-aside>
      <el-main style="padding:0px;margin-left:60px">
          <map-layout ref="mapLayout" @drawTimeSeries="drawTimeSeries"></map-layout>
      </el-main>
    </el-container>
    <DensityObservationModal ref="densityObservationModal"></DensityObservationModal>
    <SeaLevelObservationModal ref="seaLevelObservationMaodal"></SeaLevelObservationModal>
    <SiteHistoryModal ref="siteHistoryModal"></SiteHistoryModal>
    <PredictPaperModal ref="predictPaperModal"></PredictPaperModal>
    <WeatherProModal ref="weatherProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WeatherProModal>
    <WaveProModal ref="waveProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WaveProModal>
    <WindTimeSeriesModal ref="windTimeSeriesModal"></WindTimeSeriesModal>
  </el-container>
</template>


<script>
    import MapLayout from "./MapLayout";
    import HeadNav from "./HeadNav";
    import LeftNav from "./LeftNav";
    import SiteHistoryModal from "../components/SiteHistoryModal";
    import PredictPaperModal from "../components/PredictPaperModal";
    import WeatherProModal from "../components/Production/WeatherProModal";
    import WaveProModal from "../components/Production/WaveProModal";
    import WindTimeSeriesModal from "../components/WindTimeSeriesModal";
    import DensityObservationModal from "../components/Observation/DensityObservationModal";
    import SeaLevelObservationModal from "../components/Observation/SeaLevelObservationModal";
    export default {
      name: "home",
      components: {
        SeaLevelObservationModal,
        DensityObservationModal,
        WindTimeSeriesModal,
        WaveProModal,
        WeatherProModal, PredictPaperModal, SiteHistoryModal, LeftNav, HeadNav, MapLayout,HeadNav},
      created:function(){
        if(this.$store.state.name==""){
          this.$router.push({
            name: 'login'
          })
        }
      },
      watch: {
        // 可以通过watch监听vuex中的text，数据变动时能够执行对应的函数
        '$store.state.name':function(newer, older) { // 可以获取新值与老值两个参数
          if(newer==""){
            this.$router.push({
              name: 'login'
            })
          }
        },
        deep: true // 开启深度监听
      },
      methods:{
        openModal(key){
          switch(key){
            case "densityObservation":
              this.$refs.densityObservationModal.openDensityObservationModal();
              break;
            case "seaLevelObservation":
              this.$refs.seaLevelObservationMaodal.openSeaLevelObservationModal();
              break;
            case "predictPaper":
              this.$refs.predictPaperModal.openPredictPaperModal();
              break;
            case "weatherProduction":
              this.$refs.weatherProModal.openWeatherProModal();
              break;
            case "waveProduction":
              this.$refs.waveProModal.openWaveProModal();
              break;

            case "buoyHistory":
              break;
          }
        },
        drawTimeSeries(key,lonlat){
          switch(key){
            case "WindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal(lonlat);
              break;
          }
        },
        addPic2map(url,extent){
          this.$refs.mapLayout.addPictureToMap(url,extent)
        },
        cleanMapPro(){
          this.$refs.mapLayout.cleanMapPro();
        }
      }
    }
</script>

<style scoped>
  .el-header{
    border-bottom:solid 1px #e6e6e6
  }
  .el-menu-vertical-demo {
    float:left;
    position:absolute;
    z-index:999;
    top:60px;
    bottom:0;
    text-align:left;

  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
  }


</style>
