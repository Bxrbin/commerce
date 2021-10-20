<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="paginations.query"
            clearable
            @clear="getpaginations"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getpaginations"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="productList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="650px">
        </el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="110px"
        >
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight">
        </el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.add_time | dateFromat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="right_button" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="alterBtn(scope)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delBtn(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handSizeChange"
        @current-change="handleNumChange"
        :current-page="paginations.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="paginations.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getpagination, delpagination } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      /* ----------------- 商品数据 */
      productList: [],
      /*------------------ 分页区域 */
      // 总页数
      total: 0,
      // 分页数据
      paginations: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
    };
  },
  created() {
    this.getpaginations();
  },
  methods: {
    /* -------------- 获取商品列表数据 */
    async getpaginations() {
      const { data: res } = await getpagination(this.paginations);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.total = res.data.total;
      this.productList = res.data.goods;
    },
    //编辑按钮
    alterBtn() {},
    // 删除按钮
    delBtn(scope) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(scope.row.goods_id);
          const { data: res } = await delpagination(scope.row.goods_id);
          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.getpaginations();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /* ---------------监听页码变化 */
    handleNumChange(newNum) {
      this.paginations.pagenum = newNum;
      this.getpaginations();
    },
    /* ---------------监听单页面的数据数量变化 */
    handSizeChange(newSize) {
      this.paginations.pagesize = newSize;
      this.getpaginations();
    },
    /* ---------------跳转添加商品的页面 */
    goAddpage() {
      this.$router.push('/goods/add')
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
