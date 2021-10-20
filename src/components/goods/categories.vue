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
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClassify">添加分类</el-button>
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
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delBtn(scope.row)"
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
    <!-- 添加商品分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isclassify"
      width="50%"
      @close="closeClassify"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="Classify"
        ref="RefFormClassify"
        label-width="80px"
        :rules="classifyRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="Classify.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="oneCheckedClassify"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
            }"
            clearable
            @change="parentCateChanged"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isclassify = false">取 消</el-button>
        <el-button type="primary" @click="confirmClassify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑提交商品分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="isEditclassify"
      width="50%"
      @close="closeEditclassify"
    >
      <!-- 内容主体区 -->
      <el-form :model="editName" ref="RefFormClassify" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="editName.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditclassify = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditClassify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  addCateClassify,
  editCateClassify,
  delCateClassify,
} from "../../request/http";
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
      /* --------------添加分类--------------------------- */
      isclassify: false,
      Classify: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      classifyRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //选中的父级分类的数组
      oneCheckedClassify: [],
      /* -------编辑分类-------- */
      isEditclassify: false,
      editName: {
        cat_name: "",
        cat_id: 0,
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
      this.isEditclassify = true;
      this.editName = row;
    },
    /* -------------------添加商品分类--------------- */
    async addClassify() {
      const { data: res } = await getCategories({ type: 2 });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.parentCateList = res.data;
      this.isclassify = true;
    },
    async confirmClassify() {
      const { data: res } = await addCateClassify(this.Classify);
      if (res.meta.status != 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.isclassify = false;
      this.getGoodCategory();
    },
    // 选择项发生变化时触发这个事件
    parentCateChanged() {
      console.log(this.oneCheckedClassify);
      if (this.oneCheckedClassify.length > 0) {
        // 父级分类的id
        this.Classify.cat_pid =
          this.oneCheckedClassify[this.oneCheckedClassify.length - 1];
        this.Classify.cat_level = this.oneCheckedClassify.length;
        return;
      } else {
        this.Classify.cat_pid = 0;
        this.Classify.cat_level = 0;
      }
    },
    closeClassify() {
      console.log("关闭");
      this.$refs.RefFormClassify.resetFields();
      this.oneCheckedClassify = [];
      this.Classify.cat_pid = 0;
      this.Classify.cat_level = 0;
    },
    /* ---------------编辑分类 */
    //关闭分类对话框时
    closeEditclassify() {
      // 初始化对话框
      this.$refs.RefFormClassify.resetFields();
    },
    confirmEditClassify() {
      // 发送请求数据
      this.$refs.RefFormClassify.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await editCateClassify(
          this.editName.cat_id,
          this.editName
        );
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.isEditclassify = false;
        this.getGoodCategory();
      });
    },
    /* ----------------删除分类 */
    delBtn(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await delCateClassify(row.cat_id);
          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getGoodCategory();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
