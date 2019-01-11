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
  // 叫牌
  call:(calling) => {
    console.log('output:',calling);
    if(calling==='PASS'){
      calling = 'Pass'
    }
    if(calling==='X'){
      calling = 'x'
    }
    if(calling==='XX'){
      calling = 'xx'
    }
    Process.bid(tableStore.myseat,calling)
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

let handler = {
  get:function(obj,prop){
    if(window.__debug)return ()=>null;
    return obj[prop];
  }
}

let Output = new Proxy(_Output,handler);


export default Output;