import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    // 解决刷新数据丢失问题
    // createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
