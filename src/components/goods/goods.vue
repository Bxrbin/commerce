<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-------------- 商品分类列表 --------------------->
      <el-table :data="goodCategory" border stripe>
        <!-- <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类名称" prop="roleName"> </el-table-column>
        <el-table-column label="是否有效" prop="roleDesc"> </el-table-column>
        <el-table-column label="排序" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      goodCategory: [],
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
</style>
