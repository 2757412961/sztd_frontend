<template>
  <div style="position: absolute;bottom:0;top:60px;right:0px;left:60px">
    <div id="tdtmap" style="">
      <div id="popup" class="ol-popup">
        <div id="popup-title" class="popup-title">最新数据</div>
        <div id="popup-content"></div>
      </div>
      <SiteLast12Modal ref="siteLast12Modal"></SiteLast12Modal>
    </div>
    <div id="mouse-position" style="position: absolute;right:50px;top:10px;"></div>
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
  import Point from 'ol/geom/Point';
  import Style from 'ol/style/Style';
  import Icon from 'ol/style/Icon';
  import 'ol/ol.css'
  import {fromLonLat} from 'ol/proj';
  import {transformExtent} from 'ol/proj';
  import {toLonLat} from 'ol/proj.js';
  import {toStringHDMS} from 'ol/coordinate';
  import Projection from "ol/proj/Projection";
  import Select from 'ol/interaction/Select';
  import {singleClick} from 'ol/events/condition';
  import SiteLast12Modal from "../components/SiteLast12Modal";
  import Static from 'ol/source/ImageStatic.js';
  import ImageLayer from 'ol/layer/Image.js';
  import MousePosition from 'ol/control/MousePosition.js';
  import {createStringXY} from 'ol/coordinate.js';
  import {defaults as defaultControls} from 'ol/control.js';

  export default {
    name: "map-layout",
    components: {SiteLast12Modal},
    data() {
      return {
        map: "",//地图
        platformCTD_layer: "",//CTD图层
        platformTIDE_layer: "",//Tide图层

        productionLyrs:[],

        //popup三兄弟
        container: "",
        content: "",
        overlay: "",

        lastPointerFeature: null,//记录上一次光标指向的feature
        proHit: false,//记录弹框状态
        //openlayer图片的src使用方法！！
        iconUrl: require('../assets/logo.png')
      }
    },
    methods: {
      /**
       * 向底图上添加Ctd
       */
      addCtd() {
        //清空feature
        //this.platformCTD_layer.clear();
        this.platformCTD_layer.getSource().clear();

        /** 浮标初始化*/
        var ctd1 = new Feature({
          //geometry: new Point(fromLonLat([113.74, 22.54])),
          geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600])),
          name: "CTD1",
        });
        var ctd2 = new Feature({
          //geometry: new Point(fromLonLat([113.74, 22.64])),
          geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600])),
          name: "CTD2",
        });
        var style = new Style({
          image: new Icon({
            src: this.iconUrl,
            scale: 0.2
          })
        });
        ctd1.setStyle(style);
        ctd2.setStyle(style);
        this.getFeatureProperty(ctd1);
        this.getFeatureProperty(ctd2);
        this.platformCTD_layer.getSource().addFeatures([ctd2, ctd1]);
      },
      /**
       * 向地图上添加Tide
       */
      addTide() {
        //清空feature
        this.platformTIDE_layer.getSource().clear();

        var tide1 = new Feature({
          //113°45′47.20497″，22°34′35.73474″
          geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600])),
          name: "TIDE1",
        });
        var style = new Style({
          image: new Icon({
            src: this.iconUrl,
            scale: 0.2
          })
        });
        tide1.setStyle(style);
        this.getFeatureProperty(tide1);
        //this.platformTIDE_layer.getSource().addFeatures([tide1]);
        this.platformTIDE_layer.getSource().addFeatures([tide1]);
      },
      /**
       * 请求并组织feature属性数据
       * @param feature
       */
      getFeatureProperty(feature) {
        if (feature.get('name').includes("CTD")) {
          //CTD
          var api = `/api/SZTDService/queryCtdNew.action`;
          this.$axios.get(api, {
            params: {
              id: feature.get('name').substring(3),
            }
          }).then((response) => {
            //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
            var ctdData = response.data;
            if (ctdData != null) {
              var time = new Date(ctdData.dt);
              var formatTime = this.formatDateTime(time);
              //为feature添加属性
              var proper = {
                "name": feature.get('name'),
                "ctdid": ctdData.tideid,
                "dt": formatTime,
                "wp": ctdData.wp,
                "wt": ctdData.wt,
                "sl": ctdData.sl,
              }
              feature.setProperties(proper, true);
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
            //this.queryStatus = false;
          })
        }
        else {
          //潮位计
          var api = `/api/SZTDService/queryTideNew.action`;
          this.$axios.get(api, {
            params: {
              id: feature.get('name').substring(4),
            }
          }).then((response) => {
            var tideData = response.data;
            if (tideData != null) {
              var time = new Date(tideData.dt);
              var formatTime = this.formatDateTime(time);
              //为feature添加属性
              var proper = {
                "name": feature.get('name'),
                "tideid": tideData.tideid,
                "dt": formatTime,
                "pr": tideData.pr,
                "wl": tideData.wl
              }

              feature.setProperties(proper, true);
            }
            else
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
          }).catch((response) => {
            //失败回调
            this.$confirm(response.data, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response) => {
            //this.queryStatus = false;
          })
        }
      },
      /**
       * 地图初始化
       */
      mapInit() {
        /** 地图图层初始化*/
        //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
        //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
        var map_source = new XYZ({
          url: "http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
        });
        var map_layer = new TileLayer({
          source: map_source
        });

        /** 平台CTD矢量图层初始化*/
        var platformCTD_source = new Vector({
          features: null
        });
        this.platformCTD_layer = new VectorLayer({
          name: "platformCTD_layer",
          chName: "CTD平台图层",
          source: platformCTD_source
        });

        /** 平台TIDE矢量图层初始化*/
        var platformTIDE_source = new Vector({
          features: null
        });

        this.platformTIDE_layer = new VectorLayer({
          name: "platformTIDE_layer",
          chName: "TIDE平台图层",
          source: platformTIDE_source
        });

        /** 视图初始化*/
        var view = new View({
          center: fromLonLat([113.8, 22.45]),
          zoom: 10,
          minZoom: 5,
          maxZoom: 13,
        });
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
          layers: [map_layer, this.platformTIDE_layer, this.platformCTD_layer],
          view: view,
          controls:defaultControls().extend([mousePositionControl]),
        });
        /**
         * Elements that make up the popup.
         */
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.overlay = new Overlay({
          element: this.container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          },
          offset: [10, -20],
          //position: fromLonLat([113.74, 22.44]),
        });
        this.map.addOverlay(this.overlay);

        //鼠标移动事件绑定
        this.map.on('pointermove', this.mouseMove);
        //鼠标点击地图响应事件绑定
        this.map.on('singleclick',this.singleClickOnMap);

        //鼠标点击feature事件绑定
        var selectClick = new Select({
            condition: singleClick,
            multi: true,
          });
        this.map.addInteraction(selectClick);
        selectClick.on("select", this.singleClick);
      },

      /**
       * 显示属性信息弹出框
       * @param coordinate
       * @param features
       */
      popShow(coordinate, features) {
        var html = "";
        for (var i = 2; i >=0; i--) {
          if(features[i]==undefined)
            return;
          if (features[i].get('name') == 'CTD1' || features[i].get('name') == 'CTD2') {
            html +=
              "<table>" +
              "<tr><th>" + features[i].get('name') + "</th></tr>" +
              "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
              "<tr><td>深度：</td><td>" + features[i].get('wp') + "</td></tr>" +
              "<tr><td>温度：</td><td>" + features[i].get('wt') + "</td></tr>" +
              "<tr><td>盐度：</td><td>" + features[i].get('sl') + "</td></tr>" +
              "</table>";
          }
          else {
            html +=
              "<table>" +
              "<tr><th>" + features[i].get('name') + "</th></tr>" +
              "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
              "<tr><td>水压：</td><td>" + features[i].get('pr') + "</td></tr>" +
              "<tr><td>潮位：</td><td>" + features[i].get('wl') + "</td></tr>" +
              "</table>";
          }
        }
        html += "</table>";
        this.content.innerHTML = html;
        this.overlay.setPosition(coordinate);
      },
      /**
       * 点击feature响应事件(只有在选中Feature时才会触发）
       * @param e
       */
      singleClick(e) {
        var features = e.target.getFeatures().getArray();
        if (features.length!=3)
          return;
        else {
          //显示最近12小时数的时间序列数据
          this.$refs.siteLast12Modal.openSiteLast12Modal(features)
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
        var highlightStyle = new Style({
          image: new Icon({
            src: this.iconUrl,
            scale: 0.3
          })
        });
        var style = new Style({
          image: new Icon({
            src: this.iconUrl,
            scale: 0.2
          })
        });
        if(hit)
        {
          var features=this.map.getFeaturesAtPixel(pixel);
          features[0].setStyle(highlightStyle);
          this.popShow(features[0].getGeometry().getCoordinates(), features);
        }
        else
        {
          var features1=this.platformCTD_layer.getSource().getFeatures();
          var features2=this.platformTIDE_layer.getSource().getFeatures();
          for(var i=0;i<features1.length;i++)
          {
            features1[i].setStyle(style);
          }
          for(var i=0;i<features2.length;i++)
          {
            features2[i].setStyle(style);
          }
          this.overlay.setPosition(undefined);

          // this.lastpointerFeature = null;//记录本次feature
          this.proHit = false;//更改弹窗状态
          return;
        }

      },
      /**
       * 地图区域鼠标点击事件
       * @param e
       */
      singleClickOnMap(e){
        //如果点击处有feature则返回
        var pixel = e.pixel;//获取地图上坐标
        var lonlat = toLonLat(this.map.getCoordinateFromPixel(e.pixel));
        var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
        if(hit){
          return ;
        }

        //判断是否有数值产品图层
        if(this.productionLyrs.length!=0){
          for(var i=0;i<this.productionLyrs.length;i++){
            //是否有气象数据十米风场图层
            if(this.productionLyrs[i].get('name').search(/Atm_10mWind/)!=-1){
              this.$emit('drawTimeSeries',"WindTimeSeries",lonlat);
            }

          }

        }

      },
      /**
       * 转换时间格式
       * @param theDate
       * @returns {string}
       */
      formatDateTime: function (theDate) {
          var _hour = theDate.getHours();
          var _minute = theDate.getMinutes();
          var _second = theDate.getSeconds();
          var _year = theDate.getFullYear();
          var _month = theDate.getMonth();
          var _date = theDate.getDate();
          if (_hour < 10) {
            _hour = "0" + _hour;
          }
          if (_minute < 10) {
            _minute = "0" + _minute;
          }
          if (_second < 10) {
            _second = "0" + _second;
          }
          _month = _month + 1;
          if (_month < 10) {
            _month = "0" + _month;
          }
          if (_date < 10) {
            _date = "0" + _date;
          }
          return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
        },
      /**
       * 设置定时器以便定时更新CTD、TIDE的数据
       */
      inv: function () {
        //20000ms
        setInterval(() => {
          this.addCtd();
          this.addTide()
        }, 20000)
      },

      /**
       * 向地图上添加数值产品
       * @param url
       * @param extent
       */
      addPictureToMap(url,extent){
        var imgExtent = transformExtent(extent,'EPSG:4326', 'EPSG:3857');
        var projection = new Projection({
          code: 'EPSG:3857',
          units: 'degrees',
          extent: imgExtent
        });

        var layer = new ImageLayer({
          name:url,
          source: new Static({
            url: url,
            crossOrigin:'',
            projection:projection,
            imageExtent: imgExtent
          })
        })
        this.map.addLayer(layer)
        this.productionLyrs.push(layer);
      },
      /**
       * 清除底图上当前的数值产品
       */
      cleanMapPro(){
        //遍历this.productionLyrs，并将所有图层从地图上移除
        for(var i=0;i<this.productionLyrs.length;i++){
          this.map.removeLayer(this.productionLyrs[i]);
        }
        this.productionLyrs.splice(0,this.productionLyrs.length);
      }
    },
    mounted: function () {
      this.mapInit();
      this.addCtd();
      this.addTide();
      this.inv();
      //var t = setTimeout("this.addCtd();this.addTide()", 1000);
      //setTimeout(()=>{this.addCtd();this.addTide()}, 1000);
    }
  }
</script>

<style scoped>
  #tdtmap {
    height: 100%
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
    min-width: 200px;
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
</style>
