import Board from '../../OdooRpc/Board'
import OdooModel from '../../OdooRpc/OdooRpc'
import Channel from '../../OdooRpc/Channel'
import GameTeamPlayer from '../../OdooRpc/GameTeamPlayer'

class Models{
    static get_matches(success,error){  //查询桌号
        const gameTeamPlayer= new GameTeamPlayer(success,error);
        console.log(gameTeamPlayer); 
        gameTeamPlayer.get_matches();   //params: []
    }

    static join_channel(sucChannel,failChannel,table_id){ //加入频道
        const JoinChannel = new Channel(sucChannel,failChannel);
        console.log(JoinChannel)
        JoinChannel.join_channel(table_id);   //params: [table_id]
    }
    static init_board=(success,error,board_id,channel_id)=>{ //初始化牌桌
        const  board= new Board(success,error); 
        board.init_board(board_id,channel_id)   //params: [board_id,channel_id]
    } 

    static polling=(success,error,pollingId)=>{  //消息连接
        const Poll = new OdooModel(success,error);
        Poll.poll(pollingId);   //params: [pollingId]
    }

    static bid=(success,error,board_id,pos,card,channel_id)=>{  //发送叫牌消息
        const board= new Board(success,error); 
        board.bid(board_id,pos,card,channel_id);    //params: [board_id,pos,card,channel_id]
    }

    static call_result=(success,error,board_id,channel_id)=>{   //查询叫牌结果
        const board= new Board(success,error);  
        board.call_result(board_id,channel_id);      //params: [board_id,channel_id]
    }

    static play=(success,error,board_id,mydir,card,channel_id)=>{   //发送打牌消息
        const board= new Board(success,error);  
        // ((this.state.currentDirect!==this.state.dummy&&this.state.currentDirect===this.state.playerInfo.myDirect)||
        // (this.state.currentDirect===this.state.dummy&&this.state.topInfo2.declarer===this.state.playerInfo.myDirect)) ?
         board.play(board_id,mydir,card,channel_id);         //params: [board_id,mydir,card,channel_id]
        //   : null;       //发送打牌消息
    }
    static sendplay =(success,error,boardid,cardid,channel_id)=>{
        const board= new Board(success,error);  
        board.sendplay(boardid,cardid,channel_id)
    }

    static board_points=(success,error,board_id)=>{   //查询单副牌的成绩
        const  board= new Board(success,error); 
        board.board_points(board_id);      //params: [board_id]
    }

    static table_points=(success,error,table_id)=>{     //查询一桌所有牌的成绩
        const  board= new Board(success,error); 
        board.table_points(1);   //params: [table_id]
    }
    static claim1=(success,error,board_id,pos,num,channel_id)=>{  //庄家发送claim请求
        const  board= new Board(success,error); 
        board.claim1(board_id,pos,num,channel_id);   //params: [board_id,pos,num,channel_id]
    }

    static claim=(success,error,board_id,pos,num,channel_id)=>{  //claim
        const  board= new Board(success,error); 
        board.claim(board_id,pos,num,channel_id);   //params: [board_id,pos,num,channel_id]
    }

    static send_message=(success,error,channel_id,msg)=>{  //直接向频道发送消息
        const  board= new Board(success,error); 
        board.send_message(channel_id,msg);   //params: [channel_id,msg]
    }
    
    

    // 
    // /**
    //  * 获得明手的牌，根据规则进行判断。
    //  * todo:正确的牌
    //  */
    // static openDummy(){
    //     return {seat:'north',cards:'K.KJT732.964.A52'}
    // }
    // /**
    //  * 获得上一墩牌，这里应该进行必要的判断。不能随便获得。
    //  * [东，南，西，北]
    //  */
    // static lastTrick(){
    //     return [{index:1,card:'7S'},
    //             {index:14,card:'9S'},
    //             {index:28,card:'2S'},
    //             {index:41,card:'KS'}]
    // }
    // static getResult(){
    //     return "N3D +2 NS 600";
    // }
}

export default Models