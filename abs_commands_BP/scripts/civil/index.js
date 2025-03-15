import { InputPermissionCategory, system } from "@minecraft/server";
import { prefixs, registerCommand } from "../common/commandBase";
import { dimensionLocalezhCN as dzhCN, getCoordinate } from "../common/common";
import { getMarkPoint, removeMarkPoint, setMarkPoint } from "./markPointUtils";
import { showMain } from "./mainForm";
import { showChunkBorder } from "./chunkBorder";
import { displayMarkedPoint, stopDisplay } from "./markPoint";
import { showDocument } from "./document";

export function civilInit(){};

registerCommand({
    names: ["l", "ci", "civil", "ce", "tm", "gc", "engineer", "kt"],
    description: `打开工程工具箱窗口。输入${prefixs[0]}l doc查看使用手册。`,
    document: "工程工具箱文档敬请期待！",
    args: [{
        name: "magicString",
        optional: true,
        type: "string"
    }],
    callback: (_names, player, args)=>{
        const
        showCommandTips = player.getDynamicProperty("hideCivilCommandTips") !== true,
        markPoint = getMarkPoint(player);
        switch(args.magicString){
            case "set":
                if(markPoint[0] !== undefined) player.sendMessage(`§c已经存在标记点： ${dzhCN.get(markPoint[1].id)} (${markPoint[0].x}, ${markPoint[0].y}, ${markPoint[0].z})${showCommandTips ? `， 输入${prefixs[0]}l del清除标记点` : ""}。`);
                else{
                    const [coord, dimension] = getCoordinate(player);
                    setMarkPoint(player);
                    player.sendMessage(`§e已经设置标记点 ${dzhCN.get(dimension.id)} (${coord.x}, ${coord.y}, ${coord.z})。`);
                }
                break;
            case "del":
                if(markPoint[0] !== undefined){
                    removeMarkPoint(player);
                    player.sendMessage(`已经清除标记点 ${dzhCN.get(markPoint[1].id)} (${markPoint[0].x}, ${markPoint[0].y}, ${markPoint[0].z})。`);
                }
                else player.sendMessage(`§c无标记点。${showCommandTips ? ` 输入${prefixs[0]}l set将当前坐标添加为标记点。` : ""}`);
                break;
            case "unlock":
                system.run(()=>{
                    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, true);
                    player.inputPermissions.setPermissionCategory(InputPermissionCategory.LateralMovement, true);
                    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
                    player.inputPermissions.setPermissionCategory(InputPermissionCategory.Sneak, true);
                    player.setDynamicProperty("lockCamera", false);
                    player.setDynamicProperty("lockLateral", false);
                    player.setDynamicProperty("lockJump", false);
                    player.setDynamicProperty("lockSneak", false);
                    player.sendMessage("已经解除所有行动锁定。");
                });
                break;
            case "chunk":
                showChunkBorder(player, 10);
                if(showCommandTips) player.sendMessage("请使用工具箱界面以指定具体时长。");
                break;
            case "show":
                if(markPoint[0] === undefined) player.sendMessage(`§c未设置标记点，请先使用${prefixs[0]}l set设置标记点！`);
                else displayMarkedPoint(player, markPoint);
                break;
            case "stop":
                stopDisplay(player);
                break;
            case "doc":
                player.sendMessage(`已打开使用手册，请关闭聊天栏查看。`);
                system.run(()=>showDocument(player, true));
                break;
            case undefined:
                if(showCommandTips) player.sendMessage(`工程工具箱窗口已打开，请关闭聊天栏查看。输入${prefixs[0]}l set将当前坐标添加为标记点。`);
                system.run(()=>showMain(player));
                break;
            default:
                player.sendMessage(`§c${prefixs[0]}l: ${args.magicString}不是一个有效子命令。${showCommandTips ? `请输入${prefixs[0]}l doc查看使用手册，获取更多相关信息。` : ""}`);
                break;
        }
        return true;
    }
});