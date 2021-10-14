<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { users } from "../../request/http";
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  async created() {
    var a = [];
    a[0] = 0;
    a[1] = 1;
    a[4] = 4;
    console.log(a[3]);
    let { data: res } = await users();
    console.log(res);
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
