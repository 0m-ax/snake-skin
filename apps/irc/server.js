let hexg = new context.HexGrid();
function sleep(time){
    return new Promise((resolve)=>{
        setTimeout(()=>resolve(),time);
    })
}
async function sweep(color){
    for (let row = 0; row <= 17; row++) {
        for (let col = 0; col <= 11; col++) {
            let hex = hexg.get(row,col);
            if(hex){
                hexg.get(row, col).color = color;
            }
        }
        await sleep(100);
    }
}
async function fill(color){
    for (let row = 0; row <= 17; row++) {
        for (let col = 0; col <= 11; col++) {
            let hex = hexg.get(row,col);
            if(hex){
                hexg.get(row, col).color = color;
            }
        }
    }
}
async function irc(){
    for (let index = 16; index > -16; index--) {
        fill([0,0,0])
        for (let col = 3; col <= 7; col++) {
            set(index+4, col,[255,255,255]);
        }
        set(index+4, 9,[255,255,255]);
        for (let col = 3; col <= 9; col++) {
            set(index+6, col,[255,255,255]);
        }
        set(index+7, 8,[255,255,255]);
        set(index+8, 8,[255,255,255]);
        set(index+9, 8,[255,255,255]);
        for (let col = 3; col <= 9; col++) {
            set(index+11, col,[255,255,255]);
        }
        set(index+12, 3,[255,255,255]);
        set(index+13, 3,[255,255,255]);
        set(index+14, 3,[255,255,255]);
        set(index+12, 9,[255,255,255]);
        set(index+13, 9,[255,255,255]);
        set(index+14, 9,[255,255,255]);
        await sleep(120);
    }
}
function set(row,col,color){
    let hex = hexg.get(row, col)
    if(hex){
        hex.color = color;
    }
}

async function run(){
    for (let index = 0; index < 2; index++) {
        await sweep([255,0,0])
        await sweep([255,255,0])
        await sweep([255,255,255])
        await irc();
        fill([255,255,255])
        await sweep([0,255,255])
        await sweep([0,0,255])
        await sweep([0,0,0])        
    }
    context.terminate();
}
run();
context.getState = function () {
    return hexg.export();
}
