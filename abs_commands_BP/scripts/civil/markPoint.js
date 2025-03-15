import { MolangVariableMap, Player, system, world } from "@minecraft/server";
import { dimensionIds, dimensionLocalezhCN as dzhCN, getCoordinate } from "../common/common";
import { MessageFormData, ModalFormData } from "@minecraft/server-ui";
import { getPointDescStr, parseDimInput } from "./utils";
import { showMain } from "./mainForm";
import { getMarkPoint, removeMarkPoint, setMarkPoint } from "./markPointUtils";
import { prefixs } from "../common/commandBase";

/**常空。
 * 相应玩家为true则正在显示，没有则没在显示。
 * 相应玩家设为false则取消显示。
 * @type {Map<string, boolean>}
 */
export const stopDisplaySignal = new Map();

/**显示标记点主窗口。
 * @param {Player} player
 * @param {import("./utils").MarkPoint | [undefined, undefined]} markedPoint
 */
export function showMarkPoint(player, markedPoint){
    const options = ["不更新", `${markedPoint[0] ? "更改" : "新建"}标记点`];
    if(markedPoint[0]) options.push("删除标记点");
    const
    showingMP = stopDisplaySignal.has(player.name),
    [coord, dimension] = getCoordinate(player),
    markPointForm = new ModalFormData()
    .title(markedPoint[0] ? `${dzhCN.get(markedPoint[1].id)} (${markedPoint[0].x}, ${markedPoint[0].y}, ${markedPoint[0].z})` : "未设置标记点")
    .dropdown(markedPoint[0] ? `当前位置： ${dzhCN.get(dimension.id)} (${coord.x}, ${coord.y}, ${coord.z})\n${getPointDescStr(player, markedPoint)}\n\n更新标记点：` : "新建标记点：", options, 0)
    .submitButton("确定");
    if(markedPoint[0]) markPointForm
    .toggle(`对自己显示标记点（${prefixs[0]}l show）`, showingMP)
    .toggle("打印所有信息到聊天并关闭窗口")
    .toggle("向公屏发送标记点坐标并关闭窗口");
    //@ts-ignore
    markPointForm.show(player).then(response=>{
        if(!response.canceled){
            const
            operation = /**@type {number}*/ (response.formValues[0]),
            newShowMP = /**@type {boolean}*/ (response.formValues[1]),
            printInfo = /**@type {boolean}*/ (response.formValues[2]),
            sendCoord = /**@type {boolean}*/ (response.formValues[3]);
            if(newShowMP !== showingMP){
                if(newShowMP) displayMarkedPoint(player, markedPoint);
                else stopDisplay(player);
            }
            if(printInfo || sendCoord){
                if(printInfo) player.sendMessage(`§e§l标记点： ${dzhCN.get(markedPoint[1].id)} (${markedPoint[0].x}, ${markedPoint[0].y}, ${markedPoint[0].z})§r\n${getPointDescStr(player, markedPoint)}`);
                if(sendCoord){
                    const str = `<${player.name}> ${dzhCN.get(markedPoint[1].id)} ${markedPoint[0].x} ${markedPoint[0].y} ${markedPoint[0].z}`;
                    world.sendMessage(str);
                    console.log(`[civil] ${str}`);
                }
                if(operation === 2) removeMarkPoint(player);
                return;
            }
            switch(operation){
                case 0:
                    showMain(player);
                    break;
                case 1:
                    showEditMarkPoint(player);
                    break;
                case 2:
                    removeMarkPoint(player);
                    showMarkPoint(player, [undefined, undefined]);
                    break;
            }
        }
        else showMain(player);
    });
}

/**在坐标位置为玩家显示粒子效果。
 * @param {Player} player
 * @param {import("./utils").MarkPoint} markedPoint
 */
export function displayMarkedPoint(player, markedPoint){
    const name = player.name;
    if(stopDisplaySignal.has(name)){
        player.sendMessage(`§c标记点已在显示中！`);
        return;
    }
    else if(player.dimension.id !== markedPoint[1].id){
        player.sendMessage(`§c标记点不在同一维度，无法显示！`);
        return;
    }
    const
    molangp = new MolangVariableMap(),
    molangn = new MolangVariableMap();
    molangp.setFloat("variable.direction", 1);
    molangn.setFloat("variable.direction", -1);
    stopDisplaySignal.set(name, true);
    player.sendMessage(`§e正在显示标记点 ${dzhCN.get(markedPoint[1].id)} (${markedPoint[0].x}, ${markedPoint[0].y}, ${markedPoint[0].z})。输入${prefixs[0]}l stop停止。`);
    const interval = system.runInterval(()=>{
        if(stopDisplaySignal.get(name) !== false){
            try{ //不知道区块有没有加载，但是又不想一直在后台刷错误
                player.spawnParticle("abs:markpoint",  markedPoint[0]);
                player.spawnParticle("abs:markpoint_beacon",  markedPoint[0], molangp);
                player.spawnParticle("abs:markpoint_beacon",  markedPoint[0], molangn);
            }
            catch(e){}
        }
        else{
            stopDisplaySignal.delete(name);
            system.clearRun(interval);
            return;
        }
    }, 20);
}

