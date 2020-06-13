<template>
  <div class="create-notebook-main-section">
    <m-dialog
      ref="mDialog"
      title="新建文件夹"
      icon="el-icon-folder"
      width="450px">
      <template slot="dialogContent">
        <p style="padding-bottom: 5px">文件夹名称:</p>
        <el-input
          v-model="notebookName"
          ref="notebookNameInp"
          type="text"
          @keyup.enter.native="handleClickCreateNotebook"
          placeholder="请输入文件夹名称!">
        </el-input>
      </template>
      <template slot="dialogFooter">
        <el-button :loading="loading" type="primary" :disabled="!notebookName" @click="handleClickCreateNotebook">提交</el-button>
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
      notebookName: '',
      loading: false
    }
  },
  computed: {
    ...mapState({
      activeNotebook: state => state.notebook.activeNotebook,
      userInfo: state => state.user.userInfo
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('showDialog', () => {
        this.$refs.mDialog.$emit('visible', true)
        this.$nextTick(() => {
          this.$refs['notebookNameInp'].focus()
        })
      })
    })
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'CreateNotebook'
    ]),
    // 创建笔记本
    handleClickCreateNotebook () {
      if (this.loading) return
      this.loading = true
      this.CreateNotebook({
        name: this.notebookName, // 笔记本名称
        account: this.userInfo._id, // 所属用户
        createTime: null, // 创建时间
        updateTime: null, // 更新时间
        PARENT_CODE: this.activeNotebook._id, // 父级节点的code
        grade: this.activeNotebook.grade + 1 // 节点等级
      })
        .then(data => {
          let { errcode, message } = data
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: '新建了一个笔记本!'
            })
            this.notebookName = ''
            this.$refs.mDialog.$emit('visible', false)
          } else {
            this.$message({
              type: 'warning',
              message
            })
          }
        })
        .catch(err => {
          console.error('新建笔记本失败:', err)
          this.$message({
            message: '创建笔记本失败!',
            type: 'error'
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
.create-notebook-main-section {}
</style>
