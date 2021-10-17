<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="adddialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-------------- 角色列表 --------------------->
      <el-table :data="permissionList" border stripe>
        <!----------- 展开行 ------------------------>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 遍历一级权限 -->
            <el-row
              :class="['bdBottom', i === 0 ? 'bdTop' : '', 'vcenter']"
              v-for="(tag, i) in scope.row.children"
              :key="tag.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightId(scope.row, tag.id)">
                  {{ tag.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 遍历二级权限 -->
                <el-row
                  :class="[i1 === 0 ? '' : 'bdTop', 'vcenter']"
                  v-for="(tag1, i1) in tag.children"
                  :key="tag1.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightId(scope.row, tag1.id)"
                    >
                      {{ tag1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 遍历三级权限 -->
                    <el-tag
                      :class="[i2 === 0 ? '' : 'bdTop']"
                      v-for="(tag2, i2) in tag1.children"
                      :key="tag2.id"
                      type="warning"
                      closable
                      @close="removeRightId(scope.row, tag2.id)"
                    >
                      {{ tag2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="enitUser(scope)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deluser(scope)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="openPrivileges(scope)"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-------------------分配权限的对话框--------------------->
    <el-dialog
      title="分配权限"
      :visible.sync="privileges"
      width="50%"
      @close="handleClose"
    >
      <!-- 内容文本 -->
      <template>
        <el-tree
          :data="treeControl"
          show-checkbox
          node-key="id"
          ref="checktree"
          :default-checked-keys="checkId"
          :props="defaultProps"
          :default-expand-all="true"
        >
        </el-tree>
      </template>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="privileges = false">取 消</el-button>
        <el-button type="primary" @click="serveRole">确 定</el-button>
      </span>
    </el-dialog>
    <!------------------ 添加用户的对话框 --------------->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="addDialogclosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addUser"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="roleDesc">
          <el-input v-model="addUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Fromadduser">确 定</el-button>
      </span>
    </el-dialog>
    <!------------------ 编辑用户的对话框 --------------->
    <el-dialog
      title="编辑用户"
      :visible.sync="finddialogVisible"
      width="50%"
      @close="addDialogclosed"
    >
      <!-- 内容主体区 -->
      <el-form
        :model="addUser"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="roleName">
          <el-input v-model="addUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="roleDesc">
          <el-input v-model="addUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  getRightsList,
  deleterole,
  setrole,
  addrole,
  delUser,
  findUser,
  editRole
} from "../../request/http";
export default {
  props: {},
  data() {
    return {
      /* 角色列表 */
      permissionList: [],
      /* 树形控件数据 */
      /* 所有被选中的id */
      treeControl: [],
      roleId: 0,
      /* 所有角色拥有的权限的id */
      checkId: [],
      privileges: false,
      defaultProps: {
        children: "children",
        label: "authName",
      },
      /* 添加用户 */
      adddialogVisible: false,
      addUser: {
        roleName: "",
        roleDesc: "",
      },
      addUserRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      /* 编辑用户 */
      finddialogVisible: false,
    };
  },
  methods: {
    /* 获取角色列表 */
    async getroleslist() {
      const { data: res } = await getRolesList();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.permissionList = res.data;
    },
    /* 根据id删除对应的权限 */
    async removeRightId(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.error("取消了删除");
      }
      const { data: res } = await deleterole(role.id, rightId);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      role.children = res.data;
    },
    /* 分配权限的点击按钮 */
    async openPrivileges(role) {
      this.roleId = role.row.id;
      const { data: res } = await getRightsList("tree");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.treeControl = res.data;
      this.pushcheckId(role.row);
      this.privileges = true;
    },
    /* 递归拿id push进被选中的id数组中 */
    pushcheckId(keys) {
      if (!keys.children) {
        return this.checkId.push(keys.id);
      } else {
        keys.children.forEach((item) => {
          this.pushcheckId(item);
        });
      }
    },
    /* 在分配权限的对话框中修改权限 */
    async serveRole() {
      let checkedId = [
        ...this.$refs.checktree.getCheckedKeys(),
        ...this.$refs.checktree.getHalfCheckedKeys(),
      ];
      checkedId = checkedId.join(",");
      console.log(checkedId);
      const { data: res } = await setrole(this.roleId, checkedId);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      console.log(res);
      this.getroleslist();
      this.privileges = false;
    },
    handleClose() {
      this.checkId = [];
    },
    /* 添加用户对话框中确认提交的事件 */
    async Fromadduser() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await addrole(this.addUser);
        console.log(res);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.adddialogVisible = false;
        this.getroleslist();
      });
    },
    /* 关闭添加用户对话框重置表单 */
    addDialogclosed() {
      this.$refs.addUserRef.resetFields();
    },
    /* ------------------删除用户------------------------ */
    deluser(scope) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await delUser(scope.row.id);
          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message.success(res.meta.msg);
          this.getroleslist();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /* ------------------获取编辑的用户信息------------------------ */
    async enitUser(scope) {
      const { data: res } = await findUser(scope.row.id);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.addUser = res.data;
      this.finddialogVisible = true;
    },
    /* --------------编辑用户对话框中确认提交的事件 ------------------*/
    async editUser() {
      console.log(this.addUser);
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await editRole(this.addUser);
        console.log(res);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.finddialogVisible = false;
        this.getroleslist();
      });
    },
  },
  created() {
    this.getroleslist();
  },
  components: {},
};
</script>

<style scoped lang="scss">
.el-tag {
  margin: 7px;
}
.bdTop {
  border-top: solid 1px #eee;
}
.bdBottom {
  border-bottom: solid 1px #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
