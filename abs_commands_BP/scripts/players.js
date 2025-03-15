import { world } from "@minecraft/server";
import { registerCommand } from "./common/commandBase";

export function playersInit(){}

/**获取所有注册玩家。
 * @returns {string[]}
 */
export function getABSPlayers(){
    const raw = /**@type {string | undefined}*/ (world.getDynamicProperty("players"));
    if(raw == undefined) return [];
    else return raw.split(",");
}

/**工具函数。
 * @param {string[]} players
 */
export function setABSPlayers(players){
    world.setDynamicProperty("players", players.join(","));
}

/**添加注册玩家。
 * @param {string} name
 * @returns {boolean} 是否添加成功。
 */
export function addABSPlayer(name){
    const players = getABSPlayers();
    if(players.includes(name)) return false;
    else{
        players.push(name);
        setABSPlayers(players);
        return true;
    }
}

/**移除注册玩家。
 * @param {string} name
 * @returns {boolean} 是否移除成功。
 */
export function removeABSPlayer(name){
    const players = getABSPlayers();
    if(!players.includes(name)) return false;
    else{
        players.splice(players.indexOf(name), 1);
        setABSPlayers(players);
        return true;
    }
}

world.afterEvents.playerJoin.subscribe(data=>{
    if(!getABSPlayers().includes(data.playerName)){
        console.warn(`Registering ${data.playerName}.`);
        addABSPlayer(data.playerName);
    }
});

registerCommand({
    names: ["players"],
    description: "管理注册玩家。参数operation：add|remove|list。",
    tagsRequired: ["dev"],
    args: [
        {
            name: "operation",
            optional: false,
            type: "string"
        },
        {
            name: "playerName",
            optional: true,
            type: "string"
        }
    ],
    callback: (_name, player, args)=>{
        if(args.operation == "list") player.sendMessage(`所有玩家：\n${getABSPlayers().join(", ")}`);
        else if(args.operation == "add"){
            if(addABSPlayer(/**@type {string}*/ (args.playerName))) player.sendMessage(`已添加玩家${args.playerName}。`);
            else player.sendMessage(`§c玩家${args.playerName}已在列表中。`);
        }
        else if(args.operation == "remove"){
            if(removeABSPlayer(/**@type {string}*/ (args.playerName))) player.sendMessage(`已移除玩家${args.playerName}。`);
            else player.sendMessage(`§c未找到玩家${args.playerName}。`);
        }
        else player.sendMessage(`§c错误的参数operation：${args.operation}`);
        return true;
    }
});