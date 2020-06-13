<template>
  <div class="user-info-component">
    <div class="user-info">
      <!-- <img class="avatar-icon" src="../../../../static/img/logo.png" alt="avatar" /> -->
      <span class="user-name">{{userInfo.username}}</span>
      <span class="edit-icon" @click="handleClickGoUpdateUser">
        <i class="el-icon-edit"></i>
      </span>
    </div>
    <i class="el-icon-menu"></i>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: '',
  props: {},
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      userInfo: state => state.user.userInfo
    })
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    /**
     * 前往编辑个人信息
     */
    handleClickGoUpdateUser () {
      this.$emit('updateUser')
    }
  }
}
</script>

<style lang="scss">
.user-info-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 11px 0 20px;
  background: #3c3c3c;
  // -webkit-app-region: drag;
  .user-info {
    display: flex;
    align-items: center;
    .avatar-icon {
      width: 42px;
      height: 42px;
    }
    .user-name {
      // margin-left: 5px;
      font-size: 16px;
    }
    .edit-icon {
      margin-left: 5px;
      margin-top: 5px;
      &:hover {
        cursor: pointer;
      }
      i {
        color: #f1c93f;
      }
    }
  }
  .el-icon-menu {
    font-size: 14px;
    color: #ccc;
    &:hover {
      // color: #0a419b;
      color: #f1c93f;
      cursor: pointer;
    }
  }
}
</style>
