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


export function home() {
  return instance({
    url: "/home",
  })
}
export function mov_now() {
  return instance({
    url: "/movie_now",
  })
}
export function mov_future() {
  return instance({
    url: "/movie_future",
  })
}
export function group() {
  return instance({
    url: "/group",
  })
}

export function reg(user, pass) {
  return instance({
    method: 'post',
    url: "/register",
    data: {
      username: user,
      password: pass
    }
  })
}