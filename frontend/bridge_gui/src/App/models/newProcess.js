import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Position from '../common/Position';
import ODOO from '../libs/odoo-bridge-rpc/src';
import boardStore from '../stores/newBoard'
import tableStore from '../stores/tableStore'
import {cardString,Two} from '../common/util'
import Clock from '../libs/Clock';
import Sound from '../components/Sound';
import Card,{ACT0,ACT1,ACT2,ACT3} from '../components/Card';
const arr = [['E','east_id'],['N','north_id'],['S','south_id'],['W','west_id']]
const arr1 = [['east_id','E'],['north_id','N'],['south_id','S'],['west_id','W']]
const dirMap = new Map(arr);
const dirMap1 = new Map(arr1);
//每一个玩家在桌子上的方位
const seatMap = {
    "E":{N:'E',E:'S',S:'W',W:'N'},
    "S":{E:'E',S:'S',W:'W',N:'N'},
    "W":{S:'E',W:'S',N:'W',E:'N'},
    "N":{W:'E',N:'S',E:'W',S:'N'}
}


const host = 'http://192.168.1.8:8069'
const db = 'TT'
const models = {
  'res.users': ['name', 'doing_table_ids'],
  'og.table': ['name', 'game_id', 'board_ids', 'channel_ids','west_id', 'north_id','east_id','south_id'],
  'og.board': [
    "name", "deal_id", "table_id", "round_id",
    "phase_id", "game_id", "match_id", "host_id",
    "guest_id", "number", "vulnerable", "dealer",
    "hands", "sequence", "declarer", "contract",
    "openlead", "result", "ns_point", "ew_point",
    "host_imp", "guest_imp", "auction", "tricks",
    "last_trick", "current_trick", "ns_win", "ew_win",
    "claimer", "claim_result", "player", "state",
  ],
  'bus.bus': ['name'],
  'mail.channel': ['name', 'channel_type'],
  'og.channel': ['name', 'table_id', 'type', 'mail_channel_id'],
  'mail.message': ['subject', 'body', 'subtype_id', 'message_type', 'author_id', 'date'],
}
var tables = null;
var table = null;
var boards = null;
var bd = null;
var seats=null;//{玩家真实方位：桌子上的方位}
const dir = ['W','N','E','S'];
const odoo = new ODOO({ host, db, models })

const fields = {
  name: null,
  doing_table_ids: {
    game_id: null,
    name: null,
    west_id: null, 
    north_id: null,
    east_id: null,
    south_id: null,
    board_ids: {
      name: null, deal_id: null, table_id: null, round_id: null,
      phase_id: null, game_id: null, match_id: null, host_id: null,
      guest_id: null, number: null, vulnerable: null, dealer: null,
      hands: null, sequence: null, declarer: null, contract: null,
      openlead: null, result: null, ns_point: null, ew_point: null,
      host_imp: null, guest_imp: null, auction: null, tricks: null,
      last_trick: null, current_trick: null, ns_win: null, ew_win: null,
      claimer: null, claim_result: null, player: null, state: null,
    }
  },
}

