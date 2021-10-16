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
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="permissionList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
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
                    <el-tag
                      :class="[i2 === 0 ? '' : 'bdTop']"
                      v-for="(tag2, i2) in tag.children"
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
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="openPrivileges"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="添加用户"
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
          :props="defaultProps"
          :default-expand-all="true"
        >
        </el-tree>
      </template>
      <!-- 底部点击区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="privileges = false">取 消</el-button>
        <el-button type="primary" @click="openPrivileges">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, getRightsList, deleterole } from "../../request/http";
export default {
  props: {},
  data() {
    return {
      permissionList: [],
      privileges: false,
      /* 树形控件数据 */
      treeControl: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },
  methods: {
    /* 获取角色列表 */
    async getroleslist() {
      const { data: res } = await getRolesList();
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.$message.success(res.meta.msg);
      this.permissionList = res.data;
      this.treeControl = res.data.children;
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
      console.log(role.id, rightId);
      const { data: res } = await deleterole(role.id, rightId);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      role.children = res.data;
    },
    /* 分配权限的点击按钮 */
    async openPrivileges() {
      const { data: res } = await getRightsList("tree");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      console.log(res);
      this.$message.success(res.meta.msg);
      this.treeControl = res.data;
      this.privileges = true;
    },
    handleClose() {},
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
