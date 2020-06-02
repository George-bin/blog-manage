<template>
  <header class="header-component">
    <div class="header-box">
      <div class="title">
        <div
          class="title-box">
          <i :class="icon"></i>
          <h2>{{title}}</h2>
        </div>
      </div>
      <div class="btn-group">
        <slot name="btnGroup"></slot>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState({
      projectInfo: state => state.project.projectInfo
    })
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="scss">
.header-component {
  .header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    .title {
      .title-box {
        display: flex;
        align-items: center;
        padding-left: 10px;
        border-left: 4px solid #ccc;
        color: #0A419B;
        i {
          font-size: 18px;
        }
        h2 {
          margin-left: 2px;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .btn-group {
      .el-button {
        padding: 0;
      }
      .el-button + .el-button {
        margin-left: 0;
      }
    }
  }
}
</style>
