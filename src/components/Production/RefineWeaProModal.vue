<template>
  <modal width="230"
         v-model="refine_wea_pro_modal"
         title="精细化大气数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="refineWeaProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="refineWeaProForm.stDate" placeholder="选择日期"  style="width: 120px"></DatePicker>
      </el-form-item>
      <el-form-item label="预报时次">
        <el-select v-model="refineWeaProForm.preTime" placeholder="选择预报时次" style="width: 120px">
          <el-option
            v-for="item in refineWeaProForm.preTimeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值产品">
        <el-checkbox-group v-model="refineWeaProForm.proList">
          <el-checkbox label="气压场" style="margin-left: 10px;"></el-checkbox>
          <el-checkbox label="10m风场" style="margin-right: 0;"></el-checkbox>
          <el-checkbox label="降水量" style="margin-left: 10px;"></el-checkbox>

        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:180px;margin-left: 10px;"
          @click="loadRefineWeaProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
        name: "RefineWeaProModal",
      data(){
        return {
          refine_wea_pro_modal:false,
          loadStatus:false,
          refineWeaProForm:{
            stDate:null,
            preTime:'',
            preTimeList: Array.apply(null, Array(169)).map(function(item, i) {return i}),
            proList:[]
          },
        }
      },
      methods: {
        /**
         * 打开精细化气象数值预报模态框
         */
        openRefineWeaProModal() {
          //TODO 后台组织默认日期
          var api = `/api/SZTDService/queryAtmRefineProNew.action`;
          this.$axios.get(api).then((response) => {
            if (response.data != "") {
              this.refineWeaProForm.stDate = new Date(response.data);
            }
            this.refine_wea_pro_modal = true;
          }).catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response) => {

          })
          // this.refine_wea_pro_modal=true;
        },
        /**
         * 关闭模态框，请出地图上的数值产品
         */
        closeModal() {
          this.$emit('cleanMapPro');
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
        /**
         * 在地图上加载精细化大气数值预报产品
         */
        loadRefineWeaProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          var stDateStr=this.refineWeaProForm.stDate.getFullYear()+this.num2Str(this.refineWeaProForm.stDate.getMonth()+1)+this.num2Str(this.refineWeaProForm.stDate.getDate())+ "20";
          var url=`/proapi/sztd_data_matlab/atmRefine/`+stDateStr+`/`;;
          var extent=this.$store.state.atmRefineExtent;
          for(var i=0;i<this.refineWeaProForm.proList.length;i++){
            if(this.refineWeaProForm.proList[i]=="气压场"){
              //气压等值线图
              var pressUrl=url+"AtmRefine_10mSLP_"+this.refineWeaProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map', pressUrl, extent);
            }
            if(this.refineWeaProForm.proList[i]=="10m风场"){
              //风力填色图
              var windUrl2=url+"AtmRefine_10mWindU10V10_"+this.refineWeaProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',windUrl2,extent);
              //风向图（风向标）
              var windUrl1=url+"AtmRefine_10mWindVane_"+this.refineWeaProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map',windUrl1,extent);
            }
            if(this.refineWeaProForm.proList[i]=="降水量"){
              //降水量
              var rainUrl=url+"AtmRefine_Rainnc_"+this.refineWeaProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',rainUrl,extent);
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
