import { Dimension, Player, world } from "@minecraft/server";
import { dimensionIds, dimensionLocalezhCN, getCoordinate, getDistance, getHorizontalDistance, getNetherCoordinate, getOverworldCoordinate, getSubchunkCoordinate } from "../common/common";

/**标记点格式。
 * @typedef {[import("@minecraft/server").Vector3, Dimension]} MarkPoint*/

/**扩展坐标格式。
 * @typedef {{
 *     x :number;
 *     y :number;
 *     z :number;
 *     dimension :Dimension;
 * }} extendedCoordinate
 */

/**转换用户输入为维度。
 * @param {string} dimStr
 * @returns {Dimension | undefined}
 */
export function parseDimInput(dimStr){
    if(dimStr === "o" || dimStr === "主世界") return world.getDimension(dimensionIds[0]);
    else if(dimStr === "n" || dimStr === "下界") return world.getDimension(dimensionIds[1]);
    else if(dimStr === "e" || dimStr === "末地") return world.getDimension(dimensionIds[2]);
    else return undefined;
}

/**获得标记点的描述。
 * @param {Player} player
 * @param {MarkPoint} markedPoint
 * @returns {string}
 */
export function getPointDescStr(player, markedPoint){
    if(markedPoint[0] === undefined) return "无标记点";
    else{
        const [playerCoord, playerDimension] = getCoordinate(player);
        switch(markedPoint[1].id){
            case dimensionIds[0]: switch(playerDimension.id){
                case dimensionIds[0]: return `${dimensionLocalezhCN.get(dimensionIds[0])} ${getDimDescStr(playerCoord, markedPoint[0], true)}\n${dimensionLocalezhCN.get(dimensionIds[1])} ${getDimDescStr(getNetherCoordinate(playerCoord), getNetherCoordinate(markedPoint[0]), true)}`;
                case dimensionIds[1]: return `${dimensionLocalezhCN.get(dimensionIds[0])} ${getDimDescStr(getOverworldCoordinate(playerCoord), markedPoint[0], true)}\n${dimensionLocalezhCN.get(dimensionIds[1])} ${getDimDescStr(playerCoord, getNetherCoordinate(markedPoint[0]), true)}`;
                case dimensionIds[2]: return `${dimensionLocalezhCN.get(dimensionIds[0])} ${getDimDescStr(playerCoord, markedPoint[0], false)}`;
            }
            case dimensionIds[1]: switch(playerDimension.id){
                case dimensionIds[0]: return `${dimensionLocalezhCN.get(dimensionIds[1])} ${getDimDescStr(getNetherCoordinate(playerCoord), markedPoint[0], true)}\n${dimensionLocalezhCN.get(dimensionIds[0])} ${getDimDescStr(playerCoord, getOverworldCoordinate(markedPoint[0]), true)}`;
                case dimensionIds[1]: return `${dimensionLocalezhCN.get(dimensionIds[1])} ${getDimDescStr(playerCoord, markedPoint[0], true)}\n${dimensionLocalezhCN.get(dimensionIds[0])} ${getDimDescStr(getOverworldCoordinate(playerCoord), getOverworldCoordinate(markedPoint[0]), true)}`;
                case dimensionIds[2]: return `${dimensionLocalezhCN.get(dimensionIds[1])} ${getDimDescStr(playerCoord, markedPoint[0], false)}`;
            }
            case dimensionIds[2]: switch(playerDimension.id){
                case dimensionIds[2]: return `${dimensionLocalezhCN.get(dimensionIds[2])} ${getDimDescStr(playerCoord, markedPoint[0], true)}`;
                default: return `${dimensionLocalezhCN.get(dimensionIds[2])} ${getDimDescStr(playerCoord, markedPoint[0], false)}`;
            }
        }
    }
}

