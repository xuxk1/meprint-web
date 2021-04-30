<template>
<div class="mind-editor"></div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapGetters
} from 'vuex'
import { getToken } from '@/utils/auth'
var lockReconnect = false
var ws = null
const username = localStorage.getItem('username')
export default {
  data() {
    return {
      caseId: null,
      result: null,
      wsUrl: '',
    }
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
  mounted() {
    this.getWebsocketData()
    this.executeCallback()
  },
  computed: {
    ...mapGetters([
      'minder',
    ])
  },
  methods: {
    ...mapActions([
      'executeCallback'
    ]),
    ...mapMutations([
      'setMinder',
      'setEditor'
    ]),
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
    naotu(data){
      var Editor = require('../../../script/editor');
      var el = this.$el;
      var editor = new Editor(el);
      this.setEditor(editor);
      if (data) {
        editor.minder.importJson(data);
      }
      editor.minder.on('contentchange', function () {
        data = JSON.stringify(editor.minder.exportJson());
      });
      window.minder = window.km = editor.minder
      this.setMinder(editor.minder)
    }
  },
}
</script>

<style lang="scss">
  @import "../../../assets/styles/editor.scss";
</style>
