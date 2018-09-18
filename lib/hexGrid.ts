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
    color:Array<number>
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