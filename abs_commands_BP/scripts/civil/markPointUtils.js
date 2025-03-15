import { Player, Dimension } from "@minecraft/server";
import { retrieveDimension, getCoordinate, getDimensionML } from "../common/common";
import { stopDisplay } from "./markPoint";

/**解析标记点。
 * @param {Player} player
 * @returns {[import("@minecraft/server").Vector3, Dimension] | [undefined, undefined]}
 */
export function getMarkPoint(player){
    const data = player.getDynamicProperty("markedPoint");
    if(data === undefined) return [undefined, undefined];
    else{
        const datas = /**@type {string}*/ (data).split(",");
        return [{
            x: parseInt(datas[0]),
            y: parseInt(datas[1]),
            z: parseInt(datas[2]),
        }, retrieveDimension(/**@type {"o" | "n" | "e"}*/(datas[3]))];
    }
}

/**设置标记点。如果不提供可选参数，则使用玩家目前的位置。
 * @param {Player} player
 * @param {import("@minecraft/server").Vector3} [coord]
 * @param {Dimension} [dimension]
 * @returns {import("./utils").MarkPoint}
 */
export function setMarkPoint(player, coord, dimension){
    if(!coord || !dimension){
        const [coord, altDimension] = getCoordinate(player);
        player.setDynamicProperty("markedPoint", `${coord.x},${coord.y},${coord.z},${getDimensionML(altDimension)}`);
        return [coord, altDimension];
    }
    else{
        player.setDynamicProperty("markedPoint", `${coord.x},${coord.y},${coord.z},${getDimensionML(dimension)}`);
        return [coord, dimension];
    }
}

/**清除标记点并返回数据。
 * @param {Player} player
 * @returns {import("./utils").MarkPoint | [undefined, undefined]}
 */
export function removeMarkPoint(player){
    const data = getMarkPoint(player);
    player.setDynamicProperty("markedPoint", undefined);
    stopDisplay(player, true);
    return data;
}