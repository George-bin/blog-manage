<template>
  <div class="update-account-component">
    <div class="update-account-box">
      <m-header title="账户设置" icon="el-icon-user-solid"></m-header>
      <div class="update-account-content">
        <account-info :loading="loading" type="update" @submit="handleClickUpdateAccount"></account-info>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    MHeader: () => import('@/components/common/m-header-component.vue'),
    AccountInfo: () => import('@/components/account/account-info-component.vue')
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac
    })
  },
  methods: {
    ...mapActions([
      'UpdateUser'
    ]),
    // 用户注册
    handleClickUpdateAccount (data) {
      data = JSON.parse(JSON.stringify(data))
      if (data.password && data.newPassword) {
        data.password = this.$md5(data.password)
        data.newPassword = this.$md5(data.newPassword)
      }
      this.loading = true
      this.UpdateUser(data)
        .then(res => {
          let { errcode, message } = res
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            this.$router.back()
            return
          }
          this.$message({
            type: 'warning',
            message: message
          })
        })
        .catch(err => {
          console.error('更新用户信息失败!', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 取消注册
    handleClickGoBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
  .update-account-component {
    height: calc(100vh - 40px);
    padding-top: 40px;
    // background: #f7f7f7;
    overflow: auto;
    .update-account-box {
      padding: 0 20px;
      .update-account-content {
        max-width: 800px;
        padding-top: 20px;
        margin: 0 auto;
      }
    }
  }
</style>
