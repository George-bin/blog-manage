<template>
  <div class="note-introduction-component">
    <m-dialog
      ref="mDialog"
      title="笔记简介"
      icon="el-icon-tickets"
      width="550px">
      <template slot="dialogContent">
        <el-form ref="form" :model="formData" :rules="rules" label-width="60px">
          <el-form-item label="封面:" prop="img">
            <el-upload
              :action="serverUrl"
              :show-file-list="false"
              :on-success="handleUploadImgSuccess"
              :on-error="handleUploadImgError"
              :on-exceed="handleUploadImgExceed"
              :file-list="fileList"
              :limit="1">
              <el-button size="mini" type="primary">{{formData.img ? '重新上传' : '点击上传'}}</el-button>
              <div slot="tip" class="el-upload__tip">
                <img class="cover-img" v-if="formData.img" :src="formData.img" alt="封面" />
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="内容:" prop="introduction">
            <el-input
              v-model="formData.introduction"
              type="textarea"
              rows="4">
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="dialogFooter">
        <el-button :loading="loading" type="primary" @click="handleClickSubmit">提交</el-button>
      </template>
    </m-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: '',
  props: {},
  components: {
    MDialog: () => import('@/components/common/m-dialog-component')
  },
  data () {
    return {
      loading: false,
      serverUrl: '',
      network: {
        ip: '127.0.0.1',
        port: '10023'
      },
      fileList: [],
      // 简介信息
      formData: {
        _id: '',
        introduction: '',
        img: ''
      },
      rules: {
        introduction: [
          { required: true, message: '请输入简介内容!', trigger: 'blur' },
          { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
        ]
        // img: [
        //   { required: true, message: '请上传封面图片!', trigger: 'blur' }
        // ],
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.init()
    this.$nextTick(() => {
      this.$on('showDialog', (data) => {
        this.$refs.mDialog.$emit('visible', true)
        this.formData = {
          _id: data._id,
          introduction: data.introduction,
          img: data.img
        }
      })
    })
  },
  methods: {
    ...mapActions([
      'UpdateNoteAttr'
    ]),
    init () {
      let network = localStorage.getItem('network')
      if (network) {
        this.network = JSON.parse(network)
      }
      this.serverUrl = `http://${this.network.ip}:${this.network.port}` + '/api/blog/uploadfile'
    },
    // 上传成功
    handleUploadImgSuccess (res, file, fileList) {
      this.formData.img = `http://${this.network.ip}${res.filePath}`
      this.fileList = []
    },
    /**
     * 上传失败
     * @params err:
     * @params file:
     * @params fileList:
     */
    handleUploadImgError () {
      this.$message({
        type: 'error',
        message: '图片上传失败!'
      })
    },
    // 文件超出个数限制时的钩子
    handleUploadImgExceed (files, fileList) {
      this.$message({
        type: 'warning',
        message: '只能选择一张图片作为封面图片!'
      })
      return false
    },
    // 提交表单
    handleClickSubmit () {
      if (this.loading) return
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.UpdateNoteAttr({
            ...this.formData
          })
            .then(data => {
              let { errcode, message } = data
              if (errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '成功!',
                  duration: 1000
                })
                this.$refs.mDialog.$emit('visible', false)
                return
              }
              this.$message({
                type: 'warning',
                message
              })
            })
            .catch(err => {
              console.log('更新笔记简介失败!', err)
              this.$message({
                type: 'error',
                message: '更新笔记简介失败!'
              })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.note-introduction-component {
  .cover-img {
    width: 200px;
  }
}
</style>
