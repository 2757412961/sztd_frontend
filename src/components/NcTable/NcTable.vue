<template>
  <Modal
    width="630px"
    v-model="ncTable_modal"
    title="NC折线图">
    <div id="myChart" :style="{width: '600px', height: '400px'}"></div>
  </Modal>
</template>

<script>
    export default {
      name: "nc-table",
      data(){
        return {
          ncTable_modal:false
        }
      },
      mounted(){
        // this.drawLine();
      },
      methods: {
        openNcTable(data,dataType){
          console.log(data)
          this.drawLine(data,dataType)
        },
        drawLine(data,dataType){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          // 绘制图表
          var length=data.length;
          var xData=[...Array(length).keys()]
          myChart.setOption({
            xAxis: {
              type: 'category',
              data:xData,
              name:'小时(h)',
              nameTextStyle:{
                color:"black",
                fontSize:14,
                padding:0
              }
            },
            yAxis: {
              type: 'value',
              scale:true,
              name:dataType,
              nameTextStyle:{
                color:"black",
                fontSize:14,
                padding:5
              }
            },
            series: [{
              data: data,
              type: 'line'
            }]
          });
          this.ncTable_modal=true;
        }
      }
    }
</script>

<style scoped>

</style>