/**获得对于一个维度的完整坐标描述，不包括最前面的维度。
 * @param {import("@minecraft/server").Vector3} playerCoord
 * @param {import("@minecraft/server").Vector3} pointCoord
 * @param {boolean} showDistances
 */
export function getDimDescStr(playerCoord, pointCoord, showDistances){
    if(!showDistances) return `(${pointCoord.x}, ${pointCoord.y}, ${pointCoord.z})`;
    else{
        const
            distance = getDistance(playerCoord, pointCoord),
            hDistance = getHorizontalDistance(playerCoord, pointCoord),
            /**@type {import("@minecraft/server").Vector3}*/
            manDistance = {
                x: pointCoord.x - playerCoord.x,
                y: pointCoord.y - playerCoord.y,
                z: pointCoord.z - playerCoord.z
            },
            /**@type {import("@minecraft/server").Vector3}*/
            absManDistance = {
                x: Math.abs(manDistance.x),
                y: Math.abs(manDistance.y),
                z: Math.abs(manDistance.z)
            },
            subChunkCoord = getSubchunkCoordinate(pointCoord),
            maxManDistanceIndex = absManDistance.x >= absManDistance.y ? absManDistance.x === absManDistance.y ? 3 : absManDistance.x >= absManDistance.z ? absManDistance.x === absManDistance.z ? 3 : 0 : 2 : absManDistance.y >= absManDistance.z ? absManDistance.y === absManDistance.z ? 3 : 1 : absManDistance.x >= absManDistance.z ? absManDistance.x === absManDistance.z ? 3 : 0 : 2;
        return `(${pointCoord.x}, ${pointCoord.y}, ${pointCoord.z}) (${subChunkCoord[1].x} ${subChunkCoord[1].y} ${subChunkCoord[1].z} in ${subChunkCoord[0].x} ${subChunkCoord[0].y} ${subChunkCoord[0].z}) / (${maxManDistanceIndex === 0 ? "§e" : ""}${manDistance.x}${maxManDistanceIndex === 0 ? "§r" : ""}, ${maxManDistanceIndex === 1 ? "§e" : ""}${manDistance.y}${maxManDistanceIndex === 1 ? "§r" : ""}, ${maxManDistanceIndex === 2 ? "§e" : ""}${manDistance.z}${maxManDistanceIndex === 2 ? "§r" : ""}) ${getCarriedItemAmtStr(absManDistance.x + absManDistance.z)} ${getCarriedItemAmtStr(absManDistance.x + absManDistance.y + absManDistance.z)} / ${hDistance.toFixed(1)} ${distance.toFixed(1)}`;
    }
}

/**输入物品数量和可选的最大堆叠量，获得潜影盒、组进位字符串。
 * @param {number} amount
 * @param {number} [stackLimit_]
 * @returns {string}
 */
export function getCarriedItemAmtStr(amount, stackLimit_){
    const
        stackLimit = stackLimit_ ?? 64,
        shulkerBoxUnit = 27 * stackLimit,
        lcheShulkerBoxUnit = 54 * shulkerBoxUnit,
        lcheShulkerBoxAmount = Math.floor(amount / lcheShulkerBoxUnit),
        shulkerBoxAmount = Math.floor((amount - lcheShulkerBoxAmount * lcheShulkerBoxUnit) / shulkerBoxUnit),
        stackAmount = Math.floor((amount - lcheShulkerBoxAmount * lcheShulkerBoxUnit - shulkerBoxAmount * shulkerBoxUnit) / stackLimit),
        remainder = amount - lcheShulkerBoxAmount * lcheShulkerBoxUnit - shulkerBoxAmount * shulkerBoxUnit - stackAmount * stackLimit;
    return `${lcheShulkerBoxAmount > 0 ? `${lcheShulkerBoxAmount}c+` : ""}${shulkerBoxAmount > 0 ? `${shulkerBoxAmount}b+` : ""}${stackAmount > 0 ? `${stackAmount}s+` : ""}${remainder}`;
}