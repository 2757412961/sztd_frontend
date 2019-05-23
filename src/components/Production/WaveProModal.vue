<template>
  <modal width="230"
         v-model="wave_pro_modal"
         title="海浪数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="waveProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="waveProForm.stDate" placeholder="选择日期" style="width: 120px"></DatePicker>
      </el-form-item>
      <el-form-item label="预报时次">
        <el-select v-model="waveProForm.preTime" placeholder="选择预报时次" style="width: 120px">
          <el-option
            v-for="item in waveProForm.preTimeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值产品">
        <el-checkbox-group v-model="waveProForm.proList">
          <el-checkbox label="有效波高" style="margin-left: 10px;" ></el-checkbox>
          <el-checkbox label="浪向" style="margin-right: 0;"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:180px;margin-left: 10px;"
          @click="loadWaveProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
      name: "waveProModal",
      data(){
          return{
            wave_pro_modal:false,
            loadStatus:false,
            waveProForm:{
              stDate:null,
              preTime:null,
              preTimeList:Array.apply(null, Array(120)).map(function(item, i) {return i}),
              proList:[],
            }
          }
      },
      methods:{
        openWaveProModal(){
          var api=`/api/SZTDService/queryWaveProNew.action`;
          this.$axios.get(api).then((response)=> {
            if(response.data!="") {
              //TODO 组织默认日期
              this.waveProForm.stDate = new Date(response.data);
            }
            this.wave_pro_modal=true;
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })

        },
        closeModal(){
          this.$emit('cleanMapPro');
        },
        loadWaveProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          var stDateStr=this.waveProForm.stDate.getFullYear()+this.num2Str(this.waveProForm.stDate.getMonth()+1)+this.num2Str(this.waveProForm.stDate.getDate());
          var url=`/proapi/sztd_data_matlab/wave/`;
          var extent=this.$store.state.waveExtent;
          for(var i=0;i<this.waveProForm.proList.length;i++){
            if(this.waveProForm.proList[i]=="有效波高"){
              //波高填色图
              var pressUrl=url+"HS/"+stDateStr+"/Wave_HS_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', pressUrl, extent);
            }
            if(this.waveProForm.proList[i]=="浪向"){
               var pressUrl=url+"DIR/"+stDateStr+"/Wave_DIR_"+this.waveProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map', pressUrl, extent);
            }
          }
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
      }
    }
</script>

<style scoped>

</style>
