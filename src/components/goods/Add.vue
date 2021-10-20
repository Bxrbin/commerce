<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="添加商品信息"
            type="info"
            :closable="false"
            center
            show-icon
          >
          </el-alert>
        </el-col>
      </el-row>
      <!---------------- 步骤条 ---------->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 左侧tab标签 -->
      <el-form
        :model="addFrom"
        :rules="addFromrules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cataList"
                :props="cataProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in dynamicList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item1, index) of item.attr_vals"
                  :key="index"
                  :label="item1"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item2 of staticList"
              :label="item2.attr_name"
              :key="item2.attr_id"
            >
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              list-type="picture"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFrom.goods_introduce" />
            <el-button type="primary" class="addbut" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--------图片预览------------------->
    <el-dialog
      title="图片预览"
      :visible.sync="isPicture"
      width="50%"
      :before-close="handleClose"
    >
      <img :src="srcPicture" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import {
  getCategories,
  getAttributes,
  addpagination,
} from "../../request/http";
export default {
  props: {},
  data() {
    return {
      activeIndex: "0",
      //添加商品的表单数对象
      addFrom: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //添加商品内容的数据
        goods_introduce: "",
        //添加上传图片的路径对象
        pics: [],
        //添加参数的数组（动态参数和静态属性
        attrs: [],
      },

      addFromrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      /*-------------- 获取商品分类的数据存储地址 */
      cataList: [],
      cataProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      /*------------------ 获取商品动态参数的地址 */
      dynamicList: [],
      checked1: true,
      /*------------------- 获取商品静态参数的地址 */
      staticList: [],
      /* 获取文件上传时上传文件的列表 */
      uploadUrl: "http://192.168.1.5:8888/api/private/v1/upload",
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      isPicture: false,
      srcPicture: "",
      /* 商品内容的数据地址富文本 */
      content: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    /* 获取分类列表 */
    async getCateList() {
      const { data: res } = await getCategories();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.cataList = res.data;
    },
    /* 级联选择器选中项变化，会触发这个函数 */
    handleChange() {
      console.log(this.addFrom.goods_cat);
    },
    /* 标签页的切换时的表单验证监听事件 */
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addFrom.goods_cat.length == 0) {
        this.$message.error("请先选择分类");
        return false;
      }
    },
    /* tab标签页切换 */
    async tabClicked() {
      if (this.activeIndex === "1") {
        const { data: res } = await getAttributes(this.cateId, { sel: "many" });
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.dynamicList = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await getAttributes(this.cateId, { sel: "only" });
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.staticList = res.data;
      }
    },
    /* 处理图片预览监听函数 */
    handlePreview(file) {
      console.log(file);
      this.isPicture = true;
      this.srcPicture =
        "http://192.168.1.5:8888/" + file.response.data.tmp_path;
    },
    /* 图片预览关闭时的函数 */
    handleClose() {
      this.srcPicture = "";
      this.isPicture = false;
    },
    /* 监听图片被移除的函数 */
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addFrom.pics.findIndex((x) => x.pic === filePath);
      this.addFrom.pics.splice(i, 1);
    },
    /* 监听图片上传成功的处理函数 */
    handleSuccess(response) {
      this.addFrom.pics.push({
        pic: response.data.tmp_path,
      });
    },
    /* ------------------添加商品------------- */
    add() {
      this.$refs.addFromRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请输入完整的表单项");
        const from = _.cloneDeep(this.addFrom);
        from.goods_cat = from.goods_cat.join(",");
        //处理动态参数
        this.dynamicList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(","),
          };
          this.addFrom.attrs.push(newInfo);
        });
        //处理静态属性
        this.staticList.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addFrom.attrs.push(newInfo);
        });
        from.attrs = this.addFrom.attrs;
        console.log(from);
        const { data: res } = await addpagination(from);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.$router.push('/goods')
      });
    },
  },
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length != 0) {
        return this.addFrom.goods_cat[this.addFrom.goods_cat.length - 1];
      }
      return null;
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.addbut {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
