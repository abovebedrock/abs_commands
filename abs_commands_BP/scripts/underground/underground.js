import { Player } from "@minecraft/server";
import { prefixs, registerCommand } from "../common/commandBase";
import { undergroundData as data, statusTypes, lineD } from "./undergroundData";

export function undergroundInit(){}

registerCommand({
    names: ["u", "dt", "metro", "underground"],
    description: "查询地铁线路。",
    document: "§l注意：本命令的信息优先级高于游戏内告示牌。§r§f本命令只支持一个可选参数，当输入有效线路数字时，将返回线路示意图和各站基础信息；当输入有效站名时，将返回该站的详细信息，包括建设状态、线路、各下一站信息、坐标等；当输入无效字符或不提供参数时，将返回基于线路的所有线路和站点信息。",
    args: [
        {
            name: "lineOrStation",
            optional: true,
            type: "string"
        },
        {
            name: "identifier",
            optional: true,
            type: "string"
        }
    ],
    callback: (_name, player, args)=>{
        const
        LorS = /**@type {string | undefined}*/ (args.lineOrStation),
        identifier = /**@type {string | undefined}*/ (args.identifier);
        if(LorS === undefined){
            player.sendMessage(`\n§l————显示全部线路————`);
            for(let i = 0; i < data.lines.length; i++) sendLineMessage(player, i);
            sendAdditionalMessage(player);
        }
        else if(LorS === "l" || LorS === "L"){
            if(identifier === undefined){
                player.sendMessage(`§c错误：未输入线路名称，请检查输入。`);
                return true;
            }
            for(let i = 0; i < data.lineDesc.length; i++) if(data.lineDesc[i].name === identifier){
                player.sendMessage(`\n`);
                sendLineMessage(player, i);
                sendAdditionalMessage(player);
                return true;
            }
            player.sendMessage(`§c错误：“${identifier}”线路不存在，请检查输入。`);
        }
        else if(LorS === "s" || LorS === "S"){
            if(identifier === undefined){
                player.sendMessage(`§c错误：未输入站点名称，请检查输入。`);
                return true;
            }
            for(let sName in data.stations) if(sName === identifier){
                const stationData = data.stations[sName];
                player.sendMessage(`\n————${sName}站————`);
                for(let i = 0; i < data.lines.length; i++) for(let j = 0; j < data.lines[i].length; j++) if(data.lines[i][j] === sName){
                    const { name: lName, color } = data.lineDesc[i];
                    player.sendMessage(`§${color}${lName}-${j + 1 >= 10 ? "" : "0"}${j + 1}`);
                    player.sendMessage(`往${data.lines[i][0]}方向： ${j === 0 ? "——终点站——" : `下一站 ${data.lines[i][j - 1]}${getInterchangeString(data.lines[i][j - 1], i)}`}`);
                    player.sendMessage(`往${data.lines[i].at(-1)}方向： ${j === data.lines[i].length - 1 ? "——终点站——" : `下一站 ${data.lines[i][j + 1]}${getInterchangeString(data.lines[i][j + 1], i)}`}`);
                }
                player.sendMessage("\n");
                if(data.stations[sName].status) player.sendMessage(`主世界站： ${data.stations[sName].status}${data.stations[sName].status === statusTypes.operational ? `  坐标： (${data.stations[sName].coordinate.join(", ")})`: ""}`);
                else player.sendMessage("本站无主世界站");
                if(data.stations[sName].netherStatus) player.sendMessage(`下界站： ${data.stations[sName].netherStatus}${data.stations[sName].netherStatus === statusTypes.operational ? `  坐标： (${data.stations[sName].netherCoordinate.join(", ")})`: ""}`);
                else player.sendMessage("本站无下界站");
                player.sendMessage(`\n了解详细站点信息，请输入${prefixs[0]}u s <站名>； 了解详细线路信息，请输入${prefixs[0]}u l <线路编号>。`);
                return true;
            }
            player.sendMessage(`§c错误：“${identifier}”站不存在，请检查输入。`);
        }
        else player.sendMessage(`§c错误：“${LorS}”不是线路或站点的代名词。查询线路请输入l；查询站点请输入s。`);
        return true;
    }
});

/**解析并发送站点信息。
 * @param {Player} player
 * @param {number} lineId
 */
function sendLineMessage(player, lineId){
    const
    { name, color, dimension } = data.lineDesc[lineId],
    sColor = dimension === lineD.o ? "" : "§c",
    statusP = dimension === lineD.o ? "status" : "netherStatus";
    if(data.lines[lineId].length === 0) player.sendMessage(`${name}号线： 无线路信息。`);
    else{
        let str = `§${color}${name}号线： §f`;
        for(let i = 0; i < data.lines[lineId].length; i++){
            const
            sName = data.lines[lineId][i],
            sData = data.stations[sName];
            str += `${sColor}${sData.interchange ? "§l" : ""}${sData[statusP] === statusTypes.operational ? "" : "("}${sName}${sData[statusP] === statusTypes.operational ? "" : ")"}§r${i < data.lines[lineId].length - 1 ? `§${color}——§r` : ""}`;
        }
        player.sendMessage(str);
    }
}

/**发送额外的注明信息。
 * @param {Player} player
 */
function sendAdditionalMessage(player){
    if(data.additionalInfo !== "") player.sendMessage(`注： ${data.additionalInfo}`);
    player.sendMessage(`线路颜色为其代表颜色，§l加粗§r§f的站点为换乘站（包括跨维度换乘），§c红色§f的站点为下界站，括号内的站点为未开通站。未开通站的站名可能在以后发生更改。\n了解详细站点信息，请输入${prefixs[0]}u s <站名>； 了解详细线路信息，请输入${prefixs[0]}u l <线路编号>。`);
    player.sendMessage(`数据更新时间： ${data.updateTime}`);
}

/**生成换乘指引信息。
 * @param {string} sName 站的名称。
 * @param {number} originLineId 查找的初始线路的线路ID，以0开始。
 * @returns {string}
 */
function getInterchangeString(sName, originLineId){
    if(!sName || !data.stations[sName].interchange) return "";
    else{
        let results = [];
        for(let i = 0; i < data.lines.length; i++) if(i !== originLineId){
            const index = data.lines[i].indexOf(sName);
            if(index !== -1) results.push(`§${data.lineDesc[i].color}${data.lineDesc[i].name}号线§f`);
        }
        return `  可换乘 ${results.join("， ")}`;
    }
}