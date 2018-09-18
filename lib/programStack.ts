import { TypedEvent } from "./typedEvent";
import {Program} from "./program";
interface IProgramEvent {
    program:Program
}
interface IProgramMessage extends IProgramEvent{
    data:any;
}

interface IEventMapI{
    onTerminate:any,
    onMessage:any
}
export class ProgramStack{
    programStack:Array<Program>=[];
    onTerminateEvent = new TypedEvent<IProgramEvent>();
    onStartEvent = new TypedEvent<IProgramEvent>();
    onMessageEvent = new TypedEvent<IProgramMessage>(); 
    eventMap = new Map<Program,IEventMapI>()
    constructor(program){
        this.pushProgram(program);
    }
    onTerminate(program:Program){
        let index = this.programStack.indexOf(program)
        if(index == this.programStack.length-1){
            this.programStack.splice(index, 1);
            if(this.programStack.length == 0){
                this.pushProgram(new Program('','<h1>No app running</h1>'))
            }else{
                this.programStack[this.programStack.length-1].setActive(true)
            }
        }else if(index !== -1){
            this.programStack.splice(index, 1);
        }
        this.emitTerminate(program)
    }
    emitTerminate(program:Program){
        this.onTerminateEvent.emit({
            program
        })
        let item = this.eventMap.get(program)
        program.onTerminateEvent.off(item.onTerminate)
        program.onMessageEvent.off(item.onMessage)
    }
    emitStart(program:Program){
        program.setActive(true)
        let item:IEventMapI = {
            onTerminate:this.onTerminate.bind(this,program),
            onMessage:this.onMessage.bind(this,program)
        }
        program.onTerminateEvent.on(item.onTerminate)
        program.onMessageEvent.on(item.onMessage)
        this.eventMap.set(program,item)
        this.onStartEvent.emit({
            program
        })
    }
    onMessage(program,data){
        this.onMessageEvent.emit({
            program,
            data
        })
    }
    swapProgram(index,program){
        if(index < this.programStack.length){
            this.programStack[index].dispose();
            this.programStack[index] = program;
            this.emitStart(program)
            if(index == this.programStack.length-1){
                program.setActive(true)
            }else{
                program.setActive(false)
            }
        }else{
            throw new Error('not on stack')
        }
    }
    popProgram(){
        let program = this.programStack.pop()
        program.dispose();
        this.programStack[this.programStack.length-1].setActive(true)
    }
    pushProgram(program){
        if(this.programStack.length > 0){
            this.currentProgram.setActive(false);
        }
        this.programStack.push(program)
        this.emitStart(program)
    }
    get currentProgram():Program{
        return this.programStack[this.programStack.length-1];
    }
    postMessage(message:any){
        this.currentProgram.postMessage(message);
    }
    async getState():Promise<Array<Array<number>>>{
        return this.currentProgram.getState();
    }
}