import ncTable from './NcTable.vue'
// 这里是重点
const NcTable = {
  install: function(Vue){
    Vue.component('ncTable',ncTable)
  }
}

// 导出组件
export default NcTable
