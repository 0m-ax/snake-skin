let hexg = new context.HexGrid();
for (let index = 3; index <= 12; index++) {
    hexg.get(index, 6).color = [255, 0, 0];
}
for (let index = 6; index <= 9; index++) {
    hexg.get(3, index).color = [255, 0, 0];
}
for (let index = 4; index <= 9; index++) {
    hexg.get(6, index).color = [255, 0, 0];
}
context.getState = function () {
    return hexg.export()
}
setTimeout(() => context.terminate(), 15000);