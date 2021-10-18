import instance from "./index.js";
/* 登录 */
export function login(user, pass) {
  return instance({
    method: "post",
    url: "/login",
    data: {
      username: user,
      password: pass,
    },
  });
}
/* 请求左侧导航栏 */
export function menus() {
  return instance({
    url: "/menus",
  });
}

/* 用户数据列表 */
export function users(queryInfo) {
  return instance({
    url: "/users",
    params: queryInfo,
  });
}
// 修改用户状态
export function userState(userInfo) {
  return instance({
    method: "put",
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
  });
}
//添加用户
export function addUsers(addUsers) {
  return instance({
    method: "post",
    url: "users",
    data: addUsers,
  });
}
// 修改用户信息
export function alterUsers(ialterUsers) {
  console.log(ialterUsers);
  return instance({
    url: `users/${ialterUsers.id}`,
    method: "put",
    data: ialterUsers,
  });
}
// 请求用户信息
export function getUser(id) {
  return instance({
    url: `/users/${id}`,
  });
}
//删除用户信息
export function deluser(id) {
  return instance({
    method: "delete",
    url: `/users/${id}`,
  });
}
//分配用户角色
export function assignRole(id, rid) {
  return instance({
    method: "put",
    url: `/users/${id}/role `,
    data: { rid },
  });
}
/* -----------------------权限管理----------------------- */
//获取权限管理中权限列表
export function getRightsList(type) {
  return instance({
    url: `/rights/${type}`,
  });
}
//获取权限管理中角色列表
export function getRolesList() {
  return instance({
    url: `/roles`,
  });
}
//获取商品分类管理
export function categories() {
  return instance({
    url: `/categories`,
  });
}
//删除用户权限
export function deleterole(role, rightId) {
  return instance({
    method: "delete",
    url: `roles/${role}/rights/${rightId}`,
  });
}
//设置用户权限
export function setrole(id, idString) {
  return instance({
    method: "post",
    url: `roles/${id}/rights`,
    data: { rids: idString },
  });
}
//添加用户
export function addrole(users) {
  return instance({
    method: "post",
    url: `roles`,
    data: users,
  });
}
//删除用户角色
export function delUser(id) {
  return instance({
    method: "delete",
    url: `/roles/${id}`,
  });
}
//查找用户角色
export function findUser(id) {
  return instance({
    url: `/roles/${id}`,
  });
}
//编辑用户角色
export function editRole(addUser) {
  return instance({
    method: "put",
    url: `/roles/${addUser.roleId}`,
    data: addUser,
  });
}
/* ------------------获取可视化数据--------------------- */
export function getEcharts(addUser) {
  return instance({
    url: `reports/type/1`,
  });
}
/* ------------------获取订单数据--------------------- */
export function getOrders(queryInfo) {
  return instance({
    url: `orders`,
    params: queryInfo,
  });
}
/* 获取物流状态 */
export function getLogistics() {
  return instance({
    url: `/kuaidi/1106975712662`,
  });
}
/* -----------获取商品分类----------------------------------------------------------------- */
export function getCategories(page) {
  return instance({
    url: `categories`,
    params:page
  });
}