import { TypedEvent } from "./typedEvent";
export const GRIDMAP = [
    [[]       ,[]         ,[]   ,[]   ,[]   ,[]       ,[]       ,[174]    ,[175]    ,[176]    ,[177,178],[179,180]],
    [[]       ,[]         ,[]   ,[173],[172],[171]    ,[170]    ,[169]    ,[168]    ,[166,167],[164,165],[]        ],
    [[]       ,[]         ,[154],[155],[156],[157]    ,[158]    ,[159]    ,[160]    ,[161]    ,[162]    ,[163]     ],
    [[]       ,[153]      ,[152],[151],[150],[149]    ,[148]    ,[147]    ,[146]    ,[145]    ,[144]    ,[]        ],
    [[]       ,[134]      ,[135],[136],[137],[138]    ,[139]    ,[140]    ,[141]    ,[142]    ,[143]    ,[]        ],
    [[133]    ,[132]      ,[131],[130],[129],[128]    ,[127]    ,[126]    ,[125]    ,[124]    ,[123]    ,[]        ],
    [[111]    ,[112,113]  ,[114],[115],[116],[117]    ,[118]    ,[119]    ,[120]    ,[121]    ,[122]    ,[]        ],
    [[110,109],[108]      ,[107],[106],[105],[104]    ,[103]    ,[102]    ,[101]    ,[100]    ,[99]     ,[]        ],
    [[88]     ,[89]       ,[90] ,[91] ,[92] ,[93]     ,[94]     ,[95]     ,[96]     ,[97]     ,[98]     ,[]        ],
    [[87]     ,[86]       ,[85] ,[84] ,[83] ,[82]     ,[81]     ,[80]     ,[79]     ,[78]     ,[77]     ,[]        ],
    [[]       ,[67]       ,[68] ,[69] ,[70] ,[71]     ,[72]     ,[73]     ,[74]     ,[75]     ,[76]     ,[]        ],
    [[]       ,[66]       ,[65] ,[64] ,[63] ,[62]     ,[61]     ,[60]     ,[59]     ,[58]     ,[57]     ,[]        ],
    [[]       ,[46]       ,[47] ,[48] ,[49] ,[50]     ,[51]     ,[52]     ,[53]     ,[54]     ,[55]     ,[56]      ],
    [[]       ,[45]       ,[44] ,[43] ,[42] ,[41]     ,[40]     ,[39]     ,[38]     ,[37]     ,[36]     ,[]        ],
    [[]       ,[]         ,[26] ,[27] ,[28] ,[29]     ,[30]     ,[31]     ,[32]     ,[33]     ,[34]     ,[35]      ],
    [[]       ,[25]       ,[24] ,[23] ,[22] ,[21]     ,[20]     ,[19]     ,[18]     ,[17]     ,[16]     ,[15]      ],
    [[]       ,[]         ,[]   ,[6]  ,[7]  ,[8]      ,[9]      ,[10]     ,[11]     ,[12]     ,[13]     ,[14]      ],
    [[]       ,[]         ,[]   ,[]   ,[]   ,[]       ,[]       ,[5]      ,[4]      ,[3]      ,[2]      ,[1]       ]
]
export class Hex {
    row:number;
    col:number;
    readonly id:number;
    leds:Array<number>
    color:Array<number>;

    constructor(row,col,id,leds,color=[0,0,0]){
        this.row = row;
        this.col = col;
        this.leds = leds;
        this.id = id;
        this.color=color;
    }
}
export class HexGrid {
    readonly rows:number = GRIDMAP.length;
    readonly cols:number = GRIDMAP[0].length;
    items:Array<Hex>=new Array(this.rows*this.cols)
    constructor(){
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(GRIDMAP[row][col].length > 0){
                    this.set(row,col,new Hex(row,col,GRIDMAP[row][col].sort()[0],GRIDMAP[row][col]))
                }
            }
        }
    }
    get(row,col){
        return this.items[this.cols*row+col]
    }
    set(row,col,item){
        this.items[this.cols*row+col]=item;
    }
    import(input){
        let items = this.items.map((item)=>item.leds.map((led)=>({
            led,
            item
        }))).reduce((acu,i)=>{
            return acu.concat(i)
        },[])
        .sort(function(a, b){return a.led - b.led})
        .map(({item})=>item)
        for(let itemID in items){
            items[itemID].color=input[itemID];
        }
    }
    export(){
        return this.items.map((item)=>item.leds.map((led)=>({
            led,
            item
        }))).reduce((acu,i)=>{
            return acu.concat(i)
        },[])
        .sort(function(a, b){return a.led - b.led})
        .map(({item})=>item.color)
    }
}
export function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function colorToHex(input:Array<number>) {
    return componentToHex(input[0]) + componentToHex(input[1]) + componentToHex(input[2]);
}
export class HexGridElment {
    element:Document;
    grid:HexGrid;
    elementHexMap= new Map<HTMLElement,Hex>();
    hexElmentMap= new Map<Hex,HTMLElement>();
    hexClickedEvent = new TypedEvent<Hex>();
    constructor(element,grid){
        this.element=element;
        this.grid=grid;
        this.element.addEventListener('touchstart',this.onTouch.bind(this))
        this.element.addEventListener('touchmove',this.onTouch.bind(this))
        this.element.addEventListener('click',this.onClick.bind(this))
        this.element.addEventListener('mousemove',this.onMouseMove.bind(this))
        for(let item of this.grid.items.filter((item)=>item)){
            let el = <HTMLElement>this.element.getElementsByClassName('hex'+item.id)[0]
            if(el){
                this.elementHexMap.set(el,item)
                this.hexElmentMap.set(item,el)
            }
        }
        //this.render()
    }
    render(){
        for(let item of this.grid.items.filter((item)=>item)){
            let el = this.hexElmentMap.get(item)
            el.style.fill = "#"+colorToHex(item.color);
        }
    }
    onMouseMove(event:MouseEvent){
        console.log(event)
        if(event.buttons){
            this.onClick(event)
        }
    }
    onClick(event:MouseEvent){
        let el = <HTMLElement>document.elementFromPoint(event.clientX, event.clientY)
        let hex = this.elementHexMap.get(el);
        if(!hex){
            return;
        }
        this.hexClickedEvent.emit(hex)
        event.preventDefault();
    }
    onTouch(event:TouchEvent){
        let el = <HTMLElement>document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)
        let hex = this.elementHexMap.get(el);
        if(!hex){
            return;
        }
        this.hexClickedEvent.emit(hex)
        event.preventDefault();
    }
}
export function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}