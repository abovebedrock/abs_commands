/**从上到下进度越来越多
 * @enum {string}
 * @readonly*/
export const statusTypes = {
    planning: "规划中",
    planned: "准备建设",
    constructing: "建设中",
    operational: "已建成", 
};

/**
 * @enum {string}
 * @readonly*/
export const lineD = {
    o: "主世界",
    n: "下界"
};

/**
 * @typedef {{
 *     interchange :boolean;
 *     status? :statusTypes;
 *     netherStatus? :statusTypes;
 *     coordinate? :[number, number, number];
 *     netherCoordinate? :[number, number, number];
 * }} Station
 * 
 * @typedef {{
 *     name :string;
 *     dimension :lineD;
 *     color :string;
 * }} LineDesc
 * 
 * @type {{
 *     updateTime :string;
 *     lines: string[][];
 *     lineDesc: LineDesc[];
 *     additionalInfo :string;
 *     stations: Record<string, Station>;
 * }}
 * @readonly*/
export const undergroundData = {
    updateTime: "2025.3.11",
    lines: [
        ["海西道", "雪山", "东山", "樱花岭", "北村", "中坪", "喉口", "出生点", "海角"],
        ["河西", "中坪", "传送门", "四季滩", "大学", "东新", "砂场", "双岛"],
        ["重庆村", "四川村", "四川", "百花峡", "小浪湾", "河西", "喉口", "花洲", "东新"],
        ["带湖", "犄角关", "望樱山", "樱花岭", "传送门", "花洲"],
        ["沙漠恶地", "丛林", "河西", "传送门", "西海底神殿", "中途岛", "雪地"],
        ["海西道", "望樱山", "四川", "丛林", "红沼", "南坪前哨站", "沼泽"],
        ["海西道", "西海底神殿", "蘑菇岛", "彼岸村庄"]
    ],
    lineDesc: [
        {name: "1", dimension: lineD.o, color: "e"},
        {name: "2", dimension: lineD.o, color: "9"},
        {name: "3", dimension: lineD.o, color: "6"},
        {name: "4", dimension: lineD.o, color: "a"},
        {name: "S1", dimension: lineD.n, color: "c"},
        {name: "S2", dimension: lineD.n, color: "d"},
        {name: "S3", dimension: lineD.n, color: "b"}
    ],
    additionalInfo: "部分新设站点坐标未勘测。",
    stations: {
    //1
        海西道: {
            interchange: true,
            status: statusTypes.planning,
            netherStatus: statusTypes.planning
        },
        雪山: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [342, 95, -742]
        },
        东山: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [330, 86, -563]
        },
        樱花岭: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [207, 80, -563]
        },
        北村: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [81, 62, -482]
        },
        中坪: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [81, 58, -387]
        },
        喉口: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [81, 55, -282]
        },
        出生点: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [-4, 101, -13]
        },
        海角: {
            interchange: false,
            status: statusTypes.planning
        },
    //2
        河西: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [-42, 51, -396],
            netherStatus: statusTypes.planning
        },
        传送门: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [210, 60, -383],
            netherStatus: statusTypes.constructing
        },
        四季滩: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [300, 60, -383]
        },
        大学: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [325, 66, -339]
        },
        东新: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [284, 57, -185]
        },
        砂场: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [0, 0, 0]
        },
        双岛: {
            interchange: false,
            status: statusTypes.planning
        },
    //3
        重庆村: {
            interchange: false,
            status: statusTypes.planning
        },
        四川村: {
            interchange: false,
            status: statusTypes.planning
        },
        四川: {
            interchange: true,
            status: statusTypes.planning,
            netherStatus: statusTypes.planning
        },
        百花峡: {
            interchange: false,
            status: statusTypes.operational,
            coordinate: [0, 0, 0]
        },
        小浪湾: {
            interchange: false,
            status: statusTypes.planning
        },
        花洲: {
            interchange: true,
            status: statusTypes.operational,
            coordinate: [0, 0, 0]
        },
    //4
        带湖: {
            interchange: false,
            status: statusTypes.planning
        },
        犄角关: {
            interchange: false,
            status: statusTypes.planning
        },
        望樱山: {
            interchange: true,
            status: statusTypes.planning,
            netherStatus: statusTypes.planning
        },
    //S1
        沙漠恶地: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
        丛林: {
            interchange: true,
            netherStatus: statusTypes.planning
        },
        西海底神殿: {
            interchange: true,
            netherStatus: statusTypes.planning
        },
        中途岛: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
        雪地: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
    //S2
        红沼: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
        南坪前哨站: {
            interchange: false,
            netherStatus: statusTypes.planning,
        },
        沼泽: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
    //S3
        蘑菇岛: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
        彼岸村庄: {
            interchange: false,
            netherStatus: statusTypes.planning
        },
    }
};