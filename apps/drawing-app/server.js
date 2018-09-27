let hexg = new context.HexGrid();
context.onmessage = function (message) {
    if (message.type = "update") {
        hexg.import(message.data);
    }
}
context.getState = function () {
    return hexg.export()
}
