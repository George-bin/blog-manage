<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :modal="false"
    :close-on-click-modal="false"
    :width="width"
    :fullscreen="isFull"
    custom-class="m-dialog-component"
    @close="onClose">
    <div slot="title" class="el-dialog__header-title">
      <div class="el-dialog__header-title-box" :class="{'el-dialog__header-title-box-padding': isFull}">
        <i :class="icon"></i>
        <h3 class="el-dialog__headertitle">{{title}}</h3>
      </div>
    </div>
    <div class="el-dialog__content">
      <slot name="dialogContent"></slot>
    </div>
    <div v-if="isShowFooter" class="el-dialog__footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <slot name="dialogFooter"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    icon: {
      type: String,
      default: 'el-icon-user-solid'
    },
    title: {
      type: String,
      default: '标题'
    },
    width: {
      type: String,
      default: '350px'
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    isFull: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data () {
    return {
      dialogVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
    this.$nextTick(() => {
      this.$on('visible', (data) => {
        this.dialogVisible = data
      })
    })
  },
  beforeDestroy () {},
  destroyed () {},
  methods: {
    onClose () {
      this.dialogVisible = false
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss">
.m-dialog-component {
  border-radius: 0;
  .el-dialog__header {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0;
    border-bottom: 1px solid #ccc;
    background: #f8f8f8;
    .el-dialog__header-title {
      flex: 1;
      padding: 2px 0 5px 0;
      margin-left: 10px;
      color: #0a419b;
      .el-dialog__header-title-box {
        display: flex;
        align-items: center;
      }
      .el-dialog__header-title-box-padding {
        padding-left: 10px;
        border-left: 4px solid #ccc;
      }
      i {
        margin-right: 5px;
        font-size: 18px;
        font-weight: bold;
      }
      h3 {
        font-weight: bold;
        letter-spacing: 1px;
      }
    }
    .el-dialog__headerbtn {
      position: static;
      .el-dialog__close {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }
      .el-dialog__close:hover {
        color: #FFFFFF !important;
      }
    }
    .el-dialog__headerbtn:hover {
      background: #FF0000;
    }
  }
  .el-dialog__body {
    padding: 0;
    background: #fff;
    .el-dialog__content {
      padding: 20px 10px;
    }
    .el-dialog__footer {
      padding: 5px;
      background: #f7f7f7;
      .el-button {
        width: 80px;
        height: 30px;
        padding: 0;
        font-size: 12px;
        outline: none;
        border-radius: 0;
      }
    }
  }
}
</style>
