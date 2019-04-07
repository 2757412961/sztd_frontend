import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这里定义初始值
let state = {
  title:"深中通道海洋环境观测与预报综合显示平台",
  name:"sztd",
  category:"1",//管理员1普通用户0
  serverIP:"202.121.180.59",//产品及数据发布IP
  atmExtent:[98.8,7.0,137.5,32.9],
  waveExtent:[113.300,21.050,114.100, 22.800]
};

const mutations = {
  setName(context,msg){
    state.name = msg;
  },
  setCategory(context,msg){
    state.category = msg;
  }
};

// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {

};

// 返回改变后的数值
const getters = {

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
