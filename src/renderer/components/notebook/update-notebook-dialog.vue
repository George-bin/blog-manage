<template>
  <div class="update-notebook-main-component">
    <m-dialog
      ref="mDialog"
      title="文件夹重命名"
      icon="el-icon-folder"
      width="450px">
      <template slot="dialogContent">
        <p style="padding-bottom: 5px">新的名称:</p>
        <el-input
          v-model="notebook.name"
          ref="notebookNameInp"
          type="text"
          @keyup.enter.native="handleClickUpdateNotebook"
          placeholder="请输入文件夹名称!">
        </el-input>
      </template>
      <template slot="dialogFooter">
        <el-button :loading="loading" type="primary" :disabled="!notebook.name" @click="handleClickUpdateNotebook">提交</el-button>
      </template>
    </m-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    MDialog: () => import('@/components/common/m-dialog-component')
  },
  data () {
    return {
      loading: false,
      notebook: {}
    }
  },
  computed: {
    ...mapState({
      activeNotebook: state => state.notebook.activeNotebook
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('showDialog', (data) => {
        this.$refs.mDialog.$emit('visible', true)
        this.notebook = JSON.parse(JSON.stringify(this.activeNotebook))
        this.$nextTick(() => {
          this.$refs['notebookNameInp'].focus()
        })
      })
    })
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'UpdateNotebook'
    ]),
    // 更新笔记本
    handleClickUpdateNotebook () {
      if (this.loading) return
      this.loading = true
      this.UpdateNotebook({
        _id: this.notebook._id,
        name: this.notebook.name
      })
        .then(data => {
          let { errcode, message } = data
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: '更新了一个文件夹名称!'
            })
            this.$refs.mDialog.$emit('visible', false)
          } else {
            this.$message({
              type: 'warning',
              message
            })
          }
        })
        .catch(err => {
          console.error('更新文件夹名称失败:', err)
          this.$message({
            type: 'error',
            message: '更新文件夹名称失败!'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.update-notebook-main-component {}
</style>
