<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- ----------卡片区--------- -->
    <el-card>
      <!-- 警告区域 -->
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>
      <!-- 选择商品分类 -->
      <el-row class="select">
        <el-col>
          <span>选择商品分类：</span>
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
          ></el-cascader>
        </el-col>
      </el-row>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button
              type="primary"
              :disabled="isBtnDisable"
              @click="addDynamicParameter"
              >添加参数</el-button
            >
            <!-- 动态参数的表格 -->
            <el-table :data="manyTableDate" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-row class="leftPadding">
                    <el-col>
                      <el-tag
                        :key="index"
                        v-for="(tag, index) in scope.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(index, scope.row)"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button
                        v-else
                        size="small"
                        @click="showInput(scope.row)"
                        >+ New Tag</el-button
                      >
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="eel-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="eel-icon-delete"
                    size="mini"
                    @click="delEditDialog(scope.row)"
                    >删除</el-button
                  ></template
                ></el-table-column
              >
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
              type="primary"
              :disabled="isBtnDisable"
              @click="addDynamicParameter"
              >添加属性</el-button
            >
            <!-- 静态参数的表格 -->
            <el-table :data="onlyTableDate" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-row class="leftPadding">
                    <el-col>
                      <el-tag
                        :key="index"
                        v-for="(tag,index) in scope.row.attr_vals"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(index, scope.row)"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button
                        v-else
                        size="small"
                        @click="showInput(scope.row)"
                        >+ New Tag</el-button
                      >
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="eel-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="eel-icon-delete"
                    size="mini"
                    @click="delEditDialog(scope.row)"
                    >删除</el-button
                  ></template
                ></el-table-column
              >
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!-- ---------添加参数-------------- -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="isaddDynamic"
      width="50%"
      @close="closeaddDynamic"
    >
      <!-- 主体内容 -->
      <el-form
        :model="addDynamicParameters"
        :rules="addDynamicRules"
        ref="addDynamicForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addDynamicParameters.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isaddDynamic = false">取 消</el-button>
        <el-button type="primary" @click="comfirmParameter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- ---------修改参数-------------- -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="isEditDynamic"
      width="50%"
    >
      <!-- 主体内容 -->
      <el-form
        :model="EditDynamic"
        :rules="EditDynamicRules"
        ref="EditDynamicForm"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditDynamic.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDynamic = false">取 消</el-button>
        <el-button type="primary" @click="comfirmDynamic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  getAttributes,
  addDynamic,
  queryDynamic,
  editDynamic,
  delDynamic,
  editPagination,
} from "../../request/http";
export default {
  props: {},
  data() {
    return {
      /*-------------- 选择商品分类的数据-------------- */
      // 选中的商品分类id
      oneCheckedClassify: [],
      // 全部的商品分类
      parentCateList: [],
      // 参数的name
      activeName: "many",
      /* ----------------动态参数-------------------- */
      manyTableDate: [],
      isaddDynamic: false,
      addDynamicParameters: { attr_name: "" },
      addDynamicRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      /* ----------------静态属性-------------------- */
      onlyTableDate: [],
      /* ---------修改参数------------- */
      isEditDynamic: false,
      EditDynamic: {},
      EditDynamicRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }],
      },
      /* 展开行input框的数据绑定 */
      inputValue: "",
      inputVisible: false,
    };
  },
  methods: {
    /* --------获取所有的商品分类列表------------ */
    async getAllClassify() {
      const { data: res } = await getCategories();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.parentCateList = res.data;
    },
    /* --------------获取参数列表------------------ */
    async getParameterList() {
      if (this.oneCheckedClassify.length != 3) {
        this.oneCheckedClassify = [];
        this.manyTableDate=[];
        this.onlyTableDate=[]
        return;
      }
      const { data: res } = await getAttributes(this.cateId, {
        sel: this.activeName,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTableDate = res.data;
      } else {
        this.onlyTableDate = res.data;
      }
    },
    /* -----------选中项被改变时执行的函数------------- */
    parentCateChanged() {
      this.getParameterList();
    },
    /* tab页签点击时执行的事件 */
    handleTabClick() {
      if (this.oneCheckedClassify.length != 3) return;
      this.getParameterList();
    },
    /* 点击添加参数按钮执行的事件 */
    async addDynamicParameter() {
      this.isaddDynamic = true;
    },
    /* 添加参数表单提交 */
    async comfirmParameter() {
      const { data: res } = await addDynamic(this.cateId, {
        attr_name: this.addDynamicParameters.attr_name,
        attr_sel: this.activeName,
      });
      if (res.meta.status != 201) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getParameterList();
      this.isaddDynamic = false;
    },
    /* 监听添加对话框的关闭事件 */
    closeaddDynamic() {
      // console.log(this.$refs.addDynamicForm);
      this.$refs.addDynamicForm.resetFields();
    },
    /* --------修改参数的对话框----------------- */
    async showEditDialog(row) {
      const { data: res } = await queryDynamic(this.cateId, row.attr_id, {
        attr_sel: this.activeName,
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.EditDynamic = res.data;
      this.isEditDynamic = true;
    },
    /* 编辑参数的表单提交事件 */
    async comfirmDynamic() {
      const { data: res } = await editDynamic(
        this.cateId,
        this.EditDynamic.attr_id,
        { attr_name: this.EditDynamic.attr_name, attr_sel: this.activeName }
      );
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.getParameterList();
      this.$message.success(res.meta.msg);
      this.isEditDynamic = false;
    },
    /* -----------删除参数------------- */
    delEditDialog(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await delDynamic(this.cateId, row.attr_id);
          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.getParameterList();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /* 展开行的监听事件 */
    async asveAttrVals(row) {
      const { data: res } = await editPagination(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(" "),
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res);
    },
    //input框失去焦点时
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.asveAttrVals(row);
    },
    // input框显示时
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    /* 删除此属性时的数据变化 */
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.asveAttrVals(row);
    },
  },
  created() {
    this.getAllClassify();
  },
  computed: {
    // 如果按钮需要被禁用则返回true
    isBtnDisable() {
      if (this.oneCheckedClassify.length != 3) {
        return true;
      } else {
        return false;
      }
    },
    //拿选中项的id
    cateId() {
      if (this.oneCheckedClassify.length === 3) {
        return this.oneCheckedClassify[2];
      }
      return null;
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.select {
  margin: 15px 0;
}
.leftPadding {
  padding: 12px 50px !important;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
