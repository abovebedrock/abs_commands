import { system } from "@minecraft/server";
import { registerCommand } from "./common/commandBase";
import { randomInt } from "./utils/random";
import { meta } from "./common/common";
import { getABSPlayers } from "./players";

export function aboutInit(){}

registerCommand({
    names: ["about"],
    description: "关于服务器的一切。",
    document: "LJM12914荣誉出品。",
    args: [],
    callback: (_name, player)=>{
        player.sendMessage(`§e§l基岩之上服务器第${meta.season}季`);
        player.sendMessage(`§。§e§lAboveBedrock SMP Season ${meta.seasonNum}`);
        player.sendMessage(`§b当前版本： ${meta.version}  更新时间： ${meta.updateTime}`);
        player.sendMessage(`已注册玩家： ${getABSPlayers().join(", ")}`);
        player.sendMessage("§b网站： https://www.abovebedrock.com");
        player.sendMessage("§bQQ群： 811530587");
        player.sendMessage("§6IP： abovebedrock.com");
        player.sendMessage("§。§e§l2018-2024 ABS!");
        system.run(()=>player.playSound(`horn.call.${randomInt(0, 7)}`, {
            volume: 0.9,
            pitch: 1.0
        }));
        return true;
    }
});