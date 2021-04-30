<template>
  <div>
    <div class="card-panel">
      <headers></headers>
    </div>
    <div style="width: auto; height: 1000px" id="minder-container"></div>
  </div>
</template>
<script>
import cases from '@/api/system/case'
import Headers from '../../components/Header'
import { mapGetters } from 'vuex'
import kity from 'kity'
import kityminder from 'kityminder-core'
import { getToken } from '@/utils/auth'
const username = localStorage.getItem('username')
var lockReconnect = false
var ws = null
var heartCheck = {
  timeout: 1000,        //1分钟发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function(){
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function(){
    var self = this;
    this.timeoutObj = setTimeout(function(){
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send("ping");
      console.log("ping!")
      self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
        ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout)
  }
}
export default {
  name: 'Xmind',
  components: {
    Headers
  },
  data() {
    return {
      caseId: null,
      result: null,
      wsUrl: '',
    };
  },
  created() {
    this.caseId = this.$route.query.caseId
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
    this.lockReconnect = false
    this.wsUrl = 'ws://localhost:9013/api/case/' + this.caseId + '/undefined/0/' + username + '/' + getToken()
    window.onbeforeunload = function() {
      ws.close();
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ])
  },
  mounted() {
    this.getWebsocketData()
  },
  methods: {
    createWebSocket(){
      try{
        if('WebSocket' in window){
          ws = new WebSocket(this.wsUrl);
        }
        this.getWebsocketData();
      }catch(e){
        this.reconnect(this.wsUrl);
        console.log(e);
      }
    },
    reconnect() {
      if(lockReconnect) return;
      lockReconnect = true;
      setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        this.createWebSocket();
        lockReconnect = false;
      }, 2000);
    },
    getWebsocketData(){
      let res = ''
      let act = ''
      let iscore = 0
      let readOnly = false;
      let progressShow = false;
      if (iscore === '0' || iscore === '1') {
        readOnly = false;
        progressShow = false;
      } else {
        readOnly = true;
        progressShow = true;
      }
      let connection = new WebSocket(this.wsUrl)
      connection.onopen = () => {
        console.log('webSocket已连接')
      }
      connection.onmessage = (event) => {
        console.log('webSocket连接正常')
        res = event.data
        if (res && res.hasOwnProperty('当前用户数') !=-1){
          try{
            act = JSON.parse(res)
            if (act.hasOwnProperty('template')) {
              console.log('template======' + res)
              this.naotu(act)
            }
          }catch (e) {
            if(e instanceof SyntaxError){
              console.log("handle this expected error");
            }else if(e instanceof TypeError){
              console.log("handle unexpected error");
            }
          }finally {
            console.log("finally_statements");
          }
        }
      }
      connection.onerror = () => {
        console.log('webSocket连接出错')
      }
      connection.onclose = () => {
        console.log('webSocket连接关闭')
      }
    },
    naotu(data) {
      console.log('data======' + data)
      this.km = new window.kityminder.Minder({
        renderTo: "#minder-container"
      })
      this.km.importJson(data)
    }
  }
}
</script>
