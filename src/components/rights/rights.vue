<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <template>
        <el-table :data="permissionList" style="width: 100%" border stripe>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="authName" label="权限名称">
          </el-table-column>
          <el-table-column prop="path" label="路径">
          </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template  slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.level==='0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level=='2'">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      permissionList: [],
    };
  },
  methods: {
    async getrights() {
      const { data: res } = await getRightsList('list');
      if(res.meta.status!=200)return this.$message.error(res.meta.msg);
  
      this.permissionList=res.data
    },
  },
  created() {
    this.getrights();
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
