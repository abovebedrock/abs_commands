import { ModalFormData } from "@minecraft/server-ui";
import { showMain } from "./mainForm";
import { showChunkBorder } from "./chunkBorder";
import { Player } from "@minecraft/server";

/**显示其它（设置）窗口。
 * @param {Player} player
 */
export function showSettings(player){
    const
        showCommandTips = player.getDynamicProperty("hideCivilCommandTips") !== true,
        settingForm = new ModalFormData()
        .title("其它")
        .toggle("显示所有附加提示（熟悉操作后建议关闭）", showCommandTips)
        .dropdown("显示区块边界？", [
            "不显示", "显示5秒", "显示10秒", "显示20秒", "显示30秒", "显示1分钟", "显示5分钟", "一直显示（直到服务器重启）"
        ], 0)
        .submitButton("应用");
    //@ts-ignore
    settingForm.show(player).then(response=>{
        if(!response.canceled){
            player.setDynamicProperty("hideCivilCommandTips", !response.formValues[0]);
            const chunkBorderDropDown = /**@type {number}*/ response.formValues[1];
            switch(chunkBorderDropDown){
                case 0: default:
                    showMain(player);
                    break;
                case 1:
                    showChunkBorder(player, 5);
                    break;
                case 2:
                    showChunkBorder(player, 10);
                    break;
                case 3:
                    showChunkBorder(player, 20);
                    break;
                case 4:
                    showChunkBorder(player, 30);
                    break;
                case 5:
                    showChunkBorder(player, 60);
                    break;
                case 6:
                    showChunkBorder(player, 300);
                    break;
                case 7:
                    showChunkBorder(player, Infinity);
                    break;
            }
        }
        else showMain(player);
    });
}