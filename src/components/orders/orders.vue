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
            <el-tag type="success" v-else>已付款</el-tag>
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
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeLocation = true"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="getLogistics(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handNumChange"
        @size-change="handSizeChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- ------------------修改地址的对话框------------------------->
    <el-dialog
      title="修改地址"
      :visible.sync="changeLocation"
      width="50%"
      :before-close="CloseChangeLocation"
    >
      <!-- 内容主体 -->
      <el-form
        ref="changeRef"
        :model="LocationObj"
        label-width="100px"
        :rules="locationRules"
      >
        <el-form-item label="省市区/县" prop="pro">
          <el-cascader
            :options="cityOptions"
            :value="LocationObj.pro"
            change-on-select
          >
          </el-cascader>
          <!-- <el-input v-model="LocationObj.pro"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="LocationObj.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeLocation = false">取 消</el-button>
        <el-button type="primary" @click="confirmLocation">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ------------------查看物流进度的对话框------------------------->
    <el-dialog
      title="物流进度"
      :visible.sync="isLogistics"
      width="50%"
      :before-close="CloseFromLogistics"
    >
      <!-- 内容主体 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in Logistics"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityOptions from "@/assets/js/city_data2017_element.js";
import { getOrders, getLogistics } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      total: 0,
      queryInfo: { query: "", pagenum: 1, pagesize: 10 },
      orderList: [],
      /* 修改地址对话框 */
      changeLocation: false,
      LocationObj: {
        pro: "",
        address: "",
      },
      locationRules: {
        pro: [{ required: true, message: "请输入省市区/县", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      cityOptions: cityOptions,
      /* 查看物流进度 */
      isLogistics: false,
      Logistics:[]
    };
  },
  created() {
    this.getorderlist();
  },
  methods: {
    /* -----------------获取订单列表----------------------- */
    async getorderlist() {
      const { data: res } = await getOrders(this.queryInfo);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log(res.data.goods);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    /* --------------页码改变----------------------------- */
    handNumChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getorderlist();
    },
    /* --------------每页显示条数改变----------------------------- */
    handSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getorderlist();
    },
    /* -----------修改地址------------------------- */
    confirmLocation() {
      this.$refs.changeRef.validate(async (valid) => {
        if (!valid) return;
        console.log("修改地址没写请求");
        this.changeLocation = false;
      });
    },
    CloseChangeLocation() {
      this.changeLocation = false;
      this.$refs.changeRef.resetFields();
    },
    /* ---------------查看物流进度--------------------------- */
    async getLogistics(scope) {
      this.isLogistics = true;
      console.log(scope);
      const { data: res } = await getLogistics();
      console.log(res);
      this.Logistics=res.data.data
    },
    CloseFromLogistics() {
      this.isLogistics = false;
      this.$refs.logisticsRef.resetFields();
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.el-cascader {
  width: 100%;
}
</style>
