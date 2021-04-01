<template>
  <div style="position: absolute;bottom:0;top:60px;right:0px;left:60px">
    <div id="tdtmap" style="">
      <div id="popup" class="ol-popup" :style={minWidth:ol_popup_min_width}>
        <div id="popup-title" class="popup-title">{{ popup_title }}</div>
        <div id="popup-content"></div>
      </div>
      <PlatformLast24Modal ref="platformLast24Modal"></PlatformLast24Modal>
      <Site1Last24Modal ref="site1Last24Modal"></Site1Last24Modal>
      <Site2Last24Modal ref="site2Last24Modal"></Site2Last24Modal>
      <Site3Last24Modal ref="site3Last24Modal"></Site3Last24Modal>
      <Buoy123Last24Modal ref="buoy123Last24Modal"></Buoy123Last24Modal>
      <Buoy4Last24Modal ref="buoy4Last24Modal"></Buoy4Last24Modal>
      <Buoy67Last24Modal ref="buoy67Last24Modal"></Buoy67Last24Modal>
    </div>
    <div id="mouse-position" style="position: absolute;right:180px;top:10px;"></div>
    <div id="legend" style="position: absolute;right:0px;bottom:0px;">
      <li v-for="(item,index) in curLegend" :key="index">
        <img id="img_logo" :src="item" slot="icon" style="width:500px">
      </li>
    </div>
    <el-button @click="zoomToSiteLongXueChuanChang"
               type="primary" plain style="position: absolute;right:0px;top:0px;width:150px">龙穴船厂气象站
    </el-button>
    <el-button @click="zoomToSiteXiRenGongDao"
               type="primary" plain style="position: absolute;right:0px;top:40px;width:150px">西人工岛气象站
    </el-button>
    <el-button @click="zoomToSiteGuiShanNiuTouDao"
               type="primary" plain style="position: absolute;right:0px;top:80px;width:150px">桂山牛头岛气象站
    </el-button>
    <el-button @click="zoomToBuoy1" type="success" plain style="position: absolute;right:0px;top:120px;width:150px">
      1号浮标
    </el-button>
    <el-button @click="zoomToBuoy2" type="success" plain style="position: absolute;right:0px;top:160px;width:150px">
      2号浮标
    </el-button>
    <el-button @click="zoomToBuoy3" type="success" plain style="position: absolute;right:0px;top:200px;width:150px">
      3/5号浮标
    </el-button>
    <el-button @click="zoomToBuoy4" type="success" plain style="position: absolute;right:0px;top:240px;width:150px">
      4号浮标
    </el-button>
    <el-button @click="zoomToBuoy6" type="success" plain style="position: absolute;right:0px;top:280px;width:150px">
      1号航标
    </el-button>
    <el-button @click="zoomToPlatformXiDao" type="warning" plain
               style="position: absolute;right:0px;top:320px;width:150px">西人工岛观测站
    </el-button>
    <el-button type="warning" plain style="position: absolute;right:0px;top:360px;width:150px">桂山牛头岛观测站</el-button>
    <!--<div id="buoy-history" style="position: absolute;right:50px;top:40px;">-->
    <!--<el-button icon="el-icon-date" circle @click="showRealTimeMonitorModal"></el-button>-->
    <!--</div>-->
    <div
      :style="{position:'absolute',right:'1px',bottom:'1px',width:'480px',backgroundColor:'ivory',opacity:'0.8',visibility:visibilityRefineWeaProForm}">
      <el-form :inline="true" :model="refineWeaProForm" class="demo-form-inline" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item class='productionTitle' label="精细化大气数值预报产品"
                          style="margin-top: 8px;margin-bottom: 5px;margin-right:40px;">
              <div></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 10px;margin-left:187px;margin-top: 8px;">
              <el-button size="mini" icon="el-icon-close" @click="closeRefineWeaProForm"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="数值产品" style="margin-bottom: 0px;margin-right:35px; font-weight: bold;">
          <el-checkbox-group v-model="refineWeaProForm.proList">
            <el-checkbox label="气压场" style="margin-left:30px;"></el-checkbox>
            <el-checkbox label="风场" style="margin-left:40px;" :disabled="refineWeaProForm.cb_dis.wind"
                         @change="changeCBRainDisableRefineWeaProForm"></el-checkbox>
            <el-checkbox label="降水" style="margin-left: 40px;" :disabled="refineWeaProForm.cb_dis.rain"
                         @change="changeCBWindDisableRefineWeaProForm"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="起报日期" style="margin-bottom: 5px;line-height:40px;margin-left: 5px;font-weight: bold;">
              <DatePicker type="date" v-model="refineWeaProForm.stDate" placeholder="选择日期"
                          style="width: 110px;line-height:42px"></DatePicker>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="预报时间" style="margin-bottom: 5px;line-height:40px; margin-right: 50px;">
              <div style="margin-left: 5px;line-height:42px">{{ refineWeaProFormForecastTime }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预报时次" style="line-height:35px;margin-left: 4px;font-weight: bold;">
              <el-slider v-model="refineWeaProForm.preTime" :marks="refineWeaProForm.marks"
                         @change="loadRefineWeaProToMap"
                         :step="6"
                         style="width: 370px ;line-height:20px" :min="0" :max="168">
                <el-option
                  v-for="item in refineWeaProForm.preTimeList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图例" style="margin-bottom: 2px;margin-left: 18px;font-weight: bold;">
          <img
            style="width:410px; margin-right: 1px;"
            id="imgLegendWea"
            :src="refineWeaProForm.imgLegendUrl"
          >
        </el-form-item>
      </el-form>
    </div>

    <div
      :style="{position:'absolute',right:'1px',bottom:'1px',width:'480px',backgroundColor:'ivory',opacity:'0.8',visibility:visibilityRefineWaveProForm}">
      <el-form :inline="true" :model="refineWaveProForm" class="demo-form-inline" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item class='productionTitle' label="精细化海浪数值预报产品"
                          style="margin-top: 8px;margin-bottom: 5px;margin-right:40px;">
              <div></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 10px;margin-left:187px;margin-top: 8px;">
              <el-button size="mini" icon="el-icon-close" @click="closeRefineWaveProForm"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="数值产品" style="margin-bottom: 0px;margin-right:50px;font-weight: bold;">
          <el-checkbox-group v-model="refineWaveProForm.proList">
            <el-checkbox label="浪向" style="margin-left:30px;"></el-checkbox>
            <el-checkbox label="波高" style="margin-left:40px;" :disabled="refineWaveProForm.cb_dis.wave"
                         @change="changeCBWaveTPSDisableRefineWaveProForm"></el-checkbox>
            <el-checkbox label="周期" style="margin-left: 40px;" :disabled="refineWaveProForm.cb_dis.waveTPS"
                         @change="changeCBWaveDisableRefineWaveProForm"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="起报日期" style="margin-bottom: 5px;line-height:40px;margin-left: 5px;font-weight: bold;">
              <DatePicker type="date" v-model="refineWaveProForm.stDate" placeholder="选择日期"
                          style="width: 110px;line-height:42px"></DatePicker>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="预报时间" style="margin-bottom: 5px;line-height:40px; margin-right: 50px;">
              <div style="margin-left: 5px;line-height:42px">{{ refineWaveProFormForecastTime }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预报时次" style="line-height:35px;margin-left: 4px;font-weight: bold;">
              <el-slider v-model="refineWaveProForm.preTime" :marks="refineWaveProForm.marks"
                         @change="loadRefineWaveProToMap"
                         :step="6"
                         style="width: 370px ;line-height:20px" :min="0" :max="144">
                <el-option
                  v-for="item in refineWaveProForm.preTimeList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图例" style="margin-bottom: 2px;margin-left: 18px;font-weight: bold;">
          <img
            style="width:410px; margin-right: 1px;"
            id="imgLegendWave"
            :src="refineWaveProForm.imgLegendUrl"
          >
        </el-form-item>
      </el-form>
    </div>

    <div
      :style="{position:'absolute',right:'1px',bottom:'1px',width:'520px',backgroundColor:'ivory',opacity:'0.8',visibility:visibilityRefineCurrentProForm}">
      <el-form :inline="true" :model="refineCurrentProForm" class="demo-form-inline" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item class='productionTitle' label="精细化海流数值预报产品"
                          style="margin-top: 8px;margin-bottom: 5px;margin-right:50px;">
              <div></div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-bottom: 10px;margin-left:187px;margin-top: 8px;">
              <el-button size="mini" icon="el-icon-close" @click="closeRefineCurrentProForm"></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="数值产品" style="margin-bottom: 0px;margin-right:15px;font-weight: bold;">
              <el-checkbox-group v-model="refineCurrentProForm.proList">
                <el-checkbox label="水位" style="margin-left:1px;"></el-checkbox>
                <el-checkbox label="流场" style="margin-left:1px;" :disabled="refineCurrentProForm.cb_dis.current"
                             @change="changeCBSalinityDisableRefineCurrentProForm()"></el-checkbox>
                <el-checkbox label="盐度" style="margin-left:1px;" :disabled="refineCurrentProForm.cb_dis.salinity"
                             @change="changeCBCurrentDisableRefineCurrentProForm()"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="垂直层级" style="font-weight: bold;">
              <el-select v-model="refineCurrentProForm.verticalLayer" placeholder="" style="width: 90px"
                         @change="changeVerticalLayer">
                <el-option
                  v-for="item in refineCurrentProForm.verticalLayerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="起报日期" style="margin-bottom: 5px;line-height:40px;font-weight: bold;margin-right: 15px">
              <DatePicker type="date" v-model="refineCurrentProForm.stDate" placeholder="选择日期"
                          style="width: 110px;line-height:42px"></DatePicker>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="预报时间" style="margin-bottom: 5px;line-height:40px; margin-right: 60px">
              <div style="margin-left: 5px;line-height:42px">{{ refineCurrentProFormForecastTime }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="预报时次" style="line-height:35px;margin-right: 5px;font-weight: bold;">
              <el-slider v-model="refineCurrentProForm.preTime" :marks="refineCurrentProForm.marks"
                         @change="loadRefineCurrentProToMap"
                         :step="3"
                         style="width: 400px ;line-height:20px" :min="0" :max="168">
                <el-option
                  v-for="item in refineCurrentProForm.preTimeList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-slider>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图例" style="margin-bottom: 2px;margin-left: 22px;font-weight: bold;">
          <img
            style="width:440px; margin-right: 1px;"
            id="imgLegendCurrent"
            :src="refineCurrentProForm.imgLegendUrl"
          >
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import Map from 'ol/Map'
import View from 'ol/View'
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import {Vector} from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import 'ol/ol.css'
import {fromLonLat} from 'ol/proj';
import {transformExtent} from 'ol/proj';
import {toLonLat} from 'ol/proj.js';
import Projection from "ol/proj/Projection";
import Select from 'ol/interaction/Select';
import {singleClick} from 'ol/events/condition';
import PlatformLast24Modal from "../components/Map/24Timeseries/PlatformLast24Modal";
import Static from 'ol/source/ImageStatic.js';
import ImageLayer from 'ol/layer/Image.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {defaults as defaultControls} from 'ol/control.js';
import Site1Last24Modal from "../components/Map/24Timeseries/Site1Last24Modal";
import Site2Last24Modal from "../components/Map/24Timeseries/Site2Last24Modal";
import Site3Last24Modal from "../components/Map/24Timeseries/Site3Last24Modal";
import Buoy123Last24Modal from "../components/Map/24Timeseries/Buoy123Last24Modal";
import Buoy4Last24Modal from "../components/Map/24Timeseries/Buoy4Last24Modal";
import Buoy67Last24Modal from "../components/Map/24Timeseries/Buoy67Last24Modal";
import util from "../util/util.js";

export default {
  name: "map-layout",
  components: {
    Site1Last24Modal,
    Site2Last24Modal,
    Site3Last24Modal,
    PlatformLast24Modal,
    Buoy123Last24Modal,
    Buoy4Last24Modal,
    Buoy67Last24Modal,
  },
  data() {
    return {

      //地图要素
      map: null,//地图
      bridge_layer: null,//深中通道桥、隧道图层
      island_layer: null,//深中通道桥图层
      route_layer: null,//航线图层
      platform_layer: null,//平台图层
      buoy_layer: null,//浮标图层
      buoy_history_layer: null,//浮标历史轨迹图层
      site_layer: null,//气象站图层
      productionLyrs: [],//数值预报产品图层

      //popup三兄弟
      container: "",
      content: "",
      overlay: "",
      popup_title: "",
      ol_popup_min_width: "300px",

      buoyId: null,//buoyId
      siteId: null,//气象站Id
      lastPointerFeature: null,//记录上一次光标指向的feature
      proHit: false,//记录弹框状态

      //openlayer图片的src使用方法！！
      platformIconUrl: require('../assets/platform.png'),
      buoyIconUrl: require('../assets/buoy.png'),
      siteIconUrl: require('../assets/site.png'),

      //图例
      curLegend: [],//当前图例
      legends: {
        'tenMWind': require("../assets/legend/10mWind.jpg"),
        'twoHpaWind': require("../assets/legend/200hpaWind.jpg"),
        'wave': require("../assets/legend/wave.jpg"),
        'rain': require("../assets/legend/rain.jpg"),
        'current': require("../assets/legend/current.jpg"),
        'salinity': require("../assets/legend/salinity.jpg"),
        'waveTPS': require("../assets/legend/waveTPS.jpg"),
      },
      //记录当前地图缩放层级
      oldZoom: 0,

      //wave图
      waveAll: [],

      //精细化大气数值预报是否可见
      visibilityRefineWeaProForm: 'hidden',
      //精细化大气数值预报
      refineWeaProForm: {
        stDate: null,
        // preTime:'',
        preTime: [0, 168],
        marks: {
          0: '0',
          24: '24',
          48: '48',
          72: '72',
          96: '96',
          120: '120',
          144: '144',
          168: '168',
        },
        preTimeList: Array.apply(null, Array(169)).map(function (item, i) {
          return i
        }),
        proList: ["气压场"],
        imgLegendUrl: "",
        cb_dis: {
          wind: false,//风场-填色图
          rain: false,//降水-填色图
        },
      },

      //精细化海浪数值预报是否可见
      visibilityRefineWaveProForm: 'hidden',
      //精细化海浪数值预报
      refineWaveProForm: {
        stDate: null,
        // preTime:'',
        preTime: [0, 144],
        marks: {
          0: '0',
          24: '24',
          48: '48',
          72: '72',
          96: '96',
          120: '120',
          144: '144',
        },
        preTimeList: Array.apply(null, Array(145)).map(function (item, i) {
          return i
        }),
        proList: ["浪向"],
        imgLegendUrl: "",
        cb_dis: {
          wave: false,//波高-填色图
          waveTPS: false,//周期-填色图
        },
      },

      //精细化海流数值预报是否可见
      visibilityRefineCurrentProForm: 'hidden',
      //精细化海流数值预报
      refineCurrentProForm: {
        stDate: null,
        // preTime:'',
        preTime: [0, 168],
        marks: {
          0: '0',
          24: '24',
          48: '48',
          72: '72',
          96: '96',
          120: '120',
          144: '144',
          168: '168',
        },
        //Array(25) 25为nc文件时次个数
        preTimeList: Array.apply(null, Array(169)).map(function (item, i) {
          return i
        }),
        verticalLayer: 0,
        verticalLayerList: [
          {
            value: 0,
            label: '10m平均',
          },
          {
            value: 1,
            label: '1'
          },
          {
            value: 5,
            label: '5'
          },
          {
            value: 9,
            label: '9'
          },
          {
            value: 13,
            label: '13'
          },
          {
            value: 17,
            label: '17'
          },

        ],
        proList: ["水位"],
        cb_dis_seaLevel: false,
        cb_dis: {
          current: false,//流场-填色图
          salinity: false,//盐度-填色图
        },
      },

    }
  },
  computed: {
    //联动气象显示“预报时间”
    // 计算属性的 getter
    refineWeaProFormForecastTime: function () {
      // `this` 指向 vm 实例
      var time = "";
      if (this.refineWeaProForm.stDate != null && this.refineWeaProForm.stDate != "") {
        time = util.formatDateTimeForecastTime(this.refineWeaProForm.stDate, this.refineWeaProForm.preTime);
      }
      return time;
    },

    //联动海浪显示“预报时间”
    // 计算属性的 getter
    refineWaveProFormForecastTime: function () {
      // `this` 指向 vm 实例
      var time = "";
      if (this.refineWaveProForm.stDate != null && this.refineWaveProForm.stDate != "") {
        time = util.formatDateTimeForecastTime(this.refineWaveProForm.stDate, this.refineWaveProForm.preTime);
      }
      return time;
    },

    //联动海流显示“预报时间”
    // 计算属性的 getter
    refineCurrentProFormForecastTime: function () {
      // `this` 指向 vm 实例
      var time = "";
      if (this.refineCurrentProForm.stDate != null && this.refineCurrentProForm.stDate != "") {
        time = util.formatDateTimeForecastTime(this.refineCurrentProForm.stDate, this.refineCurrentProForm.preTime);
      }
      return time;
    }
  },
  methods: {
    /**
     * 精细化气象数值预报,点击wind多选框，改变rain多选框的状态
     */
    changeCBRainDisableRefineWeaProForm() {
      if (this.refineWeaProForm.cb_dis.rain == true) {
        this.refineWeaProForm.cb_dis.rain = false;
      } else {
        this.refineWeaProForm.cb_dis.rain = true
      }
    },
    /**
     * 精细化气象数值预报,点击rain多选框，改变wind多选框的状态
     */
    changeCBWindDisableRefineWeaProForm() {
      if (this.refineWeaProForm.cb_dis.wind == true) {
        this.refineWeaProForm.cb_dis.wind = false;
      } else {
        this.refineWeaProForm.cb_dis.wind = true
      }
    },
    /**
     * 关闭精细化气象数值预报对话框
     */
    closeRefineWeaProForm() {
      this.visibilityRefineWeaProForm = 'hidden';
      //清除地图上现有的数据产品
      this.cleanMapPro();
    },
    /**
     * 打开精细化气象数值预报对话框
     */
    openRefineWeaProForm() {
      //关闭精细化海浪数值预报
      this.visibilityRefineWaveProForm = 'hidden';
      //关闭精细化海流数值预报
      this.visibilityRefineCurrentProForm = 'hidden';
      //打开精细化气象数值预报
      this.visibilityRefineWeaProForm = 'visible';
      //TODO 后台组织默认日期
      var api = `/api/SZTDService/queryAtmRefineProNew.action`;
      this.$axios.get(api).then((response) => {
        if (response.data != "") {
          this.refineWeaProForm.stDate = new Date(response.data);
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    },
    /**
     * 在地图上加载精细化大气数值预报产品
     */
    loadRefineWeaProToMap() {
      //清除地图上现有的数据产品
      this.cleanMapPro();
      var stDateStr = this.refineWeaProForm.stDate.getFullYear() + util.num2Str(this.refineWeaProForm.stDate.getMonth() + 1) + util.num2Str(this.refineWeaProForm.stDate.getDate()) + "20";
      var url = `/proapi/sztd_data_matlab/atmRefine/` + stDateStr + `/`;
      var extent = this.$store.state.atmRefineExtent;
      for (var i = 0; i < this.refineWeaProForm.proList.length; i++) {
        if (this.refineWeaProForm.proList[i] == "气压场") {
          //气压等值线图
          var pressUrl = url + "AtmRefine_10mSLP_" + this.refineWeaProForm.preTime + "_" + stDateStr + "_L6.png";
          this.addPictureToMap(pressUrl, extent);
        }
        if (this.refineWeaProForm.proList[i] == "风场") {
          //风力填色图
          var windUrl2 = url + "AtmRefine_10mWindU10V10_" + this.refineWeaProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(windUrl2, extent);
          this.refineWeaProForm.imgLegendUrl = require("../assets/legend/10mWind.jpg");
          //风向图（风向标）
          var windUrl1 = url + "AtmRefine_10mWindVane_" + this.refineWeaProForm.preTime + "_" + stDateStr + "_L1.png";
          this.addPictureToMap(windUrl1, extent);
        }
        if (this.refineWeaProForm.proList[i] == "降水") {
          //降水量
          var rainUrl = url + "AtmRefine_Rainnc_" + this.refineWeaProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(rainUrl, extent);
          this.refineWeaProForm.imgLegendUrl = require("../assets/legend/rain.jpg");
        }
      }
    },
    /**
     * 精细化海浪数值预报,点击wave多选框，改变waveTPS多选框的状态
     */
    changeCBWaveTPSDisableRefineWaveProForm() {
      if (this.refineWaveProForm.cb_dis.waveTPS == true) {
        this.refineWaveProForm.cb_dis.waveTPS = false;
      } else {
        this.refineWaveProForm.cb_dis.waveTPS = true
      }
    },
    /**
     * 精细化海浪数值预报,点击waveTPS多选框，改变wave多选框的状态
     */
    changeCBWaveDisableRefineWaveProForm() {
      if (this.refineWaveProForm.cb_dis.wave == true) {
        this.refineWaveProForm.cb_dis.wave = false;
      } else {
        this.refineWaveProForm.cb_dis.wave = true
      }
    },
    /**
     * 关闭精细化海浪数值预报对话框
     */
    closeRefineWaveProForm() {
      this.visibilityRefineWaveProForm = 'hidden';
      //清除地图上现有的数据产品
      this.cleanMapPro();
    },
    /**
     * 打开精细化海浪数值预报对话框
     */
    openRefineWaveProForm() {
      //关闭精细化气象数值预报
      this.visibilityRefineWeaProForm = 'hidden';
      //关闭精细化海流数值预报
      this.visibilityRefineCurrentProForm = 'hidden';
      //打开精细化海浪数值预报
      this.visibilityRefineWaveProForm = 'visible';

      var api = `/api/SZTDService/queryWaveProNew.action`;
      this.$axios.get(api).then((response) => {
        if (response.data != "") {
          //TODO 组织默认日期
          this.refineWaveProForm.stDate = new Date(response.data);
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    },
    /**
     * 在地图上加载精细化海浪数值预报产品
     */
    loadRefineWaveProToMap() {
      //清除地图上现有的数据产品
      this.cleanMapPro();
      var stDateStr = this.refineWaveProForm.stDate.getFullYear() + util.num2Str(this.refineWaveProForm.stDate.getMonth() + 1) + util.num2Str(this.refineWaveProForm.stDate.getDate());
      var url = `/proapi/sztd_data_matlab/wave/`;
      var extent = this.$store.state.waveExtent;
      for (var i = 0; i < this.refineWaveProForm.proList.length; i++) {
        if (this.refineWaveProForm.proList[i] == "波高") {
          //海浪浪高等值线填色图
          var hsUrl1 = url + stDateStr + "/Wave_HS_Contourf_" + this.refineWaveProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(hsUrl1, extent);
          //海浪浪高等值线图
          var hsUrl2 = url + stDateStr + "/Wave_HS_Contour_" + this.refineWaveProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(hsUrl2, extent);
          this.refineWaveProForm.imgLegendUrl = require("../assets/legend/wave.jpg");
        }
        if (this.refineWaveProForm.proList[i] == "浪向") {
          // var pressUrl=url+"DIR/"+stDateStr+"/Wave_DIR_"+this.waveProForm.preTime+"_"+stDateStr+"_L6.png";
          var pressUrl = url + stDateStr + "/Wave_DIR_" + this.refineWaveProForm.preTime + "_" + stDateStr + "_L1.png";
          this.addPictureToMap(pressUrl, extent);
        }
        if (this.refineWaveProForm.proList[i] == "周期") {
          //海浪周期等值线填色图
          var tpsUrl1 = url + stDateStr + "/Wave_TPS_Contourf_" + this.refineWaveProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(tpsUrl1, extent);
          //海浪周期等值线图
          var tpsUrl2 = url + stDateStr + "/Wave_TPS_Contour_" + this.refineWaveProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(tpsUrl2, extent);
          this.refineWaveProForm.imgLegendUrl = require("../assets/legend/waveTPS.jpg");
        }
      }
    },
    /**
     * 精细化海流数值预报,点击current多选框，改变salinity多选框的状态
     */
    changeCBSalinityDisableRefineCurrentProForm() {
      if (this.refineCurrentProForm.cb_dis.salinity == true) {
        this.refineCurrentProForm.cb_dis.salinity = false;
      } else {
        this.refineCurrentProForm.cb_dis.salinity = true
      }
    },
    /**
     * 精细化海流数值预报,点击salinity多选框，改变current多选框的状态
     */
    changeCBCurrentDisableRefineCurrentProForm() {
      if (this.refineCurrentProForm.cb_dis.current == true) {
        this.refineCurrentProForm.cb_dis.current = false;
      } else {
        this.refineCurrentProForm.cb_dis.current = true
      }
    },
    /**
     * 打开精细化海流数值预报对话框
     */
    openRefineCurrentProForm() {
      //关闭精细化气象数值预报
      this.visibilityRefineWeaProForm = 'hidden';
      //关闭精细化海浪数值预报
      this.visibilityRefineWaveProForm = 'hidden';
      //打开精细化海流数值预报
      this.visibilityRefineCurrentProForm = 'visible';
      //TODO 组织默认日期
      var api = `/api/SZTDService/queryCurrentProNew.action`;
      this.$axios.get(api).then((response) => {
        if (response.data != "") {
          this.refineCurrentProForm.stDate = new Date(response.data);
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    },
    /**
     * 修改垂直层级触发事件，水位只有表层才有
     */
    changeVerticalLayer() {
      if (this.refineCurrentProForm.verticalLayer == 1) {
        this.refineCurrentProForm.cb_dis_seaLevel = false;
      } else {
        this.refineCurrentProForm.cb_dis_seaLevel = true;
      }
    },
    /**
     * 关闭模态框清除地图上的数值产品
     */
    closeRefineCurrentProForm() {
      this.visibilityRefineCurrentProForm = 'hidden';
      //清除地图上现有的数据产品
      this.cleanMapPro();
    },
    /**
     * 在地图上加载海流数值产品
     */
    loadRefineCurrentProToMap() {
      //清除地图上现有的数据产品
      this.cleanMapPro();
      var stDateStr = this.refineCurrentProForm.stDate.getFullYear() + util.num2Str(this.refineCurrentProForm.stDate.getMonth() + 1) + util.num2Str(this.refineCurrentProForm.stDate.getDate()) + "20";
      var url = `/proapi/sztd_data_matlab/current/` + stDateStr + `/`;
      var extent = this.$store.state.currentExtent;
      for (var i = 0; i < this.refineCurrentProForm.proList.length; i++) {
        if (this.refineCurrentProForm.proList[i] == "流场") {
          //流场填色图
          var windUrl2 = url + "Current_UV_" + this.refineCurrentProForm.verticalLayer + "G_" + this.refineCurrentProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(windUrl2, extent);
          this.refineCurrentProForm.imgLegendUrl = require("../assets/legend/current.jpg");
          //流场方向图
          var windUrl1 = url + "Current_UVDir_" + this.refineCurrentProForm.verticalLayer + "G_" + this.refineCurrentProForm.preTime + "_" + stDateStr + "_L1.png";
          this.addPictureToMap(windUrl1, extent);

        }
        if (this.refineCurrentProForm.proList[i] == "盐度") {
          //盐度
          var rainUrl = url + "Current_Salinity_" + this.refineCurrentProForm.verticalLayer + "G_" + this.refineCurrentProForm.preTime + "_" + stDateStr + ".png";
          this.addPictureToMap(rainUrl, extent);
          this.refineCurrentProForm.imgLegendUrl = require("../assets/legend/salinity.jpg");
        }
        if (this.refineCurrentProForm.proList[i] == "水位") {
          //水位
          var rainUrl = url + "Current_Zeta_" + this.refineCurrentProForm.preTime + "_" + stDateStr + "_L6.png";
          this.addPictureToMap(rainUrl, extent);
        }
      }
    },
    /**
     * 单击“西人工岛观测站”按钮，缩放并显示
     */
    zoomToPlatformXiDao() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);

      this.platformPopShow(this.platform_layer.getSource().getFeatureById('Platform'));
    },
    /**
     * 单击“1桂山牛头岛气象站”按钮，缩放并显示
     */
    zoomToSiteGuiShanNiuTouDao() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113.8, 22.1735]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.siteId = 1;

      this.sitePopShow(this.site_layer.getSource().getFeatureById('Site1'));
    },
    /**
     * 单击“2西人工岛气象站”按钮，缩放并显示
     */
    zoomToSiteXiRenGongDao() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113.766145, 22.572448]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.siteId = 2;

      this.sitePopShow(this.site_layer.getSource().getFeatureById('Site2'));
    },
    /**
     * 单击“3龙穴船厂气象站”按钮，缩放并显示
     */
    zoomToSiteLongXueChuanChang() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113.649444, 22.707131]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.siteId = 3;

      this.sitePopShow(this.site_layer.getSource().getFeatureById('Site3'));
    },
    /**
     * 单击“1号浮标”按钮，缩放并显示
     */
    zoomToBuoy1() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113 + 45 * 1 / 60 + 9.42 * 1 / 3600, 22 + 29 * 1 / 60 + 6.3 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.buoyId = 1;

      this.buoy123PopShow(this.buoy_layer.getSource().getFeatureById("Buoy1"));
    },
    /**
     * 单击“2号浮标”按钮，缩放并显示
     */
    zoomToBuoy2() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113 + 46 * 1 / 60 + 32.93 * 1 / 3600, 22 + 33 * 1 / 60 + 43.51 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.buoyId = 2;

      this.buoy123PopShow(this.buoy_layer.getSource().getFeatureById("Buoy2"));
    },
    /**
     * 单击“3号浮标”按钮，缩放并显示
     */
    zoomToBuoy3() {
      /** 视图初始化*/
      var newView = new View({
        // center: fromLonLat([113 + 47 * 1 / 60 + 44.82 * 1 / 3600, 22 + 20 * 1 / 60 + 14.22 * 1 / 3600]),
        center: fromLonLat([113 + 41 * 1 / 60 + 58.14 * 1 / 3600, 22 + 37 * 1 / 60 + 51.51 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.buoyId = 3;

      this.buoy123PopShow(this.buoy_layer.getSource().getFeatureById("Buoy3"));
    },
    /**
     * 单击“4号浮标”按钮，缩放并显示
     */
    zoomToBuoy4() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113 + 47 * 1 / 60 + 21.12 * 1 / 3600, 22 + 10 * 1 / 60 + 36.48 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.buoyId = 4;

      this.buoy4PopShow(this.buoy_layer.getSource().getFeatureById("Buoy4"));
    },
    /**
     * 单击“6号浮标”按钮，缩放并显示
     */
    zoomToBuoy6() {
      /** 视图初始化*/
      var newView = new View({
        center: fromLonLat([113 + 47 * 1 / 60 + 39.70 * 1 / 3600, 22 + 17 * 1 / 60 + 31.80 * 1 / 3600]),
        zoom: 11,
      });
      this.oldZoom = 11;
      this.map.setView(newView);
      this.buoyId = 6;

      this.buoy67PopShow(this.buoy_layer.getSource().getFeatureById("Buoy6"));
    },
    /**
     * 向地图上添加深中通道桥和隧道、西岛、东岛
     */
    addBridge() {
      //绘制深中通道大桥
      var szLonLat = [];
      szLonLat[0] = fromLonLat([113.617607247222222, 22.553349375000000]);
      szLonLat[1] = fromLonLat([113.621381936111111, 22.553686277777778]);
      szLonLat[2] = fromLonLat([113.630785091666667, 22.555963402777778]);
      szLonLat[3] = fromLonLat([113.639237250000000, 22.558064225000000]);
      szLonLat[4] = fromLonLat([113.639860219444444, 22.558185897222222]);
      szLonLat[5] = fromLonLat([113.641059516666667, 22.558317461111111]);
      szLonLat[6] = fromLonLat([113.644051022222222, 22.558645858333333]);
      szLonLat[7] = fromLonLat([113.648362280555556, 22.558495047222222]);
      szLonLat[8] = fromLonLat([113.652575975000000, 22.557707902777778]);
      szLonLat[9] = fromLonLat([113.656342336111111, 22.556424552777778]);
      szLonLat[10] = fromLonLat([113.658953383333333, 22.555220902777778]);
      szLonLat[11] = fromLonLat([113.666916813888889, 22.550869480555556]);
      szLonLat[12] = fromLonLat([113.673872455555556, 22.547929822222222]);
      szLonLat[13] = fromLonLat([113.679034961111111, 22.546424344444444]);
      szLonLat[14] = fromLonLat([113.684378661111111, 22.545606952777778]);
      szLonLat[15] = fromLonLat([113.689836972222222, 22.545497488888889]);
      szLonLat[16] = fromLonLat([113.695160827777778, 22.546090463888889]);
      szLonLat[17] = fromLonLat([113.707048500000000, 22.549453802777778]);
      szLonLat[18] = fromLonLat([113.710668647222222, 22.550602944444444]);
      szLonLat[19] = fromLonLat([113.714645511111111, 22.551865200000000]);
      szLonLat[20] = fromLonLat([113.722014197222222, 22.554203697222222]);
      szLonLat[21] = fromLonLat([113.731214550000000, 22.557122908333333]);
      szLonLat[22] = fromLonLat([113.737655030555555, 22.559166036111111]);
      szLonLat[23] = fromLonLat([113.746803997222222, 22.562460405555556]);
      szLonLat[24] = fromLonLat([113.752584372222222, 22.565412577777778]);
      szLonLat[25] = fromLonLat([113.754855163888889, 22.566786613888889]);
      szLonLat[26] = fromLonLat([113.760337002777778, 22.570190294444444]);
      szLonLat[27] = fromLonLat([113.767700591666667, 22.574795177777778]);
      szLonLat[28] = fromLonLat([113.769010450000000, 22.575608808333333]);
      szLonLat[29] = fromLonLat([113.772605130555556, 22.577840277777778]);
      szLonLat[30] = fromLonLat([113.775408238888889, 22.579580255555556]);
      szLonLat[31] = fromLonLat([113.778886705555556, 22.581739313888889]);
      szLonLat[32] = fromLonLat([113.783110580555556, 22.584360861111111]);
      szLonLat[33] = fromLonLat([113.785322666666667, 22.585733705555556]);
      szLonLat[34] = fromLonLat([113.786651638888889, 22.586558447222222]);
      szLonLat[35] = fromLonLat([113.788292586111111, 22.587576775000000]);
      szLonLat[36] = fromLonLat([113.792123533333333, 22.589954036111111]);
      szLonLat[37] = fromLonLat([113.796754108333333, 22.592827255555556]);
      szLonLat[38] = fromLonLat([113.800180286111111, 22.594953000000000]);
      szLonLat[39] = fromLonLat([113.803068883333333, 22.596745097222222]);
      szLonLat[40] = fromLonLat([113.803830750000000, 22.5971652666666676]);
      szLonLat[41] = fromLonLat([113.807559516666667, 22.599218972222222]);
      szLonLat[42] = fromLonLat([113.805957177777778, 22.598335983333333]);


      var szStyle = new Style({
        stroke: new Stroke({
          width: 3,
          color: [147, 112, 219, 1]
        })
      })

      var sz = new Feature({
        geometry: new LineString(szLonLat),
        name: "NotSelect1",
      });
      sz.setStyle(szStyle);
      this.bridge_layer.getSource().addFeature(sz);

    },
    /**
     * 向地图上添加西岛、东岛、缺失岛
     */
    addIsland() {
      //绘制西岛
      var westIslandLonLat = [];
      westIslandLonLat[0] = fromLonLat([113.767700591666667, 22.574795177777778]);
      westIslandLonLat[1] = fromLonLat([113.763723466666667, 22.575778344444444]);
      westIslandLonLat[2] = fromLonLat([113.760337002777778, 22.570190294444444]);
      westIslandLonLat[3] = fromLonLat([113.767160680555556, 22.571006544444444]);
      westIslandLonLat[4] = fromLonLat([113.767700591666667, 22.574795177777778]);

      var westIslandStyle = new Style({
        fill: new Fill({
          color: [255, 255, 240, 1]
        })
      })

      var westIsland = new Feature({
        geometry: new Polygon([westIslandLonLat]),
        name: "NotSelect2",
      });
      westIsland.setStyle(westIslandStyle);
      this.island_layer.getSource().addFeature(westIsland);

      //绘制底图缺损岛
      var mapMoreLonLat = [];
      // mapMoreLonLat[0] = fromLonLat([113.6663, 22.6286]);
      mapMoreLonLat[0] = fromLonLat([113.6657, 22.6204]);//起始点
      mapMoreLonLat[1] = fromLonLat([113.6665, 22.6160]);
      mapMoreLonLat[2] = fromLonLat([113.6673, 22.6120]);
      mapMoreLonLat[3] = fromLonLat([113.6681, 22.6080]);
      mapMoreLonLat[4] = fromLonLat([113.6688, 22.6040]);
      mapMoreLonLat[5] = fromLonLat([113.6700, 22.6019]);//左侧突起
      mapMoreLonLat[6] = fromLonLat([113.6861, 22.5775]);//左下端
      mapMoreLonLat[7] = fromLonLat([113.6885, 22.5750]);
      mapMoreLonLat[8] = fromLonLat([113.6890, 22.5750]);
      mapMoreLonLat[9] = fromLonLat([113.6895, 22.5760]);
      mapMoreLonLat[10] = fromLonLat([113.6900, 22.5794]);//右下端
      mapMoreLonLat[11] = fromLonLat([113.6841, 22.6240]);//终止点
      mapMoreLonLat[12] = fromLonLat([113.6657, 22.6204]);//起始点

      var mapMoreStyle = new Style({
        fill: new Fill({
          color: [255, 255, 240, 1]
        })
      })

      var mapMore = new Feature({
        geometry: new Polygon([mapMoreLonLat]),
        name: "NotSelect3",
      });
      mapMore.setStyle(mapMoreStyle);
      this.island_layer.getSource().addFeature(mapMore);
    },
    /**
     * 向地图上添加航线
     */
    addRoute() {
      //绘制龙穴航线
      var route1LonLat = [];
      route1LonLat[0] = fromLonLat([113.650000, 22.707963]);
      route1LonLat[1] = fromLonLat([113.653354, 22.702990]);
      route1LonLat[2] = fromLonLat([113.660892, 22.691099]);
      route1LonLat[3] = fromLonLat([113.668282, 22.681892]);
      route1LonLat[4] = fromLonLat([113.682640, 22.661777]);
      route1LonLat[5] = fromLonLat([113.698119, 22.629776]);
      route1LonLat[6] = fromLonLat([113.700157, 22.624256]);
      route1LonLat[7] = fromLonLat([113.771308, 22.589562]);
      route1LonLat[8] = fromLonLat([113.795306, 22.592781]);
      route1LonLat[9] = fromLonLat([113.808037, 22.599829]);


      var route1Style = new Style({
        stroke: new Stroke({
          width: 3,
          color: [255, 140, 0, 1],
          lineDash: [1, 2, 3, 4, 5, 6, 7, 8],
        }),
      })

      var route1 = new Feature({
        geometry: new LineString(route1LonLat),
        name: "NotSelect4",
      });
      route1.setStyle(route1Style);
      this.route_layer.getSource().addFeature(route1);

      //绘制福运航线
      var route2LonLat = [];
      // route2LonLat[0] = fromLonLat([113.775814, 22.56208611]);
      // route2LonLat[1] = fromLonLat([113.752617, 22.4850833]);
      // route2LonLat[2] = fromLonLat([113.795783, 22.3372833]);
      // route2LonLat[3] = fromLonLat([113.7892, 22.1768]);

      route2LonLat[0] = fromLonLat([113.7748, 22.5786]);
      route2LonLat[1] = fromLonLat([113.7422, 22.4904]);
      route2LonLat[2] = fromLonLat([113.8145, 22.3345]);
      route2LonLat[3] = fromLonLat([113.7892, 22.1768]);

      var route2Style = new Style({
        stroke: new Stroke({
          width: 3,
          color: [255, 140, 0, 1],
          lineDash: [1, 2, 3, 4, 5, 6, 7, 8],
        }),
      })

      var route2 = new Feature({
        geometry: new LineString(route2LonLat),
        name: "NotSelect5",
      });
      route2.setStyle(route2Style);
      this.route_layer.getSource().addFeature(route2);
    },
    /**
     * 向地图上添加浮标
     */
    addBuoy() {
      this.buoy_layer.getSource().clear();

      /** 浮标初始化*/
      this.getBuoy(1);
      this.getBuoy(2);
      this.getBuoy(3);
      this.getBuoy(4);
      this.getBuoy(6);
    },
    /**
     * 向地图上添加气象站
     */
    addSite() {
      this.site_layer.getSource().clear();

      /** 气象站初始化*/
      this.getSite(1);
      this.getSite(2);
      this.getSite(3);
    },
    /**
     * 向地图上添加气象平台
     */
    addPlatform() {
      this.platform_layer.getSource().clear();
      var platform = new Feature({
        geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600])),
        name: "Platform",
      });
      var style = new Style({
        image: new Icon({
          src: this.platformIconUrl,
          scale: 0.2
        })
      });
      platform.setId('Platform');
      platform.setStyle(style);
      this.platform_layer.getSource().addFeature(platform);
    },
    /**
     * 地图初始化
     */
    mapInit() {

      /** 地图图层初始化*/
        //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
        //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
      var map_source = new XYZ({
          url: "http://" + this.$store.state.serverIP + "/sztd_map/tdt_lxt/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
        });
      var map_layer = new TileLayer({
        source: map_source
      });
      var map_label_source = new XYZ({
        url: "http://" + this.$store.state.serverIP + "/sztd_map/tdt_lxt_label/{z}/{y}/{x}.png"    //FeatureWithLabelGZA
      });
      var map_label_layer = new TileLayer({
        source: map_label_source
      });

      /** 桥图层初始化*/
      var bridge_source = new Vector({
        features: null
      });
      this.bridge_layer = new VectorLayer({
        name: "bridge_layer",
        chName: "桥图层",
        source: bridge_source
      });

      /** 岛图层初始化*/
      var island_source = new Vector({
        features: null
      });
      this.island_layer = new VectorLayer({
        name: "island_layer",
        chName: "桥图层",
        source: island_source
      });

      /** 航线图层初始化*/
      var route_source = new Vector({
        features: null
      });
      this.route_layer = new VectorLayer({
        name: "route_layer",
        chName: "航线图层",
        source: route_source
      });

      /** 平台图层初始化*/
      var platform_source = new Vector({
        features: null
      });
      this.platform_layer = new VectorLayer({
        name: "platform_layer",
        chName: "平台图层",
        source: platform_source
      });

      /** 气象站图层初始化*/
      var site_source = new Vector({
        features: null
      });
      this.site_layer = new VectorLayer({
        name: "site_layer",
        chName: "平台图层",
        source: site_source
      });

      /**浮标图层初始化*/
      var buoy_source = new Vector({
        features: null
      });
      this.buoy_layer = new VectorLayer({
        name: "buoy_layer",
        chName: "浮标图层",
        source: buoy_source
      });

      /**浮标历史轨迹图层初始化*/
      var buoy_history_source = new Vector({
        features: null
      });
      this.buoy_history_layer = new VectorLayer({
        name: "buoy_history_layer",
        chName: "浮标图层",
        source: buoy_history_source
      });

      /** 视图初始化*/
      var view = new View({
        center: fromLonLat([113.8, 22.45]),
        zoom: 10,
        // minZoom: 5,
        // maxZoom: 13,
        minZoom: 8,
        maxZoom: 12,
      });
      this.oldZoom = 10;

      //mousePosition初始化
      var mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

      /** Map初始化*/
      this.map = new Map({
        target: "tdtmap",
        //顺序越前面，图层越下面
        layers: [map_layer, map_label_layer, this.bridge_layer, this.island_layer, this.route_layer, this.buoy_history_layer, this.platform_layer, this.buoy_layer, this.site_layer,],
        view: view,
        controls: defaultControls().extend([mousePositionControl]),
      });

      /**
       * Elements that make up the popup.
       */
      this.container = document.getElementById('popup');
      this.content = document.getElementById('popup-content');
      this.overlay = new Overlay({
        element: this.container,
        autoPan: false,
        autoPanAnimation: {
          duration: 2500
        },
        offset: [10, -20],
        positioning: 'center-center',
      });
      this.map.addOverlay(this.overlay);


      //鼠标移动事件绑定
      this.map.on('pointermove', this.mouseMove);
      //鼠标点击地图响应事件绑定
      this.map.on('singleclick', this.singleClickOnMap);
      //地图范围变化事件绑定
      this.map.on('moveend', this.zoomEvent);

      //鼠标点击feature事件绑定
      var selectClick = new Select({
        condition: singleClick,
        multi: true,
      });
      this.map.addInteraction(selectClick);
      selectClick.on("select", this.singleClick);
    },
    /**
     * 点击feature响应事件(只有在选中Feature时才会触发）
     * @param e
     */
    singleClick(e) {
      var features = e.target.getFeatures().getArray();
      if (features[0].get('name').search(/Platform/) != -1) {
        //显示平台最近24小时数的时间序列数据
        this.$refs.platformLast24Modal.openPlatformLast24Modal()
      } else if (features[0].get('name').search(/Site1/) != -1) {
        //显示桂山牛头岛气象站最近24小时数的时间序列数据
        this.$refs.site1Last24Modal.openSite1Last24Modal()
      } else if (features[0].get('name').search(/Site2/) != -1) {
        //显示西岛气象站最近24小时数的时间序列数据
        this.$refs.site2Last24Modal.openSite2Last24Modal()
      } else if (features[0].get('name').search(/Site3/) != -1) {
        //显示龙穴船厂气象站最近24小时数的时间序列数据
        this.$refs.site3Last24Modal.openSite3Last24Modal()
      } else if (features[0].get('name').search(/Buoy1/) != -1) {
        //显示浮标123最近24小时数的时间序列数据
        this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(1)
      } else if (features[0].get('name').search(/Buoy2/) != -1) {
        //显示浮标123最近24小时数的时间序列数据
        this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(2)
      } else if (features[0].get('name').search(/Buoy3/) != -1) {
        //显示浮标123最近24小时数的时间序列数据
        this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(3)
      } else if (features[0].get('name').search(/Buoy4/) != -1) {
        //显示浮标4最近24小时数的时间序列数据
        this.$refs.buoy4Last24Modal.openBuoy4Last24Modal(4)
      } else if (features[0].get('name').search(/Buoy6/) != -1) {
        //显示浮标6最近24小时数的时间序列数据
        this.$refs.buoy67Last24Modal.openBuoy67Last24Modal(6)
      }
    },
    /**
     * 地图区域鼠标移动事件
     * @param e
     */
    mouseMove(e) {
      var pixel = e.pixel;//获取地图上坐标
      var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';//变换鼠标指针的状态
      //如果触到feature
      if (hit) {
        //获取当前的features
        var features = this.map.getFeaturesAtPixel(pixel);
        //var tt=this.getLayer(features[0]);
        if (features[0].get('name').search(/Not/) == -1) {
          if (features[0] != this.lastpointerFeature) {
            //移动前后是不同feature，将原来的feature图标大小回归正常
            if (this.lastpointerFeature != null) {
              var style = this.lastpointerFeature.getStyle();
              style.getImage().setScale(0.2);
              this.lastpointerFeature.setStyle(style);
              this.overlay.setPosition(undefined);
              this.proHit = false;//更改弹窗状态
            }

            this.lastpointerFeature = features[0];//记录本次feature
            //图标放大
            var style = this.lastpointerFeature.getStyle();
            style.getImage().setScale(0.25);
            this.lastpointerFeature.setStyle(style);

            if (features[0].get('name').search(/Platform/) != -1) {
              this.platformPopShow(features[0]);
            } else if (features[0].get('name').search(/Site1/) != -1) {
              this.siteId = 1;
              this.sitePopShow(features[0]);
            } else if (features[0].get('name').search(/Site2/) != -1) {
              this.siteId = 2;
              this.sitePopShow(features[0]);
            } else if (features[0].get('name').search(/Site3/) != -1) {
              this.siteId = 3;
              this.sitePopShow(features[0]);
            } else if (features[0].get('name').search(/Buoy1/) != -1) {
              this.buoyId = 1;
              this.buoy123PopShow(features[0]);
            } else if (features[0].get('name').search(/Buoy2/) != -1) {
              this.buoyId = 2;
              this.buoy123PopShow(features[0]);
            } else if (features[0].get('name').search(/Buoy3/) != -1) {
              this.buoyId = 3;
              this.buoy123PopShow(features[0]);
            } else if (features[0].get('name').search(/Buoy4/) != -1) {
              this.buoyId = 4;
              this.buoy4PopShow(features[0]);
            } else if (features[0].get('name').search(/Buoy6/) != -1) {
              this.buoyId = 6;
              this.buoy67PopShow(features[0]);
            }
          }
        }
      } else {
        if (this.lastpointerFeature != null) {
          var style = this.lastpointerFeature.getStyle();
          style.getImage().setScale(0.2);
          this.lastpointerFeature.setStyle(style);
        }
        this.overlay.setPosition(undefined);
        this.proHit = false;//更改弹窗状态
        this.lastpointerFeature = null;//记录本次feature
      }

    },
    /**
     * 显示气象站最新数据弹出框
     * @param feature
     */
    sitePopShow(feature) {
      this.ol_popup_min_width = "380px";
      var api = `/api/SZTDService/querySiteNew.action?id=${this.siteId}`;
      this.$axios.get(api).then((response) => {
        //构建Popup_title文字内容
        if (this.siteId == 1) {
          this.popup_title = "桂山牛头岛气象站最新数据";
          //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
          var siteNew = response.data;
          if (siteNew != null) {
            //组织弹出框内容
            var html = "";
            //气象站
            html +=
              "<table>" +
              "<tr><td align='left'>时间：</td><td align='left'>" + util.formatDateTime(new Date(siteNew.dt)) + "</td></tr>" +
              "<tr><td align='left'>气温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.taAvg) + "</td><td align='left'>气压（hpa）：</td><td align='left'>" + util.toFixedTwo(siteNew.paAvg) + "</td></tr>" +
              "<tr><td align='left'>风速（m/s）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc1) + "</td><td align='left'>风向（°）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc2) + "</td></tr>" +
              "<tr><td align='left'>相对湿度：</td><td align='left'>" + util.toFixedTwo(siteNew.rhAvg) + "</td><td align='left'>海水皮温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.ptempAvg) + "</td></tr>" +
              "</table>";
            this.content.innerHTML = html;
            //this.overlay.setOffset([0, 0]);
            this.overlay.setPosition(feature.getGeometry().getCoordinates());
          }
        } else if (this.siteId == 2) {
          this.popup_title = "西人工岛气象站最新数据";
          //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
          var siteNew = response.data;
          if (siteNew != null) {
            //组织弹出框内容
            var html = "";
            //气象站
            html +=
              "<table>" +
              "<tr><td align='left'>时间：</td><td align='left'>" + util.formatDateTime(new Date(siteNew.dt)) + "</td></tr>" +
              "<tr><td align='left'>气温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.taAvg) + "</td><td align='left'>气压（hpa）：</td><td align='left'>" + util.toFixedTwo(siteNew.paAvg) + "</td></tr>" +
              "<tr><td align='left'>风速（m/s）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc1) + "</td><td align='left'>风向（°）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc2) + "</td></tr>" +
              "<tr><td align='left'>相对湿度：</td><td align='left'>" + util.toFixedTwo(siteNew.rhAvg) + "</td><td align='left'>海水皮温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.ptempAvg) + "</td></tr>" +
              "<tr><td align='left'>能见度(km)：</td><td align='left'>" + util.toFixedTwo(siteNew.njd) + "</td><td align='left'>降水(mm)：</td><td align='left'>" + util.toFixedTwo(siteNew.rain) + "</td></tr>" +
              "</table>";
            this.content.innerHTML = html;
            //this.overlay.setOffset([0, 0]);
            this.overlay.setPosition(feature.getGeometry().getCoordinates());
          }
        } else if (this.siteId == 3) {
          this.popup_title = "龙穴船厂气象站最新数据";
          //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
          var siteNew = response.data;
          if (siteNew != null) {
            //组织弹出框内容
            var html = "";
            //气象站
            html +=
              "<table>" +
              "<tr><td align='left'>时间：</td><td align='left'>" + util.formatDateTime(new Date(siteNew.dt)) + "</td></tr>" +
              "<tr><td align='left'>气温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.taAvg) + "</td><td align='left'>气压（hpa）：</td><td align='left'>" + util.toFixedTwo(siteNew.paAvg) + "</td></tr>" +
              "<tr><td align='left'>风速（m/s）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc1) + "</td><td align='left'>风向（°）：</td><td align='left'>" + util.toFixedTwo(siteNew.wsWvc2) + "</td></tr>" +
              "<tr><td align='left'>相对湿度：</td><td align='left'>" + util.toFixedTwo(siteNew.rhAvg) + "</td><td align='left'>海水皮温（℃）：</td><td align='left'>" + util.toFixedTwo(siteNew.ptempAvg) + "</td></tr>" +
              "<tr><td align='left'>能见度(km)：</td><td align='left'>" + util.toFixedTwo(siteNew.njd) + "</td><td align='left'>降水(mm)：</td><td align='left'>" + util.toFixedTwo(siteNew.rain) + "</td></tr>" +
              "</table>";
            this.content.innerHTML = html;
            //this.overlay.setOffset([0, 0]);
            this.overlay.setPosition(feature.getGeometry().getCoordinates());
          }
        }

      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    },
    /**
     * 显示platform平台弹出框
     * @param feature
     */
    platformPopShow(feature) {
      this.ol_popup_min_width = "380px";
      var api = `/api/SZTDService/queryPlatformNew.action`;
      this.$axios.get(api).then((response) => {
        //构建Popup_title文字内容
        this.popup_title = "西人工岛观测站最新数据";
        //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
        var platformNew = response.data;
        if (platformNew != null) {
          //组织弹出框内容
          var html = "";
          //表层CTD
          html +=
            "<table>" +
            "<tr><th align='left'>" + "表层CTD" + "</th><th align='left'>" + util.formatDateTime(new Date(platformNew.topCtdNew.dt)) + "</th></tr>" +
            "<tr><td align='left'>深度（m）：</td><td align='left'>" + util.toFixedTwo(platformNew.topCtdNew.wp) + "</td><td align='left'>温度（℃）：</td><td align='left'>" + util.toFixedTwo(platformNew.topCtdNew.wt) + "</td></tr>" +
            "<tr><td align='left'>盐度：</td><td align='left'>" + util.toFixedTwo(platformNew.topCtdNew.sl) + "</td><td align='left'>密度（kg/m³）：</td><td align='left'>" + util.toFixedTwo(platformNew.topCtdNew.density) + "</td></tr>" +
            "</table>";
          //底层CTD
          html +=
            "<table>" +
            "<tr><th align='left'>" + "底层CTD" + "</th><th align='left'>" + util.formatDateTime(new Date(platformNew.bottomCtdNew.dt)) + "</th></tr>" +
            "<tr><td align='left'>深度（m）：</td><td align='left'>" + util.toFixedTwo(platformNew.bottomCtdNew.wp) + "</td><td align='left'>温度（℃）：</td><td align='left'>" + util.toFixedTwo(platformNew.bottomCtdNew.wt) + "</td></tr>" +
            "<tr><td align='left'>盐度：</td><td align='left'>" + util.toFixedTwo(platformNew.bottomCtdNew.sl) + "</td><td align='left'>密度（kg/m³）：</td><td align='left'>" + util.toFixedTwo(platformNew.bottomCtdNew.density) + "</td></tr>" +
            "</table>";
          //潮位计
          html +=
            "<table>" +
            "<tr><th align='left'>" + "潮位计" + "</th><th align='left'>" + util.formatDateTime(new Date(platformNew.tideNew.dt)) + "</th></tr>" +
            "<tr><td align='left'>潮位（cm）：</td><td align='left'>" + util.toFixedTwo(platformNew.tideNew.wlCorrect) + "</td></tr>" +
            "</table>";
          this.content.innerHTML = html;
          //this.overlay.setOffset([100, 100]);
          this.overlay.setPosition(feature.getGeometry().getCoordinates());
          //var ttt=this.overlay.getPositioning();
          //this.overlay.setPositioning('bottom-center');
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    }
    ,
    /**
     * 显示buoy123弹出框
     * @param feature
     */
    buoy123PopShow(feature) {
      this.ol_popup_min_width = "400px";
      var api = `/api/SZTDService/queryBuoy123New.action?id=${this.buoyId}`;
      this.$axios.get(api).then((response) => {
        //构建Popup_title文字内容
        this.popup_title = this.buoyId + "号浮标最新数据";
        //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
        var buoy123New = response.data;
        if (buoy123New != null) {
          //组织弹出框内容
          var html = "";
          if (buoy123New.buoywvnew != null) {
            //浮标123：海浪
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海浪" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy123New.buoywvnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>1/10波高（m）：</td><td align='left'>" + buoy123New.buoywvnew.tenwh + "</td><td align='left'>1/10波高周期（s）：</td><td align='left'>" + buoy123New.buoywvnew.tenwht + "</td></tr>" +
              "<tr><td align='left'>平均波高（m）：</td><td align='left'>" + buoy123New.buoywvnew.averwh + "</td><td align='left'>平均波高周期（s）：</td><td align='left'>" + buoy123New.buoywvnew.averwht + "</td></tr>" +
              "<tr><td align='left'>最大波高（m）：</td><td align='left'>" + buoy123New.buoywvnew.maxwh + "</td><td align='left'>最大波高周期（s）：</td><td align='left'>" + buoy123New.buoywvnew.maxwht + "</td></tr>" +
              "<tr><td align='left'>有效波高（m）：</td><td align='left'>" + buoy123New.buoywvnew.sigwh + "</td><td align='left'>有效波高周期（s）：</td><td align='left'>" + buoy123New.buoywvnew.sigwht + "</td></tr>" +
              "<tr><td align='left'>主波向（°）：</td><td align='left'>" + buoy123New.buoywvnew.maindire + "</td></tr>" +
              "</table>";
          }
          if (buoy123New.buoygpsnew != null && buoy123New.fubnew != null) {
            //浮标123：海流
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海流" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy123New.fubnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>水下5米流速（m/s）：</td><td align='left'>" + util.toFixedTwo(buoy123New.fubnew.flowv / 1000) + "</td></tr>" +
              "<tr><td align='left'>水下5米流向（°）：</td><td align='left'>" + util.toFixedTwo(buoy123New.fubnew.flowdire / 10) + "</td></tr>" +
              "</table>";
          }
          this.content.innerHTML = html;
          //this.overlay.setOffset([100, 100]);
          this.overlay.setPosition(feature.getGeometry().getCoordinates());
          //this.overlay.setPositioning('top-left');
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    }
    ,
    /**
     * 显示buoy4弹出框
     * @param feature
     */
    buoy4PopShow(feature) {
      this.ol_popup_min_width = "380px";
      var api = `/api/SZTDService/queryBuoy4New.action?id=${this.buoyId}`;
      this.$axios.get(api).then((response) => {
        //构建Popup_title文字内容
        this.popup_title = this.buoyId + "号浮标最新数据";
        //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
        var buoy4New = response.data;
        if (buoy4New != null) {
          //组织弹出框内容
          var html = "";
          if (buoy4New.buoywvnew != null) {
            //浮标4：海浪
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海浪" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy4New.buoywvnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>1/10波高（m）：</td><td align='left'>" + buoy4New.buoywvnew.tenwh + "</td><td align='left'>1/10波高周期（s）：</td><td align='left'>" + buoy4New.buoywvnew.tenwht + "</td></tr>" +
              "<tr><td align='left'>平均波高（m）：</td><td align='left'>" + buoy4New.buoywvnew.averwh + "</td><td align='left'>平均波高周期（s）：</td><td align='left'>" + buoy4New.buoywvnew.averwht + "</td></tr>" +
              "<tr><td align='left'>最大波高（m）：</td><td align='left'>" + buoy4New.buoywvnew.maxwh + "</td><td align='left'>最大波高周期（s）：</td><td align='left'>" + buoy4New.buoywvnew.maxwht + "</td></tr>" +
              "<tr><td align='left'>有效波高（m）：</td><td align='left'>" + buoy4New.buoywvnew.sigwh + "</td><td align='left'>有效波高周期（s）：</td><td align='left'>" + buoy4New.buoywvnew.sigwht + "</td></tr>" +
              "<tr><td align='left'>主波向（°）：</td><td align='left'>" + buoy4New.buoywvnew.maindire + "</td></tr>" +
              "</table>";
          }
          if (buoy4New.buoygpsnew != null && buoy4New.fubnew != null) {
            //浮标4：海流
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海流" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy4New.fubnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>水下5米流速（m/s）：</td><td align='left'>" + util.toFixedTwo(buoy4New.fubnew.flowv / 1000) + "</td></tr>" +
              "<tr><td align='left'>水下5米流向（°）：</td><td align='left'>" + util.toFixedTwo(buoy4New.fubnew.flowdire / 10) + "</td></tr>"
            "</table>";
          }
          if (buoy4New.topCtdNew != null) {
            //表层CTD
            html +=
              "<table>" +
              "<tr><th align='left'>" + "表层CTD" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy4New.topCtdNew.dt)) + "</th></tr>" +
              "<tr><td align='left'>深度（m）：</td><td align='left'>" + 3 + "</td><td align='left'>温度（°）：</td><td align='left'>" + util.toFixedTwo(buoy4New.topCtdNew.wt) + "</td></tr>" +
              "<tr><td align='left'>盐度：</td><td align='left'>" + util.toFixedTwo(buoy4New.topCtdNew.sl) + "</td><td align='left'>密度（ kg/m³）：</td><td>" + util.toFixedTwo(buoy4New.topCtdNew.density) + "</td></tr>" +
              "</table>";
          }
          // if (buoy4New.bottomCtdNew != null) {
          //   //底层CTD
          //   html +=
          //     "<table>" +
          //     "<tr><th align='left'>" + "底层CTD" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy4New.bottomCtdNew.dt)) + "</th></tr>" +
          //     "<tr><td align='left'>深度（m）：</td><td align='left'>" + util.toFixedTwo(buoy4New.bottomCtdNew.wp) + "</td><td align='left'>温度（°）：</td><td align='left'>" + util.toFixedTwo(buoy4New.bottomCtdNew.wt) + "</td></tr>" +
          //     "<tr><td align='left'>盐度：</td><td align='left'>" + util.toFixedTwo(buoy4New.bottomCtdNew.sl) + "</td><td align='left'>密度（ kg/m³）：</td><td align='left'>" + util.toFixedTwo(buoy4New.bottomCtdNew.density) + "</td></tr>" +
          //     "</table>";
          // }
          this.content.innerHTML = html;
          //this.overlay.setOffset([0, 0]);
          this.overlay.setPosition(feature.getGeometry().getCoordinates());
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    }
    ,
    /**
     * 显示buoy67弹出框
     * @param feature
     */
    buoy67PopShow(feature) {
      this.ol_popup_min_width = "400px";
      var api = `/api/SZTDService/queryBuoy67New.action?id=${this.buoyId}`;
      this.$axios.get(api).then((response) => {
        //构建Popup_title文字内容
        this.popup_title = (this.buoyId - 5) + "号航标最新数据";
        //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
        var buoy67New = response.data;
        if (buoy67New != null) {
          //组织弹出框内容
          var html = "";
          if (buoy67New.buoywvnew != null) {
            //浮标67：海浪
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海浪" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy67New.buoywvnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>1/10波高（m）：</td><td align='left'>" + buoy67New.buoywvnew.tenwh + "</td><td align='left'>1/10波高周期（s）：</td><td align='left'>" + buoy67New.buoywvnew.tenwht + "</td></tr>" +
              "<tr><td align='left'>平均波高（m）：</td><td align='left'>" + buoy67New.buoywvnew.averwh + "</td><td align='left'>平均波高周期（s）：</td><td align='left'>" + buoy67New.buoywvnew.averwht + "</td></tr>" +
              "<tr><td align='left'>最大波高（m）：</td><td align='left'>" + buoy67New.buoywvnew.maxwh + "</td><td align='left'>最大波高周期（s）：</td><td align='left'>" + buoy67New.buoywvnew.maxwht + "</td></tr>" +
              "<tr><td align='left'>有效波高（m）：</td><td align='left'>" + buoy67New.buoywvnew.sigwh + "</td><td align='left'>有效波高周期（s）：</td><td align='left'>" + buoy67New.buoywvnew.sigwht + "</td></tr>" +
              "<tr><td align='left'>主波向（°）：</td><td align='left'>" + buoy67New.buoywvnew.maindire + "</td></tr>" +
              "</table>";
          }
          if (buoy67New.buoygpsnew != null && buoy67New.fubnew != null) {
            //浮标67：海流
            html +=
              "<table>" +
              "<tr><th align='left'>" + "海流" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy67New.fubnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>水下5米流速（m/s）：</td><td align='left'>" + util.toFixedTwo(buoy67New.fubnew.flowv / 1000) + "</td></tr>" +
              "<tr><td align='left'>水下5米流向（°）：</td><td align='left'>" + util.toFixedTwo(buoy67New.fubnew.flowdire / 10) + "</td></tr>"
            "</table>";
          }
          if (buoy67New.ctdnew != null) {
            // ctd
            html +=
              "<table>" +
              "<tr><th align='left'>" + "CTD" + "</th><th align='left'>" + util.formatDateTime(new Date(buoy67New.ctdnew.dt)) + "</th></tr>" +
              "<tr><td align='left'>深度（m）：</td><td align='left'>" + 3 + "</td><td align='left'>温度（°）：</td><td align='left'>" + util.toFixedTwo(buoy67New.ctdnew.wt) + "</td></tr>" +
              "<tr><td align='left'>盐度：</td><td align='left'>" + util.toFixedTwo(buoy67New.ctdnew.sl) + "</td><td align='left'>密度（ kg/m³）：</td><td>" + util.toFixedTwo(buoy67New.ctdnew.density) + "</td></tr>" +
              "</table>";
          }
          if (buoy67New.weathersitenew != null) {
            //气象站
            html +=
              "<table>" +
              "<tr><th align='left'>气象</th><th align='left'>" + util.formatDateTime(new Date(buoy67New.weathersitenew.dt)) + "</th></tr>" +
              "<tr><td align='left'>气温（℃）：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.taAvg) + "</td><td align='left'>气压（hpa）：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.paAvg) + "</td></tr>" +
              "<tr><td align='left'>风速（m/s）：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.wsWvc1) + "</td><td align='left'>风向（°）：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.wsWvc2) + "</td></tr>" +
              "<tr><td align='left'>相对湿度：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.rhAvg) + "</td><td align='left'>海水皮温（℃）：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.ptempAvg) + "</td></tr>" +
              "<tr><td align='left'>能见度(km)：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.njd) + "</td><td align='left'>降水(mm)：</td><td align='left'>" + util.toFixedTwo(buoy67New.weathersitenew.rain) + "</td></tr>" +
              "</table>";
          }
          this.content.innerHTML = html;
          //this.overlay.setOffset([0, 0]);
          this.overlay.setPosition(feature.getGeometry().getCoordinates());
        }
      }).catch((response) => {
        //失败回调
        this.$confirm('服务器失联！', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        });
      }).finally((response) => {

      })
    }
    ,
    /**
     * 获取浮标的位置
     * @param
     */
    getBuoy(id) {
      var buoyLongt;
      var buoyLat;

      if (id == 1) {
        buoyLongt = 113 + 45 * 1 / 60 + 9.42 * 1 / 3600;
        buoyLat = 22 + 29 * 1 / 60 + 6.3 * 1 / 3600;
      } else if (id == 2) {
        buoyLongt = 113 + 46 * 1 / 60 + 32.93 * 1 / 3600;
        buoyLat = 22 + 33 * 1 / 60 + 43.51 * 1 / 3600;
      } else if (id == 3) {
        buoyLongt = 113 + 41 * 1 / 60 + 58.14 * 1 / 3600;
        buoyLat = 22 + 37 * 1 / 60 + 51.51 * 1 / 3600;
      } else if (id == 4) {
        buoyLongt = 113 + 47 * 1 / 60 + 21.12 * 1 / 3600;
        buoyLat = 22 + 10 * 1 / 60 + 36.48 * 1 / 3600;
      } else if (id == 6) {
        buoyLongt = 113 + 47 * 1 / 60 + 39.70 * 1 / 3600;
        buoyLat = 22 + 17 * 1 / 60 + 31.80 * 1 / 3600;
      }

      var buoy = new Feature({
        geometry: new Point(fromLonLat([buoyLongt, buoyLat])),
        name: "Buoy" + id,
      });

      var style = new Style({
        image: new Icon({
          src: this.buoyIconUrl,
          scale: 0.2
        })
      });

      buoy.setId("Buoy" + id);
      buoy.setStyle(style);
      this.buoy_layer.getSource().addFeature(buoy);
    }
    ,
    /**
     * 获取气象站的位置
     * @param
     */
    getSite(id) {
      var siteLongt;
      var siteLat;

      if (id == 1) {//桂山牛头岛气象站
        siteLongt = 113.8;
        siteLat = 22.1735;
      } else if (id == 2) {//西人工岛气象站
        siteLongt = 113.76614504835997;
        siteLat = 22.572448118606196;
      } else if (id == 3) {//龙穴船厂气象站
        siteLongt = 113.64944420306698;
        siteLat = 22.70713102721437;
      }

      var site = new Feature({
        geometry: new Point(fromLonLat([siteLongt, siteLat])),
        name: "Site" + id,
      });

      var style = new Style({
        image: new Icon({
          src: this.siteIconUrl,
          scale: 0.2
        })
      });


      site.setId("Site" + id);
      site.setStyle(style);
      this.site_layer.getSource().addFeature(site);
    }
    ,
    showRealTimeMonitorModal() {
      this.$emit('openRealTimeMonitorModalHome');
    }
    ,
    /*****************************************************数值产品地图操作*****************************************************/
    /**
     * 地图区域鼠标点击事件
     * @param e
     */
    singleClickOnMap(e) {
      //如果点击处有feature则返回
      var pixel = e.pixel;//获取地图上坐标
      var lonlat = toLonLat(this.map.getCoordinateFromPixel(e.pixel));
      var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
      if (hit) {
        return;
      }

      //判断是否有数值产品图层
      if (this.productionLyrs.length != 0) {
        for (var i = 0; i < this.productionLyrs.length; i++) {
          var arr = this.productionLyrs[i].get('name').split("/");
          //是否有气象数据十米风场图层
          if (this.productionLyrs[i].get('name').search(/Atm_10mWindU10V10/) != -1) {
            this.$emit('drawWindTimeSeries', "10mWindTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有气象数据500hpa风场图层
          if (this.productionLyrs[i].get('name').search(/Atm_500hPaWindUUVV/) != -1) {
            this.$emit('drawWindTimeSeries', "500hpaWindTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有气象数据200hPa风场图层
          if (this.productionLyrs[i].get('name').search(/Atm_200hPaWindUUVV/) != -1) {
            this.$emit('drawWindTimeSeries', "200hpaWindTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有精细化气象数据十米风场图层
          if (this.productionLyrs[i].get('name').search(/AtmRefine_10mWindU10V10/) != -1) {
            this.$emit('drawWindTimeSeries', "refine10mWindTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有海流数据图层
          if (this.productionLyrs[i].get('name').search(/Current_UV/) != -1) {
            var siglay = Number(arr[5].split("_")[2].substr(0, arr[5].split("_")[2].length - 1));
            this.$emit('drawCurrentTimeSeries', siglay, arr[4], lonlat);
            break;
          }
          //是否有海浪浪高数据图层
          if (this.productionLyrs[i].get('name').search(/Wave_HS/) != -1) {
            this.$emit('drawWaveTimeSeries', "HSDIRWaveTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有海浪浪向数据图层
          if (this.productionLyrs[i].get('name').search(/Wave_DIR/) != -1) {
            this.$emit('drawWaveTimeSeries', "HSDIRWaveTimeSeries", arr[4], lonlat);
            break;
          }
          //是否有海浪周期数据图层
          if (this.productionLyrs[i].get('name').search(/Wave_TPS/) != -1) {
            this.$emit('drawWaveTimeSeries', "TPSWaveTimeSeries", arr[4], lonlat);
            break;
          }

        }
      }
    }
    ,
    /**
     * 向地图上添加数值产品
     * @param url
     * @param extent
     */
    addPictureToMap(url, extent) {

      var imgExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
      var projection = new Projection({
        code: 'EPSG:3857',
        units: 'degrees',
        extent: imgExtent
      });
      var layer = new ImageLayer({
        name: url,
        source: new Static({
          url: url,
          crossOrigin: '',
          projection: projection,
          imageExtent: imgExtent
        })
      })
      this.map.addLayer(layer)
      this.productionLyrs.push(layer);
      //缩放到当前地图范围
      // this.map.getView().fit(imgExtent,this.map.getSize());

      // //TODO 图例部分
      // if (url.search(/Atm_10mWindU10V10/) != -1) {
      //   this.curLegend.push(this.legends.tenMWind);
      // } else if (url.search(/Atm_200hPaWindUUVV/) != -1) {
      //   this.curLegend.push(this.legends.twoHpaWind);
      // } else if (url.search(/Atm_RaincRainnc/) != -1) {
      //   this.curLegend.push(this.legends.rain)
      // } else if (url.search(/Wave_HS_Contourf/) != -1) {
      //   this.curLegend.push(this.legends.wave);
      // } else if (url.search(/AtmRefine_10mWindU10V10/) != -1) {
      //   this.curLegend.push(this.legends.tenMWind);
      // } else if (url.search(/AtmRefine_Rainnc/) != -1) {
      //   this.curLegend.push(this.legends.rain);
      // } else if (url.search(/Current_UV_/) != -1) {
      //   this.curLegend.push(this.legends.current);
      // } else if (url.search(/Current_Salinity/) != -1) {
      //   this.curLegend.push(this.legends.salinity);
      // } else if (url.search(/Wave_TPS_Contourf/) != -1) {
      //   this.curLegend.push(this.legends.waveTPS);
      // }
    }
    ,
    /**
     * 清除底图上当前的数值产品
     */
    cleanMapPro() {
      //遍历this.productionLyrs，并将所有图层从地图上移除
      for (var i = 0; i < this.productionLyrs.length; i++) {
        this.map.removeLayer(this.productionLyrs[i]);
      }
      this.productionLyrs.splice(0, this.productionLyrs.length);
      this.curLegend.splice(0, this.curLegend.length);
    }
    ,
    /**
     * 判断地图是否缩放，
     * 若缩放，则判断是否有数据产品图层
     * 如果有，则更新数据产品层级
     * @param e
     */
    zoomEvent(e) {
      //判断地图是否缩放,无缩放则返回
      var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
      if (this.oldZoom == zoom)
        return;
      //若缩放，记录当前缩放层级
      this.oldZoom = zoom;

      //判断是否有数据产品图层，若无则返回
      if (this.productionLyrs.length == 0)
        return;

      //若有数据产品图层，则更新数据产品层级
      this.refreshProduction(zoom)
    }
    ,
    /**
     * 更新当前数据产品层级
     * @param zoom
     */
    refreshProduction(zoom) {
      console.log(zoom);
      for (var i = 0; i < this.productionLyrs.length; i++) {
        if (this.productionLyrs[i].get('name').includes("AtmRefine_10mWindVane")) {
          //获取当前图层的范围、url、投影
          var imgExtent = this.productionLyrs[i].getSource().getImageExtent();
          var url = this.productionLyrs[i].getSource().getUrl();
          var projection = this.productionLyrs[i].getSource().getProjection();

          //根据缩放层级修改修改url
          var newUrl = "";
          if (zoom <= 10) {
            if (url.includes("_L2")) {
              newUrl = url.replace("_L2", "_L1");
            }
          } else {
            if (url.includes("_L1")) {
              newUrl = url.replace("_L1", "_L2");
            }
          }
          if (newUrl != "") {
            //重新加载数据产品
            var source = new Static({
              url: newUrl,
              crossOrigin: '',
              projection: projection,
              imageExtent: imgExtent
            });
            this.productionLyrs[i].setSource(source);
          }

        }
        if (this.productionLyrs[i].get('name').includes("Current_UVDir")) {
          //获取当前图层的范围、url、投影
          var imgExtent = this.productionLyrs[i].getSource().getImageExtent();
          var url = this.productionLyrs[i].getSource().getUrl();
          var projection = this.productionLyrs[i].getSource().getProjection();

          //根据缩放层级修改修改url
          var newUrl = "";
          if (zoom <= 11) {
            if (url.includes("_L2")) {
              newUrl = url.replace("_L2", "_L1");
            }
          } else {
            if (url.includes("_L1")) {
              newUrl = url.replace("_L1", "_L2");
            }
          }
          if (newUrl != "") {
            //重新加载数据产品
            var source = new Static({
              url: newUrl,
              crossOrigin: '',
              projection: projection,
              imageExtent: imgExtent
            });
            this.productionLyrs[i].setSource(source);
          }
        }
        if (this.productionLyrs[i].get('name').includes("Wave_DIR")) {
          //获取当前图层的范围、url、投影
          var imgExtent = this.productionLyrs[i].getSource().getImageExtent();
          var url = this.productionLyrs[i].getSource().getUrl();
          var projection = this.productionLyrs[i].getSource().getProjection();

          //根据缩放层级修改修改url
          var newUrl = "";
          if (zoom <= 11) {
            if (url.includes("_L2")) {
              newUrl = url.replace("_L2", "_L1");
            }
          } else {
            if (url.includes("_L1")) {
              newUrl = url.replace("_L1", "_L2");
            }
          }
          if (newUrl != "") {
            //重新加载数据产品
            var source = new Static({
              url: newUrl,
              crossOrigin: '',
              projection: projection,
              imageExtent: imgExtent
            });
            this.productionLyrs[i].setSource(source);
          }
        }
      }
    }
  }
  ,
  mounted: function () {
    this.mapInit();
    this.addBridge();
    this.addIsland();
    this.addRoute();
    this.addPlatform();
    this.addBuoy();
    this.addSite();
  }
}
</script>

<style scoped>
#tdtmap {
  height: 100%
}

ol-viewport {
  /*完全透明*/
  background-color: rgba(0, 0, 0, 0);
  /*完全不透明*/
  /*background-color: rgba(0, 0, 0, 1);*/
}

.ol-popup {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.85);
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  /*min-width: 340px*/
  /*width:fit-content;*/
  /*min-width: 210px*/
  /*opacity: 0.5; !*透明度 *!*/
}

.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.popup-title {
  font-weight: bold;
  border-bottom: 1px solid #cccccc;
  /*padding: 5px 8px;*/
}

.popup-content {
  padding: 5px 8px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
  content: "✖";
}

/*.popupBoot{*/
/*width:6;*/
/*}*/

.popover {
  max-width: 1000px;
}

.productionTitle {
  /*font-size:200%;*/
  font-weight: bold;
}


</style>