var tables = null;
var table = null;
var boards = null;
var bd = null;

 class Process{
    constructor(){
        this.dealMsg = new Map();
        this.dealMsg.set('bid',this.dealBid)
        this.dealMsg.set('play',this.dealPlay)
        this.dealMsg.set('claim',this.dealClaim)
        this.dealMsg.set('claim_ack',this.dealClaimAck)
    }
    sid=null;
    table_id=null;
    start=()=>{
        this.login()// 先登录,得到比赛列表,取table_id   
    }

    login = async (params) => {
        const p = {
          login: localStorage.getItem('userName'),
          password: localStorage.getItem('pwd'),
        }
        console.log(p)
        const newParams = params || p;
        const sid = await odoo.login(newParams);
        alert(sid)
        if (sid) {
         this.sid = sid;
          this.getGameList();
        }
        console.log(this.table_id)
       
        
      }
      getGameList = async () => {
        const user = await odoo.user(fields)
    
        tables = user.attr('doing_table_ids')
    
        // 一个牌手可能有多个比赛，每个比赛的doing_table，牌手选择比赛进入比赛
        const tableData = tables.look(fields.doing_table_ids)
         this.table_id =  tableData[0]['game_id']['id'];
         this.getIntoTable(this.table_id)  //进入桌子，开始游戏
      }
      getIntoTable = async (gameId) => {
        if (!this.sid) {
          alert('你还没有登陆！')
          return
        }
        // 当前牌桌
        table = tables.get_doing_table(gameId);
        const data = table.look({ west_id: null, north_id: null, east_id: null, south_id: null, })
        console.log('WNES：', data)
        for(let item in data ){
         
         if(data[item]['name']==localStorage.getItem('userName')) {
            var mySeat = dirMap1.get(item);
            tableStore.myseat = mySeat;
            alert(mySeat)
            seats= seatMap[mySeat]
            console.log(seats)
            tableStore.userLogin('S',{ ready: 0, name: data[dirMap.get('S')]['name'], face: '/imgs/face1.png', rank: '王者11', seat: 'S' });
            tableStore.userLogin('E',{ ready: 0, name: data[dirMap.get('E')]['name'], face: '/imgs/face1.png', rank: '王者', seat: 'E' });
            tableStore.userLogin('W',{ ready: 0, name: data[dirMap.get('W')]['name'], face: '/imgs/face1.png', rank: '王者', seat: 'W' });
            tableStore.userLogin('N',{ ready: 0, name: data[dirMap.get('N')]['name'], face: '/imgs/face1.png', rank: '王者', seat: 'N' });
         
         }
        }
        console.log(table)
        this.getBoard()// 拿到相关数据：玩家 牌 
        // 启用长连接
        const Bus = odoo.env('bus.bus')
        Bus.start_poll(this.before_poll, this.after_poll)

      }
      getBoard = async () => {

        if (!this.sid) {
          alert('你还没有登陆！')
          return
        }
    
        boards = table.attr('board_ids')
    
        // 当前正在进行的board
        bd = boards.get_doing_board()
        console.log(bd)
    
        // 读取到的牌桌数据
       
       this.recover()
       
      }
      before_poll = async () => {
        console.log('before 0')
        // before_poll0(odoo)
      }
      after_poll = async (result) => {
        // 这个返回值暂时也没有用
        console.log('after:', result)
        // console.log('after:', result[0]['message']['subject'])
    
        // 收到消息后到消息模型取数据
        const Chn = odoo.env('mail.channel')
        let msg = null
        // 取到的消息数据可能有多条，做了循环处理
        do {
          msg = await Chn.poll('og_game_board')
          if (msg) {
            const bd_msg = odoo.env('og.board').poll(msg.attr('id'))
            // TODO：这是收到消息后的数据，自行渲染页面，包含牌桌信息和牌手动作
            debugger
            console.log(bd_msg)
            const {method,info,args} = bd_msg;
            debugger
            this.dealMsg.get(method)(info,args)
          }
        } while (msg)
    
        // 非打牌消息，聊天消息，待处理
        msg = null
        do {
          msg = await Chn.poll('channel')
          // const bd_msg = odoo.env('og.board').poll(msg.attr('id'))
          // console.log(bd_msg)
        } while (msg)
      }

      bid = async (player, bid) => {
        const res = await bd.bid(player, bid)
        console.log(res)
      }
      // 打牌
      play = async (player, card) => {
        const res = await bd.play(player, card)
        console.log(res)
      }
      // 摊牌
      claim = async (player, cl) => {
        const res = await bd.claim(player, cl);
        console.log(res)
      }
      // 同意/不同意 摊牌 (number=1表示同意)
      claim_ack = async (player, ack) => {
        const res = await bd.claim_ack(player, ack)
      }

      recover =()=>{
        const bd2 = bd.look(fields.doing_table_ids.board_ids)
        console.log(bd2)  //得到当前游戏的全部内容
        const {state,dealer,auction,player} = bd2;
        var deals =cardString(tableStore.myseat,bd2.hands) ;
        var call=null;
        console.log(deals)
        tableStore.initCards(deals);
        tableStore.dealCards();
        Sound.play('deal');
        this.timing(seats[bd2.player],10,()=>{})
        if(state=='bidding'){
          var curCall = ''
          tableStore.bid();
          tableStore.state.calldata.first = dealer;
          console.log(typeof JSON.parse(bd2.auction))
          call = JSON.parse(bd2.auction); 
          console.log(Two(call))
          tableStore.state.calldata.call = Two(call);
          for(let i = 0 ;i<call.length;i++){
            if(call[call.length-1-i]!='Pass'){
              curCall = call[call.length-i-1];
              break;
            }
          }
          tableStore.curCall = curCall;
        }
        if(state=='playing'){

          
        }

      }
      dealBid = (info)=>{
        var call = null;
        var curCall = null;
        boardStore.pbn.auction.call = JSON.parse(info.auction);
        boardStore.gameState = info.state;
        call = JSON.parse(info.auction); 
          tableStore.state.calldata.call = Two(call);
          for(let i = 0 ;i<call.length;i++){
            if(call[call.length-1-i]!='Pass'){
              curCall = call[call.length-i-1];
              break;
            }
          }
          tableStore.curCall = curCall;
          if(info.state=='openlead'){
            tableStore.state.scene = 2;
          }
      }
      dealPlay = (info,args) => {
        var myseat = tableStore.myseat;
        var player=seats[args[0]]
        console.log(player)
        if(player!='S'){
          tableStore.dplay(player,args[1]);
        }
        debugger
        this.timing(seats[info.player],10,()=>{})
        if(info.player==myseat){
         // args[1][1] 表示花色
         console.log(args[1][0])
          let cards = tableStore.selectCards("S", args[1][0]);
          if(cards.length==0){
            cards = tableStore.selectCards("S", 'SHDC');
            tableStore.setCardsState(cards, { active: ACT1.LC, onclick: tableStore.play });
           
          }else{
            tableStore.setCardsState(cards, { active: ACT1.LC, onclick: tableStore.play });
            var reg = new RegExp(args[1][0],"g");
            var a = 'SHDC'.replace(reg,"");
            cards = tableStore.selectCards("S", a);
            tableStore.setCardsState(cards, {active: ACT1.D, onclick: tableStore.play});
          }
          cards = tableStore.selectCards("NEW", 'SHDC');
          tableStore.setCardsState(cards, {active: ACT1.L, onclick: tableStore.play});
        }else{
          let cards = tableStore.selectCards("NEWS", 'SHDC');
          tableStore.setCardsState(cards, {
              active: ACT1.L, onclick: tableStore.play,
          });
        }
        if(boardStore.gameState=='done'){
           alert('done')
        }
      }
      dealClaim = (info,args) =>{
        boardStore.claim.owner = args[0];
        boardStore.claim.number = args[1];
        boardStore.gameState = info.state;
      }
      dealClaimAck = (info,args) =>{
        
        boardStore.claim.state = args;
        boardStore.gameState = info.state;
      }
      timing = function (seat, time, callback) {
        const unseat = new Position(seat).lshift(1).sn;
        ReactDOM.unmountComponentAtNode(document.querySelector('.'+unseat+'clock'));
        ReactDOM.un
        ReactDOM.render(
            <Clock time={time} callback={callback} />,
            document.querySelector('.'+seat+'clock')
        )
    }
}
export default new Process();