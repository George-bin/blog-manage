<template>
  <div class="user-form-component">
    <!--输入框区域-->
    <!-- :show-message="false" -->
    <el-form
      ref="registerForm"
      :model="formData"
      :rules="rules"
      class="register-form"
      label-width="70px">
      <el-form-item prop="account" label="账户">
        <el-input
          :disabled="type === 'update'"
          prefix-icon="el-icon-user-solid"
          placeholder="请输入用户名!"
          v-model="formData.account">
        </el-input>
      </el-form-item>
      <el-form-item prop="password" :label="type === 'update' ? '原密码' : '密码'">
        <el-input
          prefix-icon="iconfont icon-mima"
          placeholder="请输入密码!"
          v-model="formData.password"
          type="password">
        </el-input>
      </el-form-item>
      <el-form-item v-if="type === 'update'" prop="newPassword" label="新密码">
        <el-input
          prefix-icon="iconfont icon-mima"
          placeholder="请输入密码!"
          v-model="formData.newPassword"
          type="password">
        </el-input>
      </el-form-item>
      <el-form-item prop="username" label="昵称">
        <el-input
          prefix-icon="iconfont icon-mingcheng"
          placeholder="请输入用户昵称!"
          v-model="formData.username">
        </el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input
          prefix-icon="iconfont icon-youxiang"
          placeholder="请输入用户邮箱!"
          v-model="formData.email">
        </el-input>
      </el-form-item>
      <el-form-item prop="phone" label="电话">
        <el-input
          prefix-icon="iconfont icon-telephone"
          placeholder="请输入用户电话!"
          v-model="formData.phone">
        </el-input>
      </el-form-item>
      <el-form-item prop="username" label="年龄">
        <el-input-number v-model="formData.age" :min="15" :max="99" label="请输入年龄!"></el-input-number>
      </el-form-item>
      <el-form-item prop="sex" label="性别">
        <el-radio-group v-model="formData.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="avatar" label="头像">
        <el-input
          prefix-icon="el-icon-user-solid"
          placeholder="请输入头像地址!"
          v-model="formData.avatar">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click.native="handleClickSubmit" class="btn-button">提交</el-button>
        <el-button class="btn-button" @click="handleClickReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validatorSpace } from '@/utils/script/validatorData'
import { mapState } from 'vuex'
export default {
  name: '',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  components: {},
  data () {
    return {
      formData: {
        account: '',
        password: '',
        username: '',
        email: '',
        phone: '',
        age: '',
        sex: '男',
        avatar: '',
        newPassword: ''
      },
      rules: {
        account: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        password: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        newPassword: [{ required: true, validator: validatorSpace, trigger: 'blur' }],
        username: [{ required: true, validator: validatorSpace, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {},
  created () {
    this.init()
  },
  mounted () {

  },
  beforeDestroy () {},
  destroyed () {},
  methods: {
    init () {
      if (this.type === 'update') {
        this.rules.password = [
          { message: '请输入用户密码!', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度在 6 到 9 个字符!', trigger: 'blur' }
        ]
        this.rules.newPassword = [
          { message: '请输入用户密码!', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度在 6 到 9 个字符!', trigger: 'blur' }
        ]
        let data = JSON.parse(JSON.stringify(this.userInfo))
        data.password = ''
        data.newPassword = ''
        this.formData = data
      }
    },
    handleClickSubmit () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          if (this.formData.password && this.formData.newPassword) {
            if (this.formData.password === this.formData.newPassword) {
              this.$message({
                type: 'warning',
                message: '原密码和新密码一致!'
              })
              return
            }
          }
          this.$emit('submit', this.formData)
        } else {
          this.$message({
            type: 'warning',
            message: '请完善必要数据!'
          })
        }
      })
    },
    /**
     * 重置表单
     */
    handleClickReset () {
      if (this.type === 'update') {
        this.formData = {
          account: this.userInfo.account,
          username: this.userInfo.username,
          email: this.userInfo.email,
          phone: this.userInfo.phone,
          age: this.userInfo.age,
          sex: this.userInfo.sex,
          avatar: this.userInfo.avatar,
          password: '',
          newPassword: ''
        }
      } else {
        this.formData = {
          account: '',
          password: '',
          username: '',
          email: '',
          phone: '',
          age: '',
          sex: '男',
          avatar: '',
          newPassword: ''
        }
      }
    }
  }
}
</script>

<style lang="scss">
.user-form-component {
  max-width: 650px;
  .el-form-item {
    // margin-bottom: 6px;
    .el-input__inner {
      border-radius: 0;
    }
    .btn-button {
      border-radius: 0;
    }
    .iconfont {
      padding-left: 5px;
      font-size: 14px;
    }
  }
}
</style>
