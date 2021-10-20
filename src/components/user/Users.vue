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
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsers"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="listUsers" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#409EFF"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
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
            <template>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delBtn(scope)"
              ></el-button>
            </template>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="assignRoles(scope)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogclosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addUsers"
        :rules="addUsersRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUsers.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUsers.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUsers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUsers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息提交 -->
    <el-dialog
      title="修改用户"
      :visible.sync="alterdialogVisible"
      width="50%"
      @close="alterDialogclosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="alterusers"
        :rules="alterUsersRules"
        ref="alterFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="alterusers.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="alterusers.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="alterusers.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色提交 -->
    <el-dialog
      title="修改用户"
      :visible.sync="isassignRoles"
      width="50%"
      @close="assignDialogclosed"
    >
      <!-- 内容主体区 -->
      <div>
        <p>当前的用户：{{ assignUser.username }}</p>
        <p>当前的角色：{{ assignUser.role_name }}</p>
        <p>
          分配新角色：
          <template>
            <el-select v-model="oneRole" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </p>
      </div>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isassignRoles = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  users,
  userState,
  addUsers,
  alterUsers,
  getUser,
  deluser,
  getRolesList,
  assignRole,
} from "../../request/http";
export default {
  props: {},
  data() {
    // 验证手机号的验证规则
    var checkmobile = (rule, value, cb) => {
      let reg =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        cb();
      } else {
        cb(new Error("手机号码格式不正确"));
      }
    };
    return {
      queryInfo: { query: "", pagenum: 1, pagesize: 2 },
      total: 0,
      listUsers: [],
      // 添加用户信息
      dialogVisible: false,
      addUsers: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUsersRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      // 修改用户信息
      alterdialogVisible: false,
      alterusers: {},
      alterUsersRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      //删除用户
      deldialogVisible: false,
      /* 分配角色 */
      isassignRoles: false,
      assignUser: {},
      rolesList: [],
      oneRole: "",
    };
  },
  methods: {
    // 封装获取用户列表数据
    async getUsers() {
      let { data: res } = await users(this.queryInfo);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.listUsers = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize值改变
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsers();
    },
    // 监听页码值改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUsers();
    },
    // 监听switch的变化
    async userStateChanged(userInfo) {
      // console.log(typeof userInfo.id);
      const { data: res } = await userState(userInfo);
      if (res.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error(res.meta.msg);
      }
      this.$message.success(res.meta.msg);
    },
    // 添加用户的表单关闭时执行添加用户事件
    addDialogclosed() {
      // 调用resetFields方法重置form表单的内容
      this.$refs.addFormRef.resetFields();
    },
    // 确认添加用户
    adduser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await addUsers(this.addUsers);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        // 表单隐藏
        this.dialogVisible = false;
        // 重新拉取数据列表
        this.getUsers();
      });
    },
    /* 修改用户信息 */
    async alterBtn(scope) {
      const { data: res } = await getUser(scope.row.id);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.alterusers = res.data;
      this.alterdialogVisible = true;
    },
    /* 修改用户信息对话框关闭的充值表单 */
    alterDialogclosed() {
      this.$refs.alterFormRef.resetFields();
    },
    alterUser() {
      console.log(this.alterusers);
      this.$refs.alterFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await alterUsers(this.alterusers);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.alterdialogVisible = false;
        this.getUsers();
      });
    },
    /* ------------------删除用户------------------------ */
    delBtn(scope) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await deluser(scope.row.id);
          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.getUsers();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /* ----------------分配角色 ----------------------*/
    async assignRoles(scope) {
      this.assignUser = scope.row;
      const { data: res } = await getRolesList();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.rolesList = res.data;
      this.isassignRoles = true;
    },
    /* 确认分配角色 */
    async confirmAssign() {
      if (!this.oneRole) return this.$message.error("请选择角色");
      const { data: res } = await assignRole(this.assignUser.id, this.oneRole);
      console.log(res);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.isassignRoles = false;
    },
    assignDialogclosed() {
      this.isassignRoles = false;
      this.assignUser = {};
      this.rolesList = [];
      this.oneRole = "";
    },
  },
  created() {
    this.getUsers();
  },
  components: {},
};
</script>

<style scoped lang="scss">
</style>
