import {
  loginRequest,
  registerRequest,
  logonRequest,
  updateUserRequest
} from '../../api/user'

const user = {
  state: {
    // 用户信息
    userInfo: {},
    isLogin: false
  },
  mutations: {
    SET_USER_INFO (state, data) {
      state.userInfo = data
    },
    SET_IS_Login (state, data) {
      state.isLogin = data
    }
  },
  actions: {
    // 用户登录
    Login ({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginRequest(data)
          .then(res => {
            let { errcode, userInfo } = res.data
            if (errcode === 0) {
              commit('SET_USER_INFO', userInfo)
              commit('SET_IS_Login', true)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 用户注册
    Register ({ commit }, data) {
      return new Promise((resolve, reject) => {
        registerRequest(data)
          .then(response => {
            if (response.data.errcode === 0) {
              resolve(response.data)
              return
            }
            reject(response.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 注销登录
    Logon ({ commit }) {
      return new Promise((resolve, reject) => {
        logonRequest()
          .then(res => {
            commit('SET_NOTE_LIST', [])
            commit('SET_ACTIVE_MODULE', '')
            commit('SET_IS_Login', false)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新用户信息
    UpdateUser ({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateUserRequest(data)
          .then(res => {
            let { errcode, userInfo } = res.data
            if (errcode === 0) {
              commit('SET_USER_INFO', userInfo)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

export default user
