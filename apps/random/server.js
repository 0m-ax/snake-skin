let basewait = 1000;
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} let hexg = new context.HexGrid();
for (let i = 0; i < 15; i++) {
    let color = [random(0, 255), random(0, 255), random(0, 255)];
    for (let i2 = 0; i2 < 100; i2++) {
        let hex = hexg.get(random(0, 17), random(0, 11));
        if (hex) {
            hex.color = color;
        }
    }
}
let color = [random(0, 255), random(0, 255), random(0, 255)];
function changeColor(){
    color = [random(0, 255), random(0, 255), random(0, 255)];;
}
function changeHex(){
    let hex = hexg.get(random(0, 17), random(0, 11));
    if (hex) {
        hex.color = color;
    }
}
let changeHexTime = 1000;
let changeColorTime = 100*1000;
let changeHexInterval = setInterval(changeHex, changeHexTime)
let changeColorInterval = setInterval(changeColor, changeColorTime);
context.onmessage = function (message) {
    if (message.type == "update") {
        changeHexTime = message.data.changeHexTime;
        changeColorTime = message.data.changeColorTime;
        clearInterval(changeHexInterval);
        clearInterval(changeColorInterval);
        changeHexInterval = setInterval(changeHex, changeHexTime)
        changeColorInterval = setInterval(changeColor, changeColorTime);
    } 
    if(message.type == "sync" || message.type == "update"){
        context.postMessage({
            type:"update",
            data:{
                changeColorTime,
                changeHexTime
            }
        })
    }
}
context.getState = function () {
    return hexg.export()
}