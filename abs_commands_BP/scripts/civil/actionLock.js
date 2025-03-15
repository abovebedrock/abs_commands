import { InputButton, InputPermissionCategory, Player, world } from "@minecraft/server";
import { showMain } from "./mainForm";
import { prefixs } from "../common/commandBase";
import { ModalFormData } from "@minecraft/server-ui";


/**显示行动锁定窗口。
 * @param {Player} player
 */
export function showActionLock(player){
    const
        /**@type {import("@minecraft/server").Vector2}*/
        rotation = {
            x: Math.round(player.getRotation().x),
            y: Math.round(player.getRotation().y)
        },
        originCamera = player.getDynamicProperty("lockCamera") === true,
        originLateral = player.getDynamicProperty("lockLateral") === true,
        originJump = player.getDynamicProperty("lockJump") === true,
        originSneak = player.getDynamicProperty("lockSneak") === true,
        actionLockForm = new ModalFormData().title("行动锁定")
        .dropdown(`所有行动锁定在重进游戏后会自动解除，也可以重新进入此处解除，还可以输入${prefixs[0]}l unlock快速解除。\n为了方便起见，若更新了锁定状态，将立即退出工具。\n\n锁定视角到预设：`, ["当前玩家视角", "正北（-Z）", "正南（+Z）", "正西（-X）", "正东（+X）", "正上（向北）", "正上（向南）", "正上（向西）", "正上（向东）", "正下（向北）", "正下（向南）", "正下（向西）", "正下（向东）"])
        .toggle("§l§e不使用预设，使用下方的自定义数据")
        .slider("-180：正北， -90：正西， 0：正南， 90：正东   方向角", -180, 179, 1, rotation.y)
        .slider("-90：正上， 0：水平， 90：正下             俯仰角", -90, 90, 1, rotation.x)
        .toggle("确认锁定视角", originCamera)
        .toggle("禁用WASD", originLateral)
        .toggle("禁用跳跃", originJump)
        .toggle("禁用潜行", originSneak)
        .submitButton("确定");
    //@ts-ignore
    actionLockForm.show(player).then(response=>{
        if(!response.canceled){
            const
                selectedPreset = /**@type {number}*/ (response.formValues[0]),
                presetData = presetMap.get(selectedPreset),
                customRotation = /**@type {boolean}*/ (response.formValues[1]),
                customY = /**@type {number}*/ (response.formValues[2]),
                customX = /**@type {number}*/ (response.formValues[3]),
                newCamera = /**@type {boolean}*/ (response.formValues[4]),
                newLateral = /**@type {boolean}*/ (response.formValues[5]),
                newJump = /**@type {boolean}*/ (response.formValues[6]),
                newSneak = /**@type {boolean}*/ (response.formValues[7]);
            //更新玩家行动锁定状态
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Camera, !newCamera);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.LateralMovement, !newLateral);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, !newJump);
            player.inputPermissions.setPermissionCategory(InputPermissionCategory.Sneak, !newSneak);
            player.setDynamicProperty("lockCamera", newCamera);
            player.setDynamicProperty("lockLateral", newLateral);
            player.setDynamicProperty("lockJump",  newJump);
            player.setDynamicProperty("lockSneak",  newSneak);
            let str = "§6§l";
            //给玩家发送行动锁定信息
            if(newCamera){
                setPlayerPerspective(player, selectedPreset, customRotation ? customX : undefined, customRotation ? customY : undefined);
                str += "已锁定视角。";
            }
            if(newLateral) str += "已禁用WASD移动。";
            if(newJump) str += "已禁用跳跃（自动跳跃仍然生效）。";
            if(newSneak){
                str += "已禁用潜行。";
                player.isSneaking = true;
            }
            if(newCamera || newLateral || newJump || newSneak) player.sendMessage(`${str}\n输入${prefixs[0]}l unlock解除所有锁定。`);
            //如果对锁定参数做出了更改，并且不是消除所有锁定的更改，则立即退出工具；否则回到主页
            if( //没有锁定
                (!newCamera && !newLateral && !newJump && !newSneak)
             || ( //没有做出更改
                    originCamera === newCamera && originLateral === newLateral && originJump === newJump && originSneak === newSneak
                 && ( //视角锁定参数没有改变
                        (customRotation && rotation.x === customX && rotation.y === customY)
                     || (
                            !customRotation
                         && (
                                selectedPreset === 0
                             || (rotation.x === presetData.x && rotation.y === presetData.y)
                            )
                        )
                    )
                )
            ) showMain(player);
        }
        else showMain(player);
    });
}

/**@type {ReadonlyMap<number, import("@minecraft/server").Vector2>}*/
const presetMap = new Map([
    [1, {x: 0, y: -180}],
    [2, {x: 0, y: 0}],
    [3, {x: 0, y: 90}],
    [4, {x: 0, y: -90}],
    [5, {x: -90, y: -180}],
    [6, {x: -90, y: 0}],
    [7, {x: -90, y: 90}],
    [8, {x: -90, y: -90}],
    [9, {x: 90, y: -180}],
    [10, {x: 90, y: 0}],
    [11, {x: 90, y: 90}],
    [12, {x: 90, y: -90}]
]);

/**减少重复代码量抽提的转变玩家视角方法。
 * @param {Player} player
 * @param {number} magicNumber
 * @param {number | undefined} customX
 * @param {number | undefined} customY
 */
function setPlayerPerspective(player, magicNumber, customX, customY){
    if(customX !== undefined && customY !== undefined) player.teleport(player.location, {
        rotation: {
            x: customX,
            y: customY
        }
    });
    else if(magicNumber !== 0){
        const preset = presetMap.get(magicNumber);
        player.teleport(player.location, {
            rotation: {
                x: preset.x,
                y: preset.y
            }
        });
    }
}

//为每一个加入的玩家自动注册行动锁定所需的附加属性。
world.afterEvents.playerSpawn.subscribe(data=>{
    if(data.initialSpawn){
        const players = world.getPlayers({name: data.player.name});
        if(players.length > 0){
            players[0].setDynamicProperty("lockCamera", false);
            players[0].setDynamicProperty("lockLateral", false);
            players[0].setDynamicProperty("lockJump", false);
            players[0].setDynamicProperty("lockSneak", false);
        }
    }
});