import { MolangVariableMap, Player, system, world } from "@minecraft/server";
import { getCoordinate, getSubchunkCoordinate } from "../common/common";

/**给玩家显示区块边界。
 * @param {Player} player
 * @param {number} sec
 */
export function showChunkBorder(player, sec){
    const
    showInfinitely = !isFinite(sec),
    molangx = new MolangVariableMap(),
    molangz = new MolangVariableMap();
    molangx.setFloat("variable.dx", 17);
    molangx.setFloat("variable.dz", 0);
    molangz.setFloat("variable.dx", 0);
    molangz.setFloat("variable.dz", 17);
    if(showInfinitely) player.sendMessage("§e显示区块边界直到退出游戏或服务器重启。");
    else player.sendMessage(`§e显示区块边界${sec}秒。`);
    let c = 0;
    const interval = system.runInterval(()=>{
        if(world.getAllPlayers().includes(player) && (showInfinitely || c < sec * 20 / 10)){
            const
            coord = getCoordinate(player)[0],
            chunkCoord = getSubchunkCoordinate(coord)[0];
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 0.01, z: chunkCoord.z * 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 1.01, z: chunkCoord.z * 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y - 0.99, z: chunkCoord.z * 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 0.01, z: chunkCoord.z * 16 + 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 1.01, z: chunkCoord.z * 16 + 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y - 0.99, z: chunkCoord.z * 16 + 16}, molangx);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 0.01, z: chunkCoord.z * 16}, molangz);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y + 1.01, z: chunkCoord.z * 16}, molangz);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16, y: coord.y - 0.99, z: chunkCoord.z * 16}, molangz);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16 + 16, y: coord.y + 0.01, z: chunkCoord.z * 16}, molangz);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16 + 16, y: coord.y + 1.01, z: chunkCoord.z * 16}, molangz);
            player.spawnParticle("abs:chunkborder", {x: chunkCoord.x * 16 + 16, y: coord.y - 0.99, z: chunkCoord.z * 16}, molangz);
            c++;
        }
        else{
            system.clearRun(interval);
            return;
        }
    }, 10);
}