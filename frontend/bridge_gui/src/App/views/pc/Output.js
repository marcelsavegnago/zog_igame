/**
 * Output 是对外输出的统一出口。
 * 可以从界面 view 组件直接调用。
 * 或者其他地方直接调用。
 */
import tableStore from '../../stores/tableStore'
import Process from '../../models/newProcess'
window.Process = Process;
const _Output = {
  ckLogin:()=>{
    console.log("用户已经登录。")
  },
  // 叫牌 msg 约定叫提示信息
  call:(calling,msg) => {
    console.log('output:',calling,msg);
    if(calling==='PASS'){
      calling = 'Pass'
    }
    if(calling==='X'){
      calling = 'x'
    }
    if(calling==='XX'){
      calling = 'xx'
    }
    if(calling.includes("ALERT")){
      //debugger
      console.log(calling)
      calling = calling.slice(0,3)
      console.log(calling);
      console.log()
      Process.bid(tableStore.myseat,calling,'True',msg)
    }else{
      Process.bid(tableStore.myseat,calling,'False',msg)
    }
    
  },
  play:(data) => {
    console.log('oplay。。。。：',data.card);
    Process.play(tableStore.myseat,data.card)
  },
  claim:(seat,num)=>{
    console.log(seat,"摊牌",num);
    Process.claim(tableStore.myseat,num);
  },
  claimConfirm:(value)=>{
    const msg = value ? "同意": "拒绝";
    console.log(msg);
    Process.claim_ack(tableStore.myseat,value);
  },
  reConnect:()=>{
    Process.getBoard()
  },
  nextGame : ()=>{
    
    Process.getBoard()
  } 
}

/**
 * 代理所有 对 _Output 的请求。
 * 对 _Output 的 所有属性和方法请求。都会被 get 拦截。
 * 为什么return ()=>null 因为属性和方法都要获得值。
 * 如果反馈 null 则 代码中调用方法 则会执行null() 报错。
 */
let handler = {
  get:function(obj,prop){
    if(window.__debug)return ()=>null;
    return obj[prop];
  }
}

let Output = new Proxy(_Output,handler);
export default Output;