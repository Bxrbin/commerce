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
      <tree-table
        :data="goodCategory"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <template slot-scope="scope" slot="isok">
          <i
            class="el-icon-success"
            type="success"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" type="error" v-else style="color: red"></i>
        </template>
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot-scope="scope" slot="opt">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="change(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @current-change="hardPageNum"
        @size-change="hardPageSize"
        :current-page="page.pagenum"
        :page-sizes="[3, 5, 6, 7]"
        :page-size="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getCategories } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      goodCategory: [],
      /* 为table指定列的定义 */
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" },
      ],
      total: 0,
      page: {
        type: "",
        pagenum: 1,
        pagesize: 5,
      },
    };
  },
  created() {
    this.getGoodCategory();
  },
  methods: {
    /* ------------获取商品分类数据-------------------------- */
    async getGoodCategory() {
      const { data: res } = await getCategories(this.page);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.goodCategory = res.data.result;
      this.total = res.data.total;
    },
    /* ------监听分页器中页码切换------- */
    hardPageNum(newNum) {
      console.log(newNum);
      this.page.pagenum = newNum;
      this.getGoodCategory();
    },
    /* ------监听每页的数量变化------- */
    hardPageSize(newSize) {
      console.log(newSize);
      this.page.pagesize = newSize;
      this.getGoodCategory();
    },
    change(row) {
      console.log(row);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.treeTable {
  margin-top: 15px;
}
</style>
