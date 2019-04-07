<template>
  <div id="tdtmap">
    <div id="popup" class="ol-popup">
      <div id="popup-title" class="popup-title">最新数据</div>
      <div id="popup-content"></div>
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
  import Point from 'ol/geom/Point';
  import Style from 'ol/style/Style';
  import Icon from 'ol/style/Icon';
  import 'ol/ol.css'
  import {fromLonLat} from 'ol/proj';
  import {toLonLat} from 'ol/proj.js';
  import {toStringHDMS} from 'ol/coordinate';
  import Select from 'ol/interaction/Select';
  import {singleClick} from 'ol/events/condition';

  export default {
    name: "map-layout",
    data() {
      return {
        map: "",
        platformCTD_layer: "",
        platformTIDE_layer: "",
        content: "",
        overlay: "",
        container: "",
        //记录上一次光标指向的feature
        lastPointerFeature: null,
        //记录弹框状态
        proHit: false,
        //openlayer图片的src使用方法！！
        iconUrl: require('../assets/logo.png')
      }
    },
    methods: {
      addCtd: function () {
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
        // ctd1.on('mousein', this.mouseMoveIn(ctd1));
        // ctd2.on('mousein', this.mouseMoveIn(ctd2));

        ctd1.setStyle(style);
        ctd2.setStyle(style);
        this.getFeatureProperty(ctd1);
        this.getFeatureProperty(ctd2);
        this.platformCTD_layer.getSource().addFeatures([ctd2, ctd1]);
      },
      mouseMoveIn:function(feature){
        var highlightStyle = new Style({
          image: new Icon({
            src: this.iconUrl,
            scale: 0.3
          })
        });
        feature.setStyle(highlightStyle);
      },
      addTide: function () {
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
        //tide1.on('mousein', this.mouseMoveIn(tide1));
        tide1.setStyle(style);
        this.getFeatureProperty(tide1);
        //this.platformTIDE_layer.getSource().addFeatures([tide1]);
        this.platformTIDE_layer.getSource().addFeatures([tide1]);
      },
      getFeatureProperty: function (feature) {
        var properties;
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
        } else {
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
      }
      ,
      mapInit: function () {
        /** 地图图层初始化*/
        var map_source = new XYZ({
          url: 'http://202.121.180.59/FeatureWithLabelGZA/{z}/{x}/{y}.jpg'
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
          minZoom: 10,
          maxZoom: 12,
        });

        /** Map初始化*/
        this.map = new Map({
          target: "tdtmap",
          layers: [map_layer, this.platformTIDE_layer, this.platformCTD_layer],
          view: view,
          //overlays: [this.overlay],
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

        //鼠标点击地图事件
        this.map.on('singleclick', this.emptySingleClickEvent);

        //鼠标移动事件
        this.map.on('pointermove', this.mouseMove);

        //鼠标点击feature事件
        /** 单击feature事件*/
          //进行事件绑定
        var selectClick = new Select({
            condition: singleClick,
            multi: true,
          });
        this.map.addInteraction(selectClick);
        selectClick.on("select", this.singleClick);

      },
      popShow: function (coordinate, features) {
        var html = "";
        for (var i = 2; i >=0; i--) {
          if (features[i].get('name') == 'CTD1' || features[i].get('name') == 'CTD2') {
            html +=
              "<table>" +
              "<tr><th>" + features[i].get('name') + "</th></tr>" +
              "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
              "<tr><td>深度：</td><td>" + features[i].get('wp') + "</td></tr>" +
              "<tr><td>温度：</td><td>" + features[i].get('wt') + "</td></tr>" +
              "<tr><td>盐度：</td><td>" + features[i].get('sl') + "</td></tr>" +
              "</table>";
            // html += "<Divider orientation=\"left\">"+features[i].get('name')+"</Divider>" +
            //   "<table>" +
            //   "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
            //   "<tr><td>深度：</td><td>" + features[i].get('wp') + "</td></tr>" +
            //   "<tr><td>温度：</td><td>" + features[i].get('wt') + "</td></tr>" +
            //   "<tr><td>盐度：</td><td>" + features[i].get('sl') + "</td></tr>" +
            //   "</table>";

            // html += '<b>'
            //   + features[i].get('name')
            //   + '</b><br><b>最新时间：'
            //   + features[i].get('dt')
            //   + '</b><br><b>深度：'
            //   + features[i].get('wp')
            //   + '</b><br><b>温度：'
            //   + features[i].get('wt')
            //   + '</b><br><b>盐度：'
            //   + features[i].get('sl')
            //   + '</b></b><br>';
          }
          else {
            html +=
              "<table>" +
              "<tr><th>" + features[i].get('name') + "</th></tr>" +
              "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
              "<tr><td>水压：</td><td>" + features[i].get('pr') + "</td></tr>" +
              "<tr><td>潮位：</td><td>" + features[i].get('wl') + "</td></tr>" +
              "</table>";
            // html += "<Divider orientation=\"left\">"+features[i].get('name')+"</Divider>" +
            //   "<table>" +
            //   "<tr><td>时间：</td><td>" + features[i].get('dt') + "</td></tr>" +
            //   "<tr><td>水压：</td><td>" + features[i].get('pr') + "</td></tr>" +
            //   "<tr><td>潮位：</td><td>" + features[i].get('wl') + "</td></tr>" +
            //   "</table>";
            // html += '<b>'
            //   + features[i].get('name')
            //   + '</b><br><b>最新时间：'
            //   + features[i].get('dt')
            //   + '</b><br><b>水压：'
            //   + features[i].get('pr')
            //   + '</b><br><b>潮位：'
            //   + features[i].get('wl')
            //   + '</b></b><br>';
          }
        }
        ;
        html += "</table>";
        this.content.innerHTML = html;
        this.overlay.setPosition(coordinate);
      },
      //feature点击响应事件(只有在选中Feature时才会触发）
      singleClick: function (e) {
        var features = e.target.getFeatures().getArray();
        if (features.length == 0)
          return;
        // if (features.length > 1)
        //   alert("请选择单一浮标！");
        else {
          this.popShow(features[0].getGeometry().getCoordinates(), features);
        }
      },
      emptySingleClickEvent: function (e) {
        var pixel = e.pixel;//获取地图上坐标
        var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
        if (!hit) {
          this.overlay.setPosition(undefined);

          this.lastpointerFeature = null;//记录本次feature
          this.proHit = false;//更改弹窗状态
          return;
        }
      },
      mouseMoveTemp: function (e) {
        var pixel = e.pixel;//获取地图上坐标
        var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
        this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';//变换鼠标指针的状态
        if (hit) {//如果需要弹窗
          var features = this.map.getFeaturesAtPixel(pixel);//获取弹窗feature
        }
        else {//如果不需要弹窗
          if (this.proHit) {//如果原来有弹窗则销毁
            this.overlay.setPosition(undefined);
          }
          this.lastpointerFeature = null;//记录本次feature
          this.proHit = false;//更改弹窗状态
          return;
        }
        if (!this.proHit) {//之前没有弹窗，现在需要弹窗
          if (features[0] instanceof Feature) {
            this.popShow(features[0].getGeometry().getCoordinates(), features[0]);
            this.lastpointerFeature = features[0];
            this.proHit = true;
          }
        }
      },
      mouseMove: function (e) {
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
        }

      },
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
        }
      ,
        //设置定时器以便定时更新CTD、TIDE的数据
        inv: function () {
          //20000ms
          setInterval(() => {
            this.addCtd();
            this.addTide()
          }, 20000)
        }
      ,
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
