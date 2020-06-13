<template>
  <div class="register-account-component">
    <m-dialog
      ref="mDialog"
      title="个人注册"
      width="70%"
      icon="el-icon-user-solid"
      :isFull="true"
      :isShowFooter="false">
      <div slot="dialogContent">
        <user-form :loading="loading" @submit="onSubmitRegister"></user-form>
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
  mounted () {
    this.$nextTick(() => {
      this.$on('visible', (data) => {
        this.$refs.mDialog.$emit('visible', true)
      })
    })
  },
  methods: {
    ...mapActions([
      'Register'
    ]),
    /**
     * 监听用户注册
     * @params data: 用户表单数据
     */
    onSubmitRegister (data) {
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
            this.$refs.mDialog.$emit('visible', false)
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
    }
  }
}
</script>

<style lang="scss">
  .register-account-component {
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
