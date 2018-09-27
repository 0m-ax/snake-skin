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
setInterval(() => {
    let hex = hexg.get(random(0, 17), random(0, 11));
    if (hex) {
        hex.color = color;
    }
}, basewait)
setInterval(() => {
    color = [random(0, 255), random(0, 255), random(0, 255)];
}, basewait * 100);
context.getState = function () {
    return hexg.export()
}