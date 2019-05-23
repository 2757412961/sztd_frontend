<template>
  <div style="position: absolute;bottom:0;top:60px;right:0px;left:60px">
    <div id="tdtmap" style="">
      <div id="popup" class="ol-popup">
        <div id="popup-title" class="popup-title">最新数据</div>
        <div id="popup-content"></div>
      </div>
      <PlatformLast24Modal ref="platformLast24Modal"></PlatformLast24Modal>
      <SiteLast24Modal ref="siteLast24Modal"></SiteLast24Modal>
    </div>
    <div id="mouse-position" style="position: absolute;right:50px;top:10px;"></div>
    <div id="legend" style="position: absolute;right:0px;bottom:0px;">
      <li v-for="(item,index) in curLegend" :key="index">
        <img id="img_logo" :src="item" slot="icon" style="width:500px">
      </li>
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
  import {transformExtent} from 'ol/proj';
  import {toLonLat} from 'ol/proj.js';
  import {toStringHDMS} from 'ol/coordinate';
  import Projection from "ol/proj/Projection";
  import Select from 'ol/interaction/Select';
  import {singleClick} from 'ol/events/condition';
  import PlatformLast24Modal from "../components/Map/PlatformLast24Modal";
  import Static from 'ol/source/ImageStatic.js';
  import ImageLayer from 'ol/layer/Image.js';
  import MousePosition from 'ol/control/MousePosition.js';
  import {createStringXY} from 'ol/coordinate.js';
  import {defaults as defaultControls} from 'ol/control.js';
  import ZoomSlider from 'ol/control/ZoomSlider';
  import SiteLast24Modal from "../components/Map/SiteLast24Modal";

  export default {
    name: "map-layout",
    components: {SiteLast24Modal, PlatformLast24Modal},
    data() {
      return {
        map:null,//地图
        platform_layer:null,//平台图层
        buoy_layer:null,//浮标图层
        site_layer:null,//气象站图层
        productionLyrs:[],//数值预报产品图层

        //popup三兄弟
        container: "",
        content: "",
        overlay: "",

        lastPointerFeature: null,//记录上一次光标指向的feature
        proHit: false,//记录弹框状态
        //openlayer图片的src使用方法！！
        platformIconUrl: require('../assets/platform.png'),
        buoyIconUrl:require('../assets/buoy.png'),
        siteIconUrl:require('../assets/site.png'),

        //图例
        curLegend:[],//当前图例
        legends:{
          'tenMWind':require("../assets/legend/10mWind.jpg"),
          'twoHpaWind': require("../assets/legend/200hpaWind.jpg"),
          'wave': require("../assets/legend/wave.jpg"),
          'rain': require("../assets/legend/rain.jpg"),
          'current':require("../assets/legend/current.jpg"),
          'salinity':require("../assets/legend/salinity.jpg")
        },
        //记录当前地图缩放层级
        oldZoom:0
      }
    },
    methods: {
      /**
       * 向地图上添加浮标
       */
      addBuoy(){
        this.buoy_layer.getSource().clear();
        /** 浮标初始化*/
        var buoy1 = new Feature({
          geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 9.42 * 1 / 3600, 22 + 29 * 1 / 60 + 6.3 * 1 / 3600])),
          name: "buoy1",
        });
        var buoy2 = new Feature({
          geometry: new Point(fromLonLat([113 + 46 * 1 / 60 + 32.93 * 1 / 3600, 22 + 33 * 1 / 60 + 43.51 * 1 / 3600])),
          name: "buoy2",
        });
        var buoy3 = new Feature({
          geometry: new Point(fromLonLat([113 + 47 * 1 / 60 + 44.82 * 1 / 3600, 22 + 20 * 1 / 60 + 14.22 * 1 / 3600])),
          name: "buoy3",
        });
        var buoy4 = new Feature({
          geometry: new Point(fromLonLat([113 + 47 * 1 / 60 + 21.12 * 1 / 3600, 22 + 10 * 1 / 60 + 36.48 * 1 / 3600])),
          name: "buoy4",
        });
        var style1 = new Style({
          image: new Icon({
            src: this.buoyIconUrl,
            scale: 0.2
          })
        });
        var style2 = new Style({
          image: new Icon({
            src: this.buoyIconUrl,
            scale: 0.2
          })
        });
        var style3 = new Style({
          image: new Icon({
            src: this.buoyIconUrl,
            scale: 0.2
          })
        });
        var style4 = new Style({
          image: new Icon({
            src: this.buoyIconUrl,
            scale: 0.2
          })
        });
        buoy1.setStyle(style1);
        buoy2.setStyle(style2);
        buoy3.setStyle(style3);
        buoy4.setStyle(style4);
        this.buoy_layer.getSource().addFeatures([buoy1, buoy2, buoy3, buoy4]);
      },

      /**
       * 向地图上添加气象平台
       */
      addPlatform(){
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
        platform.setStyle(style);
        this.platform_layer.getSource().addFeature(platform);
      },

      /**
       * 向地图上添加气象站
       */
      addSite(){
        this.site_layer.getSource().clear();
        var site = new Feature({
          geometry: new Point(fromLonLat([113.8, 22.1735])),
          name: "Site",
        });
        var style = new Style({
          image: new Icon({
            src: this.siteIconUrl,
            scale: 0.2
          })
        });
        site.setStyle(style);
        this.site_layer.getSource().addFeature(site);
      },

      /**
       * 地图初始化
       */
      mapInit() {

        /** 地图图层初始化*/
        //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
        //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
        var map_source = new XYZ({
          url: "http://"+this.$store.state.serverIP+"/sztd_map/tdt_lxt/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
        });
        var map_layer = new TileLayer({
          source: map_source
        });
        var map_label_source = new XYZ({
          url: "http://"+this.$store.state.serverIP+"/sztd_map/tdt_lxt_label/{z}/{y}/{x}.png"    //FeatureWithLabelGZA
        });
        var map_label_layer = new TileLayer({
          source: map_label_source
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

        /** 视图初始化*/
        var view = new View({
          center: fromLonLat([113.8, 22.45]),
          zoom: 10,
          minZoom: 5,
          maxZoom: 13,
        });
        this.oldZoom=10;

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
          layers: [map_layer, map_label_layer,this.platform_layer,this.buoy_layer,this.site_layer],
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
        });
        this.map.addOverlay(this.overlay);

        //鼠标移动事件绑定
        this.map.on('pointermove', this.mouseMove);
        //鼠标点击地图响应事件绑定
        this.map.on('singleclick',this.singleClickOnMap);
        //地图范围变化事件绑定
        this.map.on('moveend',this.zoomEvent)

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
        if(features[0].get('name').search(/Platform/)!=-1){
          //显示平台最近24小时数的时间序列数据
          this.$refs.platformLast24Modal.openPlatformLast24Modal()
        }
        else if(features[0].get('name').search(/Site/)!=-1){
          //显示平台最近24小时数的时间序列数据
          // this.$refs.siteLast24Modal.openSiteLast24Modal()
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
        if(hit)
        {
          //获取当前的feature
          var features=this.map.getFeaturesAtPixel(pixel);
          if(features[0]!=this.lastpointerFeature){

            //移动前后是不同feature，将原来的feature图标大小回归正常
            if(this.lastpointerFeature!=null){
              var style= this.lastpointerFeature.getStyle();
              style.getImage().setScale(0.2);
              this.lastpointerFeature.setStyle(style);
              this.overlay.setPosition(undefined);
              this.proHit = false;//更改弹窗状态
            }

            this.lastpointerFeature = features[0];//记录本次feature
            //图标放大
            var style= this.lastpointerFeature.getStyle();
            style.getImage().setScale(0.25);
            this.lastpointerFeature.setStyle(style);

            if(features[0].get('name').search(/Platform/)!=-1){
              this.platformPopShow(features[0]);
            }
            else if(features[0].get('name').search(/Site/)!=-1){
              this.sitePopShow(features[0]);
            }
          }

        }
        else
        {
          if(this.lastpointerFeature!=null){
            var style= this.lastpointerFeature.getStyle();
            style.getImage().setScale(0.2);
            this.lastpointerFeature.setStyle(style);
          }
          this.overlay.setPosition(undefined);
          this.proHit = false;//更改弹窗状态
          this.lastpointerFeature = null;//记录本次feature
        }

      },
      /**
       * 显示site气象站最新数据弹出框
       * @param feature
       */
      sitePopShow(feature){
        var api = `/api/SZTDService/querySiteNew.action`;
        this.$axios.get(api).then((response) => {
          //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
          var siteNew = response.data;
          if(siteNew!=null){
            //组织弹出框内容
            var html = "";
            //气象站
            html +=
              "<table>" +
              "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(siteNew.dt)) + "</td></tr>" +
              "<tr><td>记录数：</td><td>" + siteNew.record + "</td></tr>" +
              "<tr><td>气温：</td><td>" + siteNew.taAvg + " ℃</td></tr>" +
              "<tr><td>相对湿度：</td><td>" + siteNew.rhAvg + "</td></tr>" +
              "<tr><td>风速：</td><td>" + siteNew.wsWvc1 + " m/s</td></tr>" +
              "<tr><td>风向：</td><td>" + siteNew.wsWvc2 + " °</td></tr>" +
              "<tr><td>气压：</td><td>" + siteNew.paAvg + " hpa</td></tr>" +
              "<tr><td>面板温度：</td><td>" + siteNew.ptempAvg + " ℃</td></tr>" +
              "<tr><td>电池电压：</td><td>" + siteNew.battVoltAvg + " V</td></tr>" +
              "</table>";
            this.content.innerHTML = html;
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
      },
      /**
       * 显示platform平台弹出框
       * @param feature
       */
      platformPopShow(feature){
        var api = `/api/SZTDService/queryPlatformNew.action`;
        this.$axios.get(api).then((response) => {
          //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
          var platformNew = response.data;
          if(platformNew!=null){
            //组织弹出框内容
            var html = "";
            //表层CTD
            html +=
              "<table>" +
              "<tr><th>" + "表层CTD" + "</th></tr>" +
              "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.topCtdNew.dt)) + "</td></tr>" +
              "<tr><td>深度：</td><td>" + platformNew.topCtdNew.wp + "</td></tr>" +
              "<tr><td>温度：</td><td>" + platformNew.topCtdNew.wt + "</td></tr>" +
              "<tr><td>盐度：</td><td>" + platformNew.topCtdNew.sl + "</td></tr>" +
              "<tr><td>密度：</td><td>" + platformNew.topCtdNew.density + "</td></tr>" +
              "</table>";
            //底层CTD
            html +=
              "<table>" +
              "<tr><th>" + "底层CTD" + "</th></tr>" +
              "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.bottomCtdNew.dt)) + "</td></tr>" +
              "<tr><td>深度：</td><td>" + platformNew.bottomCtdNew.wp + "</td></tr>" +
              "<tr><td>温度：</td><td>" + platformNew.bottomCtdNew.wt + "</td></tr>" +
              "<tr><td>盐度：</td><td>" + platformNew.bottomCtdNew.sl + "</td></tr>" +
              "<tr><td>密度：</td><td>" + platformNew.bottomCtdNew.density + "</td></tr>" +
              "</table>";
            //潮位计
            html +=
              "<table>" +
              "<tr><th>" +"潮位计" + "</th></tr>" +
              "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.tideNew.dt)) + "</td></tr>" +
              "<tr><td>水压：</td><td>" + platformNew.tideNew.pr + "</td></tr>" +
              "<tr><td>潮位：</td><td>" + platformNew.tideNew.wl + "</td></tr>" +
              "</table>";
            this.content.innerHTML = html;
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
      },


      /*****************************************************数值产品地图操作*****************************************************/
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
            var arr=this.productionLyrs[i].get('name').split("/");
            //是否有气象数据十米风场图层
            if(this.productionLyrs[i].get('name').search(/Atm_10mWindU10V10/)!=-1){
              this.$emit('drawWindTimeSeries',"10mWindTimeSeries",arr[4],lonlat);
              break;
            }
            //是否有气象数据500hpa风场图层
            if(this.productionLyrs[i].get('name').search(/Atm_500hPaWindUUVV/)!=-1){
              this.$emit('drawWindTimeSeries',"500hpaWindTimeSeries",arr[4],lonlat);
              break;
            }
            //是否有气象数据200hPa风场图层
            if(this.productionLyrs[i].get('name').search(/Atm_200hPaWindUUVV/)!=-1){
              this.$emit('drawWindTimeSeries',"200hpaWindTimeSeries",arr[4],lonlat);
              break;
            }
            //是否有精细化气象数据十米风场图层
            if(this.productionLyrs[i].get('name').search(/AtmRefine_10mWindU10V10/)!=-1){
              this.$emit('drawWindTimeSeries',"refine10mWindTimeSeries",arr[4],lonlat);
              break;
            }
            //是否有海流数据图层
            if(this.productionLyrs[i].get('name').search(/Current_UV/)!=-1){
              var siglay = Number(arr[5].split("_")[2].substr(0,arr[5].split("_")[2].length-1));
              this.$emit('drawCurrentTimeSeries',siglay,arr[4],lonlat);
              break;
            }

          }

        }
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
        //缩放到当前地图范围
        // this.map.getView().fit(imgExtent,this.map.getSize());

        //TODO 图例部分
        if(url.search(/Atm_10mWindU10V10/)!=-1){
          this.curLegend.push(this.legends.tenMWind);
        }else if(url.search(/Atm_200hPaWindUUVV/)!=-1){
          this.curLegend.push(this.legends.twoHpaWind);
        }else if(url.search(/Atm_RaincRainnc/)!=-1){
          this.curLegend.push(this.legends.rain)
        }else if(url.search(/Wave_HS/)!=-1){
          this.curLegend.push(this.legends.wave);
        }else if(url.search(/AtmRefine_10mWindU10V10/)!=-1){
          this.curLegend.push(this.legends.tenMWind);
        }else if(url.search(/AtmRefine_Rainnc/)!=-1){
          this.curLegend.push(this.legends.rain);
        }else if(url.search(/Current_UV_/)!=-1){
          this.curLegend.push(this.legends.current);
        }else if(url.search(/Current_Salinity/)!=-1){
          this.curLegend.push(this.legends.salinity);
        }
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
        this.curLegend.splice(0,this.curLegend.length);
      },

      /**
       * 判断地图是否缩放，
       * 若缩放，则判断是否有数据产品图层
       * 如果有，则更新数据产品层级
       * @param e
       */
      zoomEvent(e){
        //判断地图是否缩放,无缩放则返回
        var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
        if(this.oldZoom==zoom)
          return;
        //若缩放，记录当前缩放层级
        this.oldZoom=zoom;

        //判断是否有数据产品图层，若无则返回
        if(this.productionLyrs.length==0)
          return;

        //若有数据产品图层，则更新数据产品层级
        this.refreshProduction(zoom)
      },

      /**
       * 更新当前数据产品层级
       * @param zoom
       */
      refreshProduction(zoom){
        console.log(zoom);
        for(var i=0;i<this.productionLyrs.length;i++){
          if(this.productionLyrs[i].get('name').includes("_L")){
            //获取当前图层的范围、url、投影
            var imgExtent = this.productionLyrs[i].getSource().getImageExtent();
            var url=this.productionLyrs[i].getSource().getUrl();
            var projection = this.productionLyrs[i].getSource().getProjection();

            //根据缩放层级修改修改url
            var newUrl="";
            if(zoom<=6){
              if(url.includes("_L6")){
                newUrl = url.replace("_L6","_L5");
              }
            }else{
              if(url.includes("_L5")) {
                newUrl = url.replace("_L5", "_L6");
              }
            }
            if(newUrl!=""){
              //重新加载数据产品
              var source=new Static({
                url: newUrl,
                crossOrigin:'',
                projection:projection,
                imageExtent: imgExtent
              });
              this.productionLyrs[i].setSource(source);
            }

          }
        }
      }
    },

    mounted: function () {
      this.mapInit();
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
    min-width: 210px;
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
