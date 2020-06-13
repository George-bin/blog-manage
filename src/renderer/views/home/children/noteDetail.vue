<template>
  <div class="note-detail-component" @keyup.ctrl.83="handleUpdateNote">
    <header class="title-section">
      <input
        placeholder="文章标题"
        class="note-title-input"
        v-model="note.title"
        type="text"
        @keyup.enter="handleQuillFocus" />
      <span
        :style="{
          background: changeFlag ? 'red' : '#dfdfdf'
        }"
        class="article-change-flag"></span>
      <el-select
        class="set-note-label"
        size="small"
        v-model="note.type"
        @change="onNoteTypeChange"
        placeholder="">
        <el-option label="正文" value="main" selected></el-option>
        <el-option label="草稿" value="draft"></el-option>
       </el-select>
    </header>
    <div v-loading="loading">
      <div
        ref="editorElem"
        style="text-align:left;">
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import E from 'wangeditor' // eslint-disable-line
let editor = null
export default {
  components: {},
  data () {
    return {
      note: {
        title: '', // 笔记标题
        content: '', // 笔记内容
        status: 1, // 笔记状态 0：未完成 1：已完成 2：进入回收站
        createTime: null, // 创建时间
        updateTime: null, // 更新时间
        type: 'draft', // 文章类型 draft：草稿 main：正文
        label: [], // 关联标签
        account: '', // 关联账户
        notebookId: '' // 笔记本id
      },
      oldNote: { // 旧数据 => 用于判断是否更新
        title: '',
        content: ''
      },
      serverUrl: '',
      network: {
        ip: '127.0.0.1',
        port: 10023
      },
      changeFlag: false,
      loading: false
    }
  },
  computed: {
    ...mapState({
      isMac: state => state.home.isMac,
      activeNote: state => state.note.activeNote
    })
  },
  watch: {
    'note.title': function (val, oldval) {
      let content = editor.txt.html()
      if (val !== this.oldNote.title || (content !== this.oldNote.content && content !== '<p><br></p>')) {
        this.changeFlag = true
      } else {
        this.changeFlag = false
      }
    },
    activeNote: {
      handler: function (val, oldval) {
        this.oldNote = JSON.parse(JSON.stringify(val))
        if (this.changeFlag) {
          this.$confirm('文章尚未保存，是否需要保存？', '提示', {
            type: 'warning'
          })
            .then(() => {
              this.handleUpdateNote()
                .then(() => {
                  editor.txt.html(val.content)
                  this.changeFlag = false
                  this.note = JSON.parse(JSON.stringify(val))
                })
            })
            .catch(() => {
              editor.txt.html(val.content)
              this.changeFlag = false
              this.note = JSON.parse(JSON.stringify(val))
            })
        } else {
          editor.txt.html(val.content)
          this.changeFlag = false
          this.note = JSON.parse(JSON.stringify(val))
        }
      },
      deep: true
    }
  },
  created () {},
  mounted () {
    this.note = JSON.parse(JSON.stringify(this.activeNote))
    this.oldNote = JSON.parse(JSON.stringify(this.activeNote))
    let network = localStorage.getItem('network')
    if (network) {
      this.network = JSON.parse(network)
    }
    this.serverUrl = `http://${this.network.ip}:${this.network.port}` + '/api/blog/uploadfile'
    this.init()
  },
  destroyed () {
    editor = null
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'UpdateNote',
      'UpdateNoteAttr'
    ]),
    init () {
      let that = this
      editor = new E(this.$refs.editorElem)
      // 自定义配置颜色（字体颜色、背景色）
      editor.customConfig.colors = [
        '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
        '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
        '#ececec', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
        '#bbbbbb', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
        '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
      ]
      editor.customConfig.debug = true
      editor.customConfig.uploadImgShowBase64 = false // 使用 base64 保存图片
      // 上传图片到服务器，配置服务器端地址
      editor.customConfig.uploadImgServer = this.serverUrl
      // 隐藏“网络图片”tab
      editor.customConfig.showLinkImg = false
      // 将图片大小限制为 3M
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
      // 限制一次最多上传 1 张图片
      editor.customConfig.uploadImgMaxLength = 1
      // 编辑器的事件，每次改变会获取其html内容
      editor.customConfig.onchange = html => {
        this.editorContent = html
      }
      editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        // 'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'link', // 插入链接
        'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      // 图片上传钩子
      editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          that.loading = true
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
        },
        success: function (xhr, editor, result) {
          that.loading = false
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
          that.loading = false
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
          that.loading = false
          this.$message({
            type: 'warning',
            message: '图片上传错误!'
          })
        },
        timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },

        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = `http://${that.network.ip}${result.filePath}`

          insertImg(url)

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      // 监听内容改变
      editor.customConfig.onchange = (html) => {
        // console.log(html)
        this.changeFlag = true
        let content = editor.txt.html()
        // console.log('this.oldNote.content', this.oldNote.content)
        // console.log('content', content)
        if (this.oldNote.content === content || content === '<p><br></p>') {
          this.changeFlag = false
        }
      }
      // 获取焦点
      editor.customConfig.onfocus = () => {
        // console.log('onfocus')
        let content = editor.txt.html()
        // console.log('this.oldNote.content', this.oldNote.content)
        // console.log('content', content)
        if (this.oldNote.content === content) {
          this.changeFlag = false
        }
      }
      editor.create() // 创建富文本实例
      editor.txt.html(this.note.content)
      /* eslint-disable */
      this.$nextTick(() => {
        $('.w-e-text-container .w-e-text').addClass('main-scrollbar')
        if (!this.isMac) {
          $('.w-e-text-container').addClass('w-e-text-container-window')
        }
      })
      /* eslint-enable */
    },

    // 更新笔记
    handleUpdateNote () {
      let content = editor.txt.html()
      if (this.network.ip === '127.0.0.1') {
        content = content.replace(/src='http:\/\/127.0.0.1\/file\/uploads\/images\/blog/g, 'src=/file/uploads/images/blog')
      } else {
        content = content.replace(/src='http:\/\/39.105.55.137\/file\/uploads\/images\/blog/g, 'src=/file/uploads/images/blog')
      }
      // console.log('content', content)
      this.loading = true
      return new Promise((resolve, reject) => {
        this.UpdateNote({
          _id: this.note._id,
          content: content,
          title: this.note.title
        })
          .then(data => {
            this.changeFlag = false
            let { errcode, message } = data
            if (errcode === 0) {
              this.$message({
                message: '更新了一个笔记!',
                type: 'success',
                duration: 1000
              })
            } else {
              this.$message({
                type: 'warning',
                message,
                duration: 1000
              })
            }
            resolve()
          })
          .catch(err => {
            console.error('更新笔记失败:', err)
            this.$message({
              type: 'error',
              message: '更新笔记失败!',
              duration: 1000
            })
            reject(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },

    // 更新笔记类型
    onNoteTypeChange (type) {
      this.UpdateNoteAttr({
        _id: this.activeNote._id,
        type
      })
        .then(data => {
          let { errcode, message } = data
          if (errcode === 0) {
            this.$message({
              type: 'success',
              message: `文章被设置为${type === 'main' ? '正文' : '草稿'}!`,
              duration: 1000
            })
          } else {
            this.note.type = this.activeNote.type
            this.$message({
              type: 'warning',
              message,
              duration: 1000
            })
          }
        })
        .catch(err => {
          this.note.type = this.activeNote.type
          console.error('更新笔记类型失败!', err)
          this.$message({
            type: 'error',
            message: '更新笔记类型失败!'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.note-detail-component {
  .title-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 54px !important;
    padding: 0 5px;
    border-bottom: 1px solid #cccccc;
    text-align: right;
    background: #ffffff !important;
    .note-title-input {
      flex: 1;
      height: 36px;
      line-height: 36px;
      padding: 0 5px;
      padding-right: 25px;
      border: 1px solid #fff;
      outline: none;
      &:focus {
        border: 1px solid #ccc;
      }
    }
    .article-change-flag {
      position: absolute;
      right: 105px;
      width: 10px;
      height: 10px;
      background: #00c300;
      border-radius: 50%;
      box-shadow: 0 0 5px #676767;
      transition: background 0.5s;
    }
    .set-note-label {
      width: 80px;
      margin-left: 10px;
    }
  }
  .w-e-toolbar {
    flex-wrap: wrap;
    border: none !important;
    border-bottom: 1px solid #ccc !important;
    background: none !important;
    .w-e-menu:nth-child(1),
    .w-e-menu:nth-child(3),
    .w-e-menu:nth-child(7),
    .w-e-menu:nth-child(8),
    .w-e-menu:nth-child(9),
    .w-e-menu:nth-child(10),
    .w-e-menu:nth-child(12) {
      z-index: 2 !important;
    }
    .w-e-menu:nth-child(7),
    .w-e-menu:nth-child(8) {
      .w-e-droplist {
        width: 222px !important;
        .w-e-item {
          width: 30px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          text-align: center;
        }
      }
    }
    .w-e-menu {
      padding: 10px;
      z-index: 0 !important;
      i {
        color: #4a4a4a
      }
    }
    .w-e-active {
      i {
        color: #409EFF;
        // color: #0a419b;
      }
    }
    .w-e-droplist {
      border: 1px solid #dfdfdf;
      box-shadow: 0 0 5px #dfdfdf;
    }
    .w-e-block {
      .w-e-item {
        padding: none;
      }
    }
  }
  .w-e-text-container {
    width: calc(100%);
    height: calc(100vh - 55px - 38px) !important;
    border: none !important;
    font-size: 16px;
    color: #000;
    z-index: 0 !important;
    .w-e-text pre {
      width: calc(100vw - 220px - 240px - 25px - 14px) !important;
    }
    .w-e-text code {
      width: calc(100vw - 220px - 240px - 25px - 14px) !important;
      max-height: 340px;
      padding: 5px;
      border: 1px solid #dfdfdf;
      margin: 0;
      font-size: 14px;
      overflow: auto;
      border-radius: 0;
      background: #f8f8f8;
    }
    .w-e-text img {
      max-width: 500px;
    }
    .w-e-text blockquote {
      margin: 5px 0;
      border-left: 4px solid #dfdfdf;
    }
    ol li {
      list-style: decimal;
    }
    ul li {
      list-style: disc;
    }
    h1, h2, h3, h4, h5, h6, h7 {
      font-weight: bold;
    }
    h1 { font-size: 32px; }
    h2 { font-size: 24px }
    h3 { font-size: 18px }
    h4 { font-size: 16px }
    h5 { font-size: 14px }
    h6 { font-size: 12px }
    h7 { font-size: 10px }
    .w-e-text p,
    .w-e-text h1,
    .w-e-text h2,
    .w-e-text h3,
    .w-e-text h4,
    .w-e-text h5,
    .w-e-text table,
    .w-e-text pre {
      margin: 0;
      margin-top: 5px;
    }
    .w-e-text p {
      margin-top: 8px;
    }
    .w-e-panel-container {
      li {
        list-style: none;
      }
    }
  }
  .w-e-text-container-window {
    height: calc(100vh - 28px - 55px - 40px) !important;
  }
}
</style>