<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!------------------------- 卡片区 -------------------------->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <el-table :data="orderList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="180px">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="user_id">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.user_id == 1">未付款</el-tag>
            <el-tag type="success" v-else-if="scope.row.user_id == 0"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="update_time">
          <template slot-scope="scope">
            <div>
              {{ scope.row.create_time | dateFromat }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="right_button" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-edit" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getOrders } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      queryInfo: { query: "", pagenum: 1, pagesize: 10 },
      orderList: [],
    };
  },
  created() {
    this.getorderlist();
  },
  methods: {
    async getorderlist() {
      const { data: res } = await getOrders(this.queryInfo);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.orderList = res.data.goods;
      console.log(res.data.goods);
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
