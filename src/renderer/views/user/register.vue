<template>
  <div class="register-account-component">
    <m-dialog
      ref="mDialog"
      title="个人信息"
      width="70%"
      icon="el-icon-user-solid"
      :isFull="true"
      :isShowFooter="false"
      @closed="onDialogClosed">
      <div slot="dialogContent">
        <user-form :loading="loading" @submit="handleClickRegister"></user-form>
      </div>
    </m-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    MDialog: () => import('@/components/common/m-dialog-component'),
    UserForm: () => import('@/components/user/user-form-component.vue')
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
      'Register'
    ]),
    // 用户注册
    handleClickRegister (data) {
      data = JSON.parse(JSON.stringify(data))
      data.password = this.$md5(data.password)
      this.loading = true
      this.Register(data)
        .then(res => {
          let { errcode, message } = res
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: '注册成功!'
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
          console.error('注册失败!', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 取消注册
    cancelRegister () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
  .register-account-component {
    height: calc(100vh - 40px);
    padding-top: 40px;
    // background: #f7f7f7;
    overflow: auto;
    .register-account-box {
      padding: 0 20px;
      .register-account-content {
        max-width: 800px;
        padding-top: 20px;
        margin: 0 auto;
      }
    }
  }
</style>
