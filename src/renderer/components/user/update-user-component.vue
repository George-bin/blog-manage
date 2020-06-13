<template>
  <div class="update-account-component">
    <m-dialog
      ref="mDialog"
      title="个人信息"
      width="70%"
      icon="el-icon-user-solid"
      :isFull="true"
      :isShowFooter="false">
      <div slot="dialogContent">
        <user-form :loading="loading" type="update" @submit="handleClickUpdateAccount"></user-form>
      </div>
    </m-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: '',
  prop: {},
  components: {
    MDialog: () => import('@/components/common/m-dialog-component'),
    UserForm: () => import('@/components/user/user-form-component.vue')
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('visible', () => {
        this.$refs.mDialog.$emit('visible', true)
      })
    })
  },
  beforeDestroy () {},
  destroyed () {},
  methods: {
    ...mapActions([
      'UpdateUser'
    ]),
    /**
     * 更新用户信息
     * @params data: 用户表单数据
     */
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
            this.$refs.mDialog.$emit('visible', false)
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
    }
  }
}
</script>

<style lang="scss">
.update-account-component {
}
</style>
