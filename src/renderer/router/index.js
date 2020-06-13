import Vue from 'vue'
import Router from 'vue-router'

// 解决 {_name:""NavigationDuplicated"... start
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 解决 {_name:""NavigationDuplicated"... end
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'event',
      component: require('@/views/home/home').default,
      redirect: '/home/noContent',
      children: [
        {
          path: 'noteDetail',
          name: 'noteDetail',
          component: require('@/views/home/children/noteDetail').default
        },
        {
          path: 'noContent',
          name: 'noContent',
          component: () => import('@/views/home/children/noContent')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login')
    },
    {
      path: '/register',
      name: 'register',
      component: require('@/views/user/register').default
    }
  ]
})
