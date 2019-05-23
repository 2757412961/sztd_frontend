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
          <map-layout ref="mapLayout" @drawWindTimeSeries="drawWindTimeSeries" @drawCurrentTimeSeries="drawCurrentTimeSeries"></map-layout>
      </el-main>
    </el-container>
    <DensityObservationModal ref="densityObservationModal"></DensityObservationModal>
    <SeaLevelObservationModal ref="seaLevelObservationMaodal"></SeaLevelObservationModal>
    <PredictPaperModal ref="predictPaperModal"></PredictPaperModal>
    <WeatherProModal ref="weatherProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WeatherProModal>
    <RefineWeaProModal ref="refineWeaProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></RefineWeaProModal>
    <WaveProModal ref="waveProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WaveProModal>
    <CurrentProModal ref="currentProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></CurrentProModal>
    <WindTimeSeriesModal ref="windTimeSeriesModal"></WindTimeSeriesModal>
    <CurrentTimeSeriesModal ref="currentTimeSeriesModal"></CurrentTimeSeriesModal>
    <ReWindTimeSeriesModal ref="reWindTimeSeriesModal"></ReWindTimeSeriesModal>
  </el-container>
</template>


<script>
    import MapLayout from "./MapLayout";
    import HeadNav from "./HeadNav";
    import LeftNav from "./LeftNav";
    import PredictPaperModal from "../components/PredictPaperModal";
    import WeatherProModal from "../components/Production/WeatherProModal";
    import WaveProModal from "../components/Production/WaveProModal";
    import WindTimeSeriesModal from "../components/WindTimeSeriesModal";
    import DensityObservationModal from "../components/Observation/DensityObservationModal";
    import SeaLevelObservationModal from "../components/Observation/SeaLevelObservationModal";
    import RefineWeaProModal from "../components/Production/RefineWeaProModal";
    import CurrentProModal from "../components/Production/CurrentProModal";
    import CurrentTimeSeriesModal from "../components/CurrentTimeSeriesModal";
    import ReWindTimeSeriesModal from "../components/ReWindTimeSeriesModal";
    export default {
      name: "home",
      components: {
        ReWindTimeSeriesModal,
        CurrentTimeSeriesModal,
        CurrentProModal,
        RefineWeaProModal,
        SeaLevelObservationModal,
        DensityObservationModal,
        WindTimeSeriesModal,
        WaveProModal,
        WeatherProModal, PredictPaperModal, LeftNav, HeadNav, MapLayout,HeadNav},
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
            case "refineWeatherProduction":
              this.$refs.refineWeaProModal.openRefineWeaProModal();
              break;
            case "waveProduction":
              this.$refs.waveProModal.openWaveProModal();
              break;
            case "currentProduction":
              this.$refs.currentProModal.openCurrentProModal();
              break;

            case "buoyHistory":
              break;
          }
        },
        drawWindTimeSeries(key,strDate,lonlat){
          switch(key){
            case "10mWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("10m",strDate,lonlat);
              break;
            case "500hpaWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("500hpa",strDate,lonlat);
              break;
            case "200hpaWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("200hpa",strDate,lonlat);
              break;
            case "refine10mWindTimeSeries":
              this.$refs.reWindTimeSeriesModal.openReWindTimeSeriesModal(strDate,lonlat);
              break;

          }
        },
        drawCurrentTimeSeries(siglay,strDate,lonlat){
          this.$refs.currentTimeSeriesModal.openCurrentTimeSeriesModal(siglay,strDate,lonlat);
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