/**停止显示标记点。
 * @param {Player} player
 * @param {boolean} [hideFeedback]
 */
export function stopDisplay(player, hideFeedback){
    if(stopDisplaySignal.has(player.name)){
        stopDisplaySignal.set(player.name, false);
        if(!hideFeedback) player.sendMessage("已停止显示标记点。");
    }
    else if(!hideFeedback) player.sendMessage("目前未显示标记点。");
}

world.beforeEvents.playerLeave.subscribe(data=>{
    stopDisplay(data.player, true);
});

/**显示编辑标记点数据窗口。
 * @param {Player} player
 * @param {string} [preX]
 * @param {string} [preY]
 * @param {string} [preZ]
 * @param {string} [preDim]
 */
function showEditMarkPoint(player, preX, preY, preZ, preDim){
    const
    [altCoord, altDimension] = getCoordinate(player),
    lastMarkedPoint = getMarkPoint(player),
    editMarkPointForm = new ModalFormData()
    .title("编辑标记点")
    .textField("若全部留空，则为当前所在位置。输入标记点：\n\nX坐标：", `${altCoord.x}`, preX)
    .textField("Y坐标：", `${altCoord.y}`, preY).textField("Z坐标：", `${altCoord.z}`, preZ)
    .textField("维度： 主世界（o）、下界（n）或末地（e）", dzhCN.get(altDimension.id), preDim)
    .submitButton("确定");
    //@ts-ignore
    editMarkPointForm.show(player).then(response=>{
        if(!response.canceled){
            const
            xStr = /**@type {string}*/ (response.formValues[0]),
            yStr = /**@type {string}*/ (response.formValues[1]),
            zStr = /**@type {string}*/ (response.formValues[2]),
            dimStr = /**@type {string}*/ (response.formValues[3]);
            if(xStr === "" || yStr === "" || zStr === "" || dimStr === ""){
                if(xStr === "" && yStr === "" && zStr === "" && dimStr === "") showMarkPoint(player, setMarkPoint(player));
                else{
                    const errorForm = new MessageFormData().title("输入数据不全").body("输入的数据不完整，请检查是否有留空的输入框。若要使用当前所在位置，请将全部输入框留空。\n点击确定返回修改，点击取消回到标记点页面。").button1("取消").button2("确定");
                    //@ts-ignore
                    errorForm.show(player).then(response=>{
                        if(response.selection === 0) showMarkPoint(player, lastMarkedPoint);
                        else showEditMarkPoint(player, xStr, yStr, zStr, dimStr);
                    });
                    return;
                }
            }
            else{
                const x = parseInt(xStr), y = parseInt(yStr), z = parseInt(zStr), dimension = parseDimInput(dimStr);
                if(isNaN(x) || isNaN(y) || isNaN(z) || !isFinite(x) || !isFinite(y) || !isFinite(z) || !dimension){
                    const errorForm = new MessageFormData().title("输入数据有误").body("输入的数据有误，无法解析。\n对于维度，请完整输入“主世界”、“下界”、“末地”、“o”、“n”、“e”中的任一值。\n点击确定返回修改，点击取消回到标记点页面。").button1("取消").button2("确定");
                    //@ts-ignore
                    errorForm.show(player).then(response=>{
                        if(response.selection === 0) showMarkPoint(player, lastMarkedPoint);
                        else showEditMarkPoint(player, xStr, yStr, zStr, dimStr);
                    });
                    return;
                }
                else if(
                    (x > 30000000 || x < -30000000 || z > 30000000 || z < -30000000)
                 || (dimension.id == dimensionIds[0] && (y > 319 || y < -64))
                 || (dimension.id == dimensionIds[1] && (y > 127 || y < 0))
                 || (dimension.id == dimensionIds[2] && (y > 255 || y < 0))
                ){
                    const errorForm = new MessageFormData()
                    .title("输入数据有误")
                    .body("输入的数据超出世界方块范围。\nX和Z坐标为[-30000000, 30000000]；\n主世界Y坐标为[-64, 319]；\n下界Y坐标为[0, 127]；\n末地Y坐标为[0, 255]；\n点击确定返回修改，点击取消回到标记点页面。")
                    .button1("取消")
                    .button2("确定");
                    //@ts-ignore
                    errorForm.show(player).then(response=>{
                        if(response.selection === 0) showMarkPoint(player, lastMarkedPoint);
                        else showEditMarkPoint(player, xStr, yStr, zStr, dimStr);
                    });
                    return;
                }
                else showMarkPoint(player, setMarkPoint(player, {x, y, z}, dimension));
            }
        }
        else showMarkPoint(player, lastMarkedPoint);
    });
}