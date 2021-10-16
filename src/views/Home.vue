<template>
  <el-container class="all">
    <el-header>
      <p>电商后台管理系统</p>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">| | |</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :default-active="activePath"
          :collapse="iscollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item of navigation"
            :key="item.id"
          >
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + item1.path"
              v-for="item1 of item.children"
              :key="item1.id"
              @click="saveState('/' + item1.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item1.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from "../request/http";
export default {
  props: {},
  data() {
    return {
      activePath: null,
      iscollapse: false,
      navigation: [],
      iconList: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-3702mima",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
    };
  },
  methods: {
    /* 退出登录 */
    logOut() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
    },
    /* 拿所有的菜单栏数据 */
    async getMenusList() {
      const { data: res } = await menus();
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.data.msg);
      this.navigation = res.data;
    },
    /* 收放左侧导航栏 */
    toggleCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    /* 把二级路由的index保存在storage */
    saveState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  created() {
    /* 请求左侧导航栏数据 */
    this.getMenusList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  components: {},
};
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // .el-container{
  //   flex: 1 !important;
  // }
  .el-aside {
    width: 180px;
    background-color: #333744;
    color: white;
    line-height: 200px;
    .el-menu {
      border-right: none;
    }
  }
  .toggle-button {
    height: 30px;
    line-height: 30px;
    background: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }

  .iconfont {
    margin-right: 10px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
