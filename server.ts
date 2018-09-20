import {ProgramStack} from './lib/programStack'
import {Program} from './lib/program'
const express = require('express')
import {Server as httpServer} from 'http';
const socketIO = require('socket.io')
var SerialPort = require('serialport');
import {join} from 'path'
let app = express();
app.use(express.static(join(__dirname,'..','public')))
app.get('/api/push/:id',(req,res)=>{
    if(config[req.params.id]){
        stack.pushProgram(new Program(config[req.params.id].code,config[req.params.id].clientCode))
    }
    res.send('ok')
})
app.get('/api/pop',(req,res)=>{
    if(config[res.params.id]){
        stack.popProgram()
    }
    res.send('ok')
})
let http = new httpServer(app);
let io = socketIO(http);
let config = require('../apps.json')
// let program2 = `
//     let hexg = new context.HexGrid();
//     for (let index = 0; index < hexg.items.length; index++) {
//         if(hexg.items[index]){
//             if(index%3 ==0){
//                 hexg.items[index].color = [255,0,0];
//             }else if(index%3 ==1){
//                 hexg.items[index].color = [0,255,0];
//             }else if(index%3 ==2){
//                 hexg.items[index].color = [0,0,255];
//             }
//         }
//     }
//     hexg.get(0,11).color=[255,255,255]
//     context.getState = function (){return hexg.export()}
//     setTimeout(()=>context.terminate(),30000);
// `;
export let stack = new ProgramStack(new Program(config['random'].code,config['random'].clientCode));
// stack.pushProgram(new Program(program2,'<h1>Test patern</h1>'))
// stack.pushProgram(new Program(facta,'<h1>Facta</h1>'))

stack.onMessageEvent.on(({program,data})=>{
    io.emit('message',{
        programID:program.id,
        data
    })
})
stack.onTerminateEvent.on(()=>{
    io.emit('state',stack.programStack.map(({clientCode,id})=>{
        return {
            clientCode,
            id
        }
    }))
})
stack.onStartEvent.on(()=>{
        io.emit('state',stack.programStack.map(({clientCode,id})=>{
        return {
            clientCode,
            id
        }
    }))
})
io.on('connection',(socket)=>{
    socket.emit('state',stack.programStack.map(({clientCode,id})=>{
        return {
            clientCode,
            id
        }
    }))
    socket.emit('apps',Object.keys(config).map((id)=>({
        id:id,
        title:config[id].title
    })))
    socket.on('message',({programID,data})=>{
        let program = stack.programStack.find(({id})=>id == programID);
        if(program){
            program.postMessage(data);
        }
    })
    socket.on('newProgram',({code,clientCode})=>{
        stack.pushProgram(new Program(code,clientCode))
    })
    socket.on('runApp',({id})=>{
        stack.swapProgram(0,new Program(config[id].code,config[id].clientCode))
    })

})
http.listen(3000);
function pad_array(arr,len,fill) {
    return arr.concat(Array(len).fill(fill)).slice(0,len);
}
// setInterval(async ()=>{
//     let leds = pad_array(await stack.getState(),180,[0,0,0])
//     io.emit('update',leds)
// },1000);
var port = new SerialPort('/dev/ttyUSB0',{
    baudRate:57600
});
console.time("update")
let i = 0;
port.on('data',async (d)=>{
    console.timeEnd("update")
    console.time("update")
    console.time("getState")
    try {
        let leds = await stack.getState()
        let lr = pad_array(leds,180,[0,0,0])
        for(let led of pad_array(leds,180,[0,0,0])){
            port.write(Buffer.from(pad_array(led,3,0)));
        }
    } catch (error) {
        console.log(error);
    }
    console.timeEnd("getState")
})