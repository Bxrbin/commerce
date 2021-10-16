import instance from './index.js'
/* 登录 */
export function login(user, pass) {
  return instance({
    method: 'post',
    url: "/login",
    data: {
      username: user,
      password: pass
    }
  })
}
/* 请求左侧导航栏 */
export function menus() {
  return instance({
    url: "/menus",
  })
}

/* 用户数据列表 */
export function users(queryInfo) {
  return instance({
    url: "/users",
    params: queryInfo
  })
}
// 修改用户状态
export function userState(userInfo) {
  return instance({
    method: "put",
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
  })
}
//添加用户
export function addUsers(addUsers) {
  return instance({
    method: 'post',
    url: "users",
    data: addUsers
  })
}
// 修改用户信息
export function alterUsers(ialterUsers) {
  return instance({
    url: `/users/${ialterUsers.id}`,
    method: 'put',
    data: {
      emali: ialterUsers.email,
      mobile: ialterUsers.mobile
    }
  })
}
// 请求用户信息
export function getUser(id) {
  return instance({
    url: `/users/${id}`
  })
}
//删除用户信息
export function deluser(id) {
  return instance({
    method: 'delete',
    url: `/users/${id}`
  })
}
//获取权限管理中权限列表
export function getRightsList(type) {
  return instance({
    url: `/rights/${type}`
  })
}
//获取权限管理中角色列表
export function getRolesList() {
  return instance({
    url: `/roles`
  })
}
//获取商品分类管理
export function categories() {
  return instance({
    url: `/categories`
  })
}
//删除用户权限
export function deleterole(role, rightId) {
  return instance({
    method: 'delete',
    url: `roles/${role}/rights/${rightId}`
  })
}