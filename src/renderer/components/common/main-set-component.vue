<template>
  <div class="main-set-main-component">
    <!--设置选项-->
    <ul v-if="showSetList" class="setup-list">
      <template v-if="isLogin">
        <li
          class="setup-list__item"
          @click="handleClickLogon">
          退出登录
        </li>
      </template>
      <template v-else>
        <li
          class="setup-list__item"
          @click.stop="handleClickStartSetNetwork">
          网络设置
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      showSetList: false
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin
    })
  },
  mounted () {
    this.init()
    this.$nextTick(() => {
      this.$on('openSet', () => {
        this.showSetList = true
      })
      this.$on('closeSet', () => {
        this.showSetList = false
      })
    })
  },
  methods: {
    ...mapActions(['Logon']),
    init () {},

    // 注销
    handleClickLogon () {
      this.$confirm('确定退出登录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.Logon()
            .then(data => {
              if (data.errcode === 0) {
                this.$message({
                  type: 'success',
                  message: '注销成功!',
                  duration: 1500
                })
                this.$router.push('/login')
              }
            })
            .catch(err => {
              console.error('注销失败!', err)
              this.$router.push('/login')
            })
        })
        .catch(() => {})
    },

    // 网络设置
    handleClickStartSetNetwork () {
      console.log('打开网络设置!')
      this.showSetList = false
      this.$emit('openSetItem', 'network')
    }
  }
}
</script>

<style lang="scss">
.main-set-main-component {
  .setup-list {
    position: fixed;
    right: 42px;
    top: 26px;
    // border: 1px solid #a7a7a7;
    z-index: 9999;
    box-shadow: 0 0 5px #dfdfdf;
    .setup-list__item {
      height: 24px;
      line-height: 24px;
      padding: 0 20px;
      cursor: pointer;
      background: #ffffff;
    }
    .setup-list__item:hover {
      background: #dfdfdf;
    }
    .setup-list__item + .setup-list__item {
      border-top: 1px solid #dfdfdf;
    }
  }
}
</style>
