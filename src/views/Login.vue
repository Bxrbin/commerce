<template>
  <div class="login">
    <div class="login_box">
      <div class="login_image">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        class="login_form"
        :model="loginfrom"
        :rules="rules"
        ref="loginRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginfrom.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginfrom.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login_">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, menus } from "../request/http";
export default {
  props: {},
  data() {
    return {
      loginfrom: {
        username: "admin",
        password: "123456",
      },
      rules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginFrom() {
      this.$refs.loginRef.resetFields();
    },
    /* 登录 */
    login_() {
      this.$refs.loginRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        let { data: res } = await login(
          this.loginfrom.username,
          this.loginfrom.password
        );
        if (res.meta.status !== 200) return this.$message.error("登录错误");
        /* 成功提示 */
        this.$message({
          message: "登陆成功！！！",
          type: "success",
          duration: 1000,
          onClose: () => {
            /* 保存到登录sessionStorage的会话级存储库中 */
            window.sessionStorage.setItem("token", res.data.token);
            this.$router.push("/home");
          },
        });
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_image {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px #ddd;
      background-color: white;
      img {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 1px solid #999;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      width: 100%;
      padding: 0 20px;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
