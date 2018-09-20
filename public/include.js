System.register("lib/typedEvent", [], function (exports_1, context_1) {
    "use strict";
    var TypedEvent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /** passes through events as they happen. You will not get events from before you start listening */
            TypedEvent = /** @class */ (function () {
                function TypedEvent() {
                    var _this = this;
                    this.listeners = [];
                    this.listenersOncer = [];
                    this.on = function (listener) {
                        _this.listeners.push(listener);
                        return {
                            dispose: function () { return _this.off(listener); }
                        };
                    };
                    this.once = function (listener) {
                        _this.listenersOncer.push(listener);
                    };
                    this.off = function (listener) {
                        var callbackIndex = _this.listeners.indexOf(listener);
                        if (callbackIndex > -1)
                            _this.listeners.splice(callbackIndex, 1);
                    };
                    this.emit = function (event) {
                        /** Update any general listeners */
                        _this.listeners.forEach(function (listener) { return listener(event); });
                        /** Clear the `once` queue */
                        _this.listenersOncer.forEach(function (listener) { return listener(event); });
                        _this.listenersOncer = [];
                    };
                    this.pipe = function (te) {
                        return _this.on(function (e) { return te.emit(e); });
                    };
                }
                return TypedEvent;
            }());
            exports_1("TypedEvent", TypedEvent);
        }
    };
});
System.register("lib/hexGrid", ["lib/typedEvent"], function (exports_2, context_2) {
    "use strict";
    var typedEvent_1, GRIDMAP, Hex, HexGrid, HexGridElment;
    var __moduleName = context_2 && context_2.id;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function colorToHex(input) {
        return componentToHex(input[0]) + componentToHex(input[1]) + componentToHex(input[2]);
    }
    return {
        setters: [
            function (typedEvent_1_1) {
                typedEvent_1 = typedEvent_1_1;
            }
        ],
        execute: function () {
            exports_2("GRIDMAP", GRIDMAP = [
                [[], [], [], [], [], [], [], [174], [175], [176], [177, 178], [179, 180]],
                [[], [], [], [173], [172], [171], [170], [169], [168], [166, 167], [164, 165], []],
                [[], [], [154], [155], [156], [157], [158], [159], [160], [161], [162], [163]],
                [[], [153], [152], [151], [150], [149], [148], [147], [146], [145], [144], []],
                [[], [134], [135], [136], [137], [138], [139], [140], [141], [142], [143], []],
                [[133], [132], [131], [130], [129], [128], [127], [126], [125], [124], [123], []],
                [[111], [112, 113], [114], [115], [116], [117], [118], [119], [120], [121], [122], []],
                [[110, 109], [108], [107], [106], [105], [104], [103], [102], [101], [100], [99], []],
                [[88], [89], [90], [91], [92], [93], [94], [95], [96], [97], [98], []],
                [[87], [86], [85], [84], [83], [82], [81], [80], [79], [78], [77], []],
                [[], [67], [68], [69], [70], [71], [72], [73], [74], [75], [76], []],
                [[], [66], [65], [64], [63], [62], [61], [60], [59], [58], [57], []],
                [[], [46], [47], [48], [49], [50], [51], [52], [53], [54], [55], [56]],
                [[], [45], [44], [43], [42], [41], [40], [39], [38], [37], [36], []],
                [[], [], [26], [27], [28], [29], [30], [31], [32], [33], [34], [35]],
                [[], [25], [24], [23], [22], [21], [20], [19], [18], [17], [16], [15]],
                [[], [], [], [6], [7], [8], [9], [10], [11], [12], [13], [14]],
                [[], [], [], [], [], [], [], [5], [4], [3], [2], [1]]
            ]);
            Hex = /** @class */ (function () {
                function Hex(row, col, id, leds, color) {
                    if (color === void 0) { color = [0, 0, 0]; }
                    this.row = row;
                    this.col = col;
                    this.leds = leds;
                    this.id = id;
                    this.color = color;
                }
                return Hex;
            }());
            exports_2("Hex", Hex);
            HexGrid = /** @class */ (function () {
                function HexGrid() {
                    this.rows = GRIDMAP.length;
                    this.cols = GRIDMAP[0].length;
                    this.items = new Array(this.rows * this.cols);
                    for (var row = 0; row < this.rows; row++) {
                        for (var col = 0; col < this.cols; col++) {
                            if (GRIDMAP[row][col].length > 0) {
                                this.set(row, col, new Hex(row, col, GRIDMAP[row][col].sort()[0], GRIDMAP[row][col]));
                            }
                        }
                    }
                }
                HexGrid.prototype.get = function (row, col) {
                    return this.items[this.cols * row + col];
                };
                HexGrid.prototype.set = function (row, col, item) {
                    this.items[this.cols * row + col] = item;
                };
                HexGrid.prototype["import"] = function (input) {
                    var items = this.items.map(function (item) { return item.leds.map(function (led) { return ({
                        led: led,
                        item: item
                    }); }); }).reduce(function (acu, i) {
                        return acu.concat(i);
                    }, [])
                        .sort(function (a, b) { return a.led - b.led; })
                        .map(function (_a) {
                        var item = _a.item;
                        return item;
                    });
                    for (var itemID in items) {
                        items[itemID].color = input[itemID];
                    }
                };
                HexGrid.prototype["export"] = function () {
                    return this.items.map(function (item) { return item.leds.map(function (led) { return ({
                        led: led,
                        item: item
                    }); }); }).reduce(function (acu, i) {
                        return acu.concat(i);
                    }, [])
                        .sort(function (a, b) { return a.led - b.led; })
                        .map(function (_a) {
                        var item = _a.item;
                        return item.color;
                    });
                };
                return HexGrid;
            }());
            exports_2("HexGrid", HexGrid);
            HexGridElment = /** @class */ (function () {
                function HexGridElment(element, grid) {
                    this.elementHexMap = new Map();
                    this.hexElmentMap = new Map();
                    this.hexClickedEvent = new typedEvent_1.TypedEvent();
                    this.element = element;
                    this.grid = grid;
                    this.element.addEventListener('touchstart', this.onTouch.bind(this));
                    this.element.addEventListener('touchmove', this.onTouch.bind(this));
                    this.element.addEventListener('click', this.onClick.bind(this));
                    for (var _i = 0, _a = this.grid.items.filter(function (item) { return item; }); _i < _a.length; _i++) {
                        var item = _a[_i];
                        var el = this.element.getElementsByClassName('hex' + item.id)[0];
                        if (el) {
                            this.elementHexMap.set(el, item);
                            this.hexElmentMap.set(item, el);
                        }
                    }
                    //this.render()
                }
                HexGridElment.prototype.render = function () {
                    for (var _i = 0, _a = this.grid.items.filter(function (item) { return item; }); _i < _a.length; _i++) {
                        var item = _a[_i];
                        var el = this.hexElmentMap.get(item);
                        el.style.fill = "#" + colorToHex(item.color);
                    }
                };
                HexGridElment.prototype.onClick = function (event) {
                    var el = document.elementFromPoint(event.clientX, event.clientY);
                    var hex = this.elementHexMap.get(el);
                    if (!hex) {
                        return;
                    }
                    this.hexClickedEvent.emit(hex);
                    event.preventDefault();
                };
                HexGridElment.prototype.onTouch = function (event) {
                    var el = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
                    var hex = this.elementHexMap.get(el);
                    if (!hex) {
                        return;
                    }
                    this.hexClickedEvent.emit(hex);
                    event.preventDefault();
                };
                return HexGridElment;
            }());
            exports_2("HexGridElment", HexGridElment);
        }
    };
});
System.register("web", ["lib/hexGrid"], function (exports_3, context_3) {
    "use strict";
    var hexGrid_1;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (hexGrid_1_1) {
                hexGrid_1 = hexGrid_1_1;
            }
        ],
        execute: function () {
            exports_3("HexGridElment", hexGrid_1.HexGridElment);
            exports_3("HexGrid", hexGrid_1.HexGrid);
            exports_3("Hex", hexGrid_1.Hex);
            exports_3("GRIDMAP", hexGrid_1.GRIDMAP);
        }
    };
});
