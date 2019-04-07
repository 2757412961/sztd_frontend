<template>
  <modal width="230"
         v-model="weather_pro_modal"
         title="大气数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-form :inline="true"  :model="weatherProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="weatherProForm.stDate" placeholder="选择日期" style="width: 120px"></DatePicker>
      </el-form-item>
      <el-form-item label="预报时次">
        <el-select v-model="weatherProForm.preTime" placeholder="选择预报时次" style="width: 120px">
          <el-option
            v-for="item in weatherProForm.preTimeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="垂直高度">
        <el-select v-model="weatherProForm.verticalLayer" placeholder="选择垂直层" style="width: 120px" @change="changeCBDisable">
          <el-option label="海平面" value="surface"></el-option>
          <el-option label="500hPa" value="500hpa"></el-option>
          <el-option label="200hPa" value="200hpa"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值产品">
          <el-checkbox-group v-model="weatherProForm.proList">
            <el-checkbox label="气压场" style="margin-left: 10px;" :disabled="cb_dis.press"></el-checkbox>
            <el-checkbox label="10m风场" :disabled="cb_dis.tenWind"></el-checkbox>
            <el-checkbox label="6h累计降水" style="margin-left: 10px;" :disabled="cb_dis.rain"></el-checkbox>
            <el-checkbox label="风场" :disabled="cb_dis.wind"></el-checkbox>
            <el-checkbox label="高度场" style="margin-left: 10px;" :disabled="cb_dis.height"></el-checkbox>
            <el-checkbox label="温度场"  :disabled="cb_dis.temp"></el-checkbox>

          </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:180px;margin-left: 10px;"
          @click="loadWeatherProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
      name: "weatherProModal",
      data(){
        return {
          weather_pro_modal:false,
          loadStatus:false,
          cb_dis:{
            press:true,
            tenWind:true,
            rain:true,
            height:true,
            temp:true,
            wind:true
          },
          weatherProForm:{
            stDate:null,
            preTime:'',
            preTimeList:[0,1,2],
            verticalLayer:'',
            proList:[]
          },

        }
      },
      methods:{
        openWeatherProModal(){
          this.weather_pro_modal=true;
        },
        changeCBDisable(){
          this.cb_dis.press=true;
          this.cb_dis.tenWind=true;
          this.cb_dis.rain=true;
          this.cb_dis.height=true;
          this.cb_dis.temp=true;
          this.cb_dis.wind=true;
          switch(this.weatherProForm.verticalLayer){
            case 'surface':
              this.cb_dis.press=false;
              this.cb_dis.tenWind=false;
              this.cb_dis.rain=false;
              break;
            case '200hpa':
              this.cb_dis.wind=false;
              break;
            case '500hpa':
              this.cb_dis.height=false;
              this.cb_dis.temp=false;
              this.cb_dis.wind=false;
              break;
          }
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
        loadWeatherProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          //起报时间字符串，20为起报时间的北京时;
          var stDateStr=this.weatherProForm.stDate.getFullYear()+this.num2Str(this.weatherProForm.stDate.getMonth()+1)+this.num2Str(this.weatherProForm.stDate.getDate())+ "20";
          var url=`/proapi/sztdMatlab/sztd_atm_output/`+stDateStr+`/`;//"http://"+this.$store.state.serverIP+"/sztdMatlab/";
          var extent=this.$store.state.atmExtent;
          switch(this.weatherProForm.verticalLayer){
            case "surface":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="气压场"){
                  //气压等值线图
                  var pressUrl=url+"Atm_10mSLP_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map', pressUrl, extent);
                }
                if(this.weatherProForm.proList[i]=="10m风场"){
                  //风向图（风向标）
                  var windUrl1=url+"Atm_10mWindVane_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map',windUrl1,extent);
                  //风力填色图
                  var windUrl2=url+"Atm_10mWindU10V10_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',windUrl2,extent);
                }
                if(this.weatherProForm.proList[i]=="6h累计降水"){
                  //近六小时累积降水图
                  var rainUrl=url+"Atm_RaincRainnc_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',rainUrl,extent);
                }
              }
              break;
            case "500hpa":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="风场"){
                  var windUrl1=url+"Atm_500hPaWindUUVV_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map',windUrl1,extent);
                  var windUrl2=url+"Atm_500hPaWindVane_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map',windUrl2,extent);
                }
                if(this.weatherProForm.proList[i]=="高度场"){
                  var GHTUrl=url+"Atm_500hPaGHT_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map',GHTUrl,extent);
                }
                if(this.weatherProForm.proList[i]=="温度场"){
                  var tempUrl=url+"Atm_500hPaTT_"+this.weatherProForm.preTime+"_"+stDateStr+"_L5.png";
                  this.$emit('addPic2map',tempUrl,extent);
                }
              }
              break;
            case "200hpa":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="风场"){
                  var windUrl=url+"Atm_200hPaWindUUVV_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',windUrl,extent);
                }
              }
              break;

          }

        }
      }
    }
</script>

<style scoped>

</style>
