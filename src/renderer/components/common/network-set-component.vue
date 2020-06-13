<template>
  <div class="network-set-component">
    <m-dialog
      ref="mDialog"
      title="网络设置"
      icon="el-icon-paperclip"
      width="450px">
      <template slot="dialogContent">
        <el-form ref="form" :model="formData" :rules="rules" label-width="60px">
          <el-form-item label="IP" prop="ip">
            <el-input
              v-model="formData.ip"
              placeholder="请输入目标IP地址!"
              @keyup.enter.native="handleChangeNetworkAddress">
            </el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input
              v-model="formData.port"
              type="number"
              placeholder="请输入目标端口!"
              @keyup.enter.native="handleChangeNetworkAddress">
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="dialogFooter">
        <el-button type="primary" :loading="loading" @click="handleChangeNetworkAddress">确定</el-button>
      </template>
    </m-dialog>
  </div>
</template>

<script>
import { destoryAxios } from '../../utils/request'
export default {
  components: {
    MDialog: () => import('@/components/common/m-dialog-component')
  },
  data () {
    return {
      loading: false,
      formData: {
        ip: '',
        port: 10023
      },
      rules: {
        ip: [
          { required: true, message: '请输入目标IP地址!', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '请输入目标端口!', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
    this.$nextTick(() => {
      this.$on('setNetwork', () => {
        this.$refs.mDialog.$emit('visible', true)
      })
    })
  },
  methods: {
    init () {
      let network = localStorage.getItem('network')
      if (network) {
        network = JSON.parse(network)
        this.formData = {
          ip: network.ip,
          port: network.port
        }
      }
    },
    handleChangeNetworkAddress () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          localStorage.setItem('network', JSON.stringify(this.formData))
          destoryAxios()
          this.$message({
            type: 'success',
            message: '网络配置已更新!'
          })
          this.$refs.mDialog.$emit('visible', false)
        } else {
          this.$message({
            type: 'warning',
            message: '请完善必要信息!'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.network-set-component {
  .el-form {
    padding-right: 22px;
  }
}
</style>
