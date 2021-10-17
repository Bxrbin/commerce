<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!----------------------------数据渲染-------------------------------------->
    <el-card>
      <div id="main" style="width: 100%; height: 500px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
import { getEcharts } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  async mounted() {
    let myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await getEcharts();
    if (res.meta.status != 200) return this.$message.error(res.meta.msg);
    /* 准备数据和请求数据合并（merge是loadsh的一个合并两个对象的方法） */
    const result = _.merge(res.data, this.options);
    /* 展示数据 */
    myChart.setOption(result);
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
