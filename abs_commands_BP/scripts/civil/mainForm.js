import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { dimensionLocalezhCN } from "../common/common";
import { getMarkPoint } from "./markPointUtils";
import { showMarkPoint } from "./markPoint";
import { showActionLock } from "./actionLock";
import { showSettings } from "./settings";
import { showDocument } from "./document";

/**显示主窗口。
 * @param {Player} player
 */
export function showMain(player){
    const
        showCommandTips = player.getDynamicProperty("hideCivilCommandTips") !== true,
        [coord, dimension] = getMarkPoint(player),
        mainForm = new ActionFormData()
        .title("工程工具箱")
        .button(`§l${coord ? `${dimensionLocalezhCN.get(dimension.id)} (${coord.x}, ${coord.y}, ${coord.z})` : `无标记点${ showCommandTips ? "， 点击此处设置" : ""}`}`, "textures/ui/pointer");
        if(coord){
            mainForm
            .button("测量距离", "textures/ui/redstone_arrow_powered")
            .button("挖掘隧道", "textures/ui/icon_iron_pickaxe")
            .button("铺设平面", "textures/ui/slot_disabled_pocket")
            .button("填充长方体", "textures/ui/world_glyph");
        }
        mainForm
        .button("行动锁定", "textures/ui/icon_lock")
        .button("其它", "textures/ui/permissions_custom_dots")
        .button(`使用手册${showCommandTips ? "§9§l【请点我学习本工具！】" : ""}`, "textures/ui/creative_icon")
        .button("关闭窗口", "textures/ui/crossout");
    //@ts-ignore
    mainForm.show(player).then(response=>{
        if(response.cancelationReason === FormCancelationReason.UserBusy) system.run(()=>showMain(player));
        else{
            if(coord) switch(response.selection){
                case 0:
                    showMarkPoint(player, [coord, dimension]);
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    showActionLock(player);
                    break;
                case 6:
                    showSettings(player);
                    break;
                case 7:
                    showDocument(player);
                    break;
            }
            else switch(response.selection){
                case 0:
                    showMarkPoint(player, [coord, dimension]);
                    break;
                case 1:
                    showActionLock(player);
                    break;
                case 2:
                    showSettings(player);
                    break;
                case 3:
                    showDocument(player);
                    break;
            }
        }
    });
}