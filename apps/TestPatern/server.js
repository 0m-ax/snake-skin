let hexg = new context.HexGrid();
let offset = 0;
function update() {
    for (let index = offset; index < hexg.items.length + offset; index++) {
        if (hexg.items[index - offset]) {
            if (index % 3 == 0) {
                hexg.items[index - offset].color = [255, 0, 0];
            } else if (index % 3 == 1) {
                hexg.items[index - offset].color = [0, 255, 0];
            } else if (index % 3 == 2) {
                hexg.items[index - offset].color = [0, 0, 255];
            }
        }
    }
}
update();
hexg.get(0, 11).color = [255, 255, 255];
context.onmessage = function () {
    offset++; update();
}
context.getState = function () {
    return hexg.export()
}
setTimeout(() => context.terminate(), 30000);