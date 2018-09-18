//import { HexGrid, Hex, GRIDMAP } from "./hexGrid";


class ProgramRunner{
    postMessage;
    context;
    constructor(postMessage){
        let self = this;
        this.postMessage = postMessage;
        this.context = {
            postMessage:function(data){
                self.postMessage({
                    type:'message',
                    data:data
                })
            },
            setActive:function(){return 'null'},
            onPostMessage:function(){},
            getState:function(){return ['test']}
        }
    }
    onMessage(message){
        console.log('fuck you')
        if(message.data.type == 'message'){
            this.onPostMessage(message.data)
        }else if(message.data.type == 'RPCReq'){
            this.onRPCReq(message.data.data)
        }
    }
    setCode(code){
        try {
            let f = new Function('context',code);
            f(this.context)
        } catch (error) {
            this.postMessage({
                type:'terminate',
                error:error.message
            })
        }
    }
    async onRPCReq(message){
        try {
            let resp = this[message.methord](...message.args)
            this.postMessage({
                type:'RPCResp',
                data:{
                    RPCID:message.RPCID,
                    thrown:false,
                    data:resp
                }
            })
        } catch (error) {
            this.postMessage({
                type:'RPCResp',
                data:{
                    RPCID:message.RPCID,
                    thrown:true,
                    data:error
                }
            })  
        }
    }
    onPostMessage(message){
        this.context.onPostMessage(message)
    }
    getState(){
        return this.context.getState()
    }
    setActive(state){
        return this.context.setActive(state)
    }
}
let pr = new ProgramRunner(postMessage);
onmessage = pr.onMessage.bind(pr)