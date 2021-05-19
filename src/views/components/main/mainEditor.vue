<template lang="html">
<div class="mind-editor"></div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { Xmindupdate } from '@/api/system/case'

var resultData = null
const username = localStorage.getItem('username')
const wsUri = process.env.VUE_APP_BASE_SITE
export default {
  data() {
    return {
      caseId: null,
      result: null,
      wsUrl: '',
      recordId: '',
      title: '',
      ws: '',//建立的连接
      lockReconnect: false,//是否真正建立连接
      timeout: 60*1000,//58秒一次心跳
      timeoutObj: null,//心跳心跳倒计时
      serverTimeoutObj: null,//心跳倒计时
      timeoutnum: null,//断开 重连倒计时
    }
  },
  created() {
    this.caseId = this.$route.query.caseId
    this.recordId = null
    this.title = '更新内容，实际不会保存title'
    this.result = {
      "template": "right",
      "root": {
        "data": {
          "created": "1618214119030",
          "id": "30b83miju81tjfk6r7mufq0keu",
          "text": "米绘企业版",
          "priority": 0
        },
        "children": [{
          "data": {
            "created": "1618213177550",
            "id": "2bc76g0rh289e8oj5o658igi8g",
            "text": "登录页",
            "priority": 0
          },
        }]
      },
      "theme": "fresh-blue",
      "version": "1.4.43",
      "base": "16"
    }
    this.wsUrl = wsUri + '/api/case/' + this.caseId + '/undefined/0/' + username + '/' + getToken()
    this.ws = (window.ws = new WebSocket(this.wsUrl))
    this.initWebsocket(this.ws)
    window.addEventListener('beforeunload', e => this.onclose(e))
    this.$router.afterEach(() => this.ws.close())
  },
  destroyed () {
    //页面销毁时关闭长连接
    window.removeEventListener('beforeunload', e => this.onclose(e))
  },
  mounted () {
    this.executeCallback()
  },
  computed: {
    ...mapGetters(['minder']),
  },
  methods: {
    ...mapActions(['executeCallback']),
    ...mapMutations(['setMinder', 'setEditor']),
    initWebsocket(ws){
      ws.onopen = this.onopen
      ws.onmessage = this.onmessage
      ws.onerror = this.onerror
      ws.onclose = this.onclose
    },
    reconnect() {//重新连接
      console.log('重新连接')
      let that = this;
      if(that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebsocket(this.ws)
        that.lockReconnect = false
      },5000)
    },
    reset(){//重置心跳
      console.log("重置心跳")
      let that = this
      //清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      //重启心跳
      that.start()
    },
    start(){ //开启心跳
      console.log('开启心跳')
      let self = this
      let messageType = 0
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function(){
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.ws.readyState == 1) {//如果连接正常
          self.onsend(messageType + 'ping ping ping') //这里可以自己跟后端约定
        }else{//否则重连
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function() {
          console.log('超时关闭')
          //超时关闭
          self.ws.close()
        }, self.timeout)
      }, self.timeout)
    },
    onopen() {
      console.log("open")
      //开启心跳
      this.start()
    },
    onmessage(e) {
      let self = this
      let res = ''
      let act = ''
      console.log('接收信息', e)
      console.log('接收信息', e.data)
      res = e.data
      if (res){
        if (res && res.hasOwnProperty('当前用户数：') !=-1 && res.hasOwnProperty('pong pong pong') !=-1) {
          this.$notify.success(res)
          try{
            act = JSON.parse(res)
            if (act.hasOwnProperty('template')) {
              this.naotu(self.ws,act)
            }
          }catch (e) {
            if(e instanceof SyntaxError){
              console.log('handle this expected error')
            }else if(e instanceof TypeError){
              console.log('handle unexpected error')
            }
          }finally {
            console.log('finally_statements')
          }
        }
      }else {
        this.naotu()
      }
      //收到服务器信息，心跳重置
      this.reset()
    },
    onclose(e) {
      console.log("连接关闭")
      console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
      e = e || window.event;
      if (e) {
        e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存"
        this.ws.close()
      }
      return "您是否确认离开此页面-您输入的数据可能不会被保存";
      //重连
      // this.reconnect()
    },
    onerror(e) {
      console.log("出现错误:" + e.error)
      //重连
      this.reconnect()
    },
    onsend(msg) {//向服务器发送信息
      //数据发送
      this.ws.send(msg)
    },
    // getWebsocketData(){
    //   let res = ''
    //   let act = ''
    //   let iscore = 0
    //   let readOnly = false;
    //   let progressShow = false;
    //   if (iscore === '0' || iscore === '1') {
    //     readOnly = false;
    //     progressShow = false;
    //   } else {
    //     readOnly = true;
    //     progressShow = true;
    //   }
    //   let connection = new WebSocket(this.wsUrl)
    //   connection.onopen = () => {
    //     console.log('webSocket已连接')
    //   }
    //   connection.onmessage = (event) => {
    //     console.log('webSocket连接正常')
    //     res = event.data
    //     if (res){
    //       if (res && res.hasOwnProperty('当前用户数') !=-1) {
    //         try{
    //           act = JSON.parse(res)
    //           if (act.hasOwnProperty('template')) {
    //             console.log('template======' + res)
    //             this.naotu(connection,act)
    //           }
    //         }catch (e) {
    //           if(e instanceof SyntaxError){
    //             console.log("handle this expected error")
    //           }else if(e instanceof TypeError){
    //             console.log("handle unexpected error")
    //           }
    //         }finally {
    //           console.log("finally_statements")
    //         }
    //       }
    //     }else {
    //       this.naotu()
    //     }
    //   }
    //   connection.onerror = () => {
    //     console.log('webSocket连接出错')
    //   }
    //   connection.onclose = () => {
    //     console.log('webSocket连接关闭')
    //   }
    // },
    naotu(ws, data) {
      const Editor = require('../../../script/editor')
      const el = this.$el
      const editor = (window.XmindEditor = new Editor(el))
      var editXmindData = ''
      let contentchange = ''
      const messageType = 1
      this.setEditor(editor)
      if (data) {
        editor.minder.importJson(data)
      }
      editor.minder.on('contentchange', () => {
        editXmindData = JSON.stringify(editor.minder.exportJson())
        contentchange = JSON.parse(editXmindData)
        contentchange.base = 0
        resultData = contentchange
        console.log('editXmindData========' + editXmindData)
        const messagejson = {
          'case': resultData,
          'patch': [
            [{
              'op': 'replace',
              'path': contentchange.path,
              'value': contentchange.root.data.text
            }]
          ]
        }
        const message = JSON.stringify(messagejson).replace(/\\/g, '')
        console.log('message====' + message)
        ws.send(messageType + message)
      })
      window.minder = window.km = editor.minder
      this.setMinder(editor.minder)
    },
    savesave() {
      const params = {
        id: this.caseId.toString(),
        title: this.title,
        modifier: username,
        caseContent: resultData
      }
      return new Promise((resolve, reject) => {
        Xmindupdate(params).then(response => {
          if (response.code === 200) {
            this.$notify.success('更新成功')
          }
        }).catch(error => {
          reject(error)
          this.$notify.error('更新失败')
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/styles/editor.scss";
</style>
