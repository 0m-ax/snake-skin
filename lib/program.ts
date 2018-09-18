import { TypedEvent } from "./typedEvent";
import { GRIDMAP, HexGrid, Hex } from "./hexGrid";
interface IContext{
    onmessage:Function;
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
export class Program {
    readonly id=guid();
    onMessageEvent= new TypedEvent<any>();
    onTerminateEvent= new TypedEvent<void>();
    code:string;
    clientCode:string;
    context:any;
    constructor(code:string,clientCode:string){
        this.code = code;
        this.clientCode = clientCode;
        let self = this;
        this.context =  {
            onmessage:function(message){},
            getState:function(){return []},
            setActive:function(active){},
            postMessage:function(message){
                self.onMessageEvent.emit(message)
            },
            terminate:function(){
                self.onTerminateEvent.emit(null);
            },
            GRIDMAP,
            HexGrid,
            Hex 
        }
        let funct = new Function('context',this.code);
        funct(this.context)
    }
    postMessage(message:any){
        return this.context.onmessage(message)
    }
    getState():Array<Array<number>>{
        return this.context.getState();
    }
    setActive(active:boolean):void{
        return this.context.setActive(active);
    }
    dispose(){
        this.onTerminateEvent.emit(null);
    }
}
// setInterval(()=>{},0)
    // doRPC(methord:String,args:Array<any>=[],callback):any{
    //     let RPCID = Math.random();
    //     this.worker.postMessage({
    //         type:'RPCReq',
    //         data:{
    //             methord,
    //             RPCID,
    //             args
    //         }
    //     })
    //     let self = this;
    //     async function getResp(message){
    //         if(message.RPCID == RPCID){
    //             self.onRPCRespEvent.off(getResp)
    //             callback(message.thrown,message.data)
    //         }
    //     }
    //     this.onRPCRespEvent.on(getResp)
    // }