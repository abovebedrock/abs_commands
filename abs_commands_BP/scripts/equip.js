import { EntityComponentTypes, EquipmentSlot, GameMode, ItemComponentTypes, system } from "@minecraft/server";
import { registerCommand } from "./common/commandBase";

export function equipInit(){}

registerCommand({
    names: ["equip", "head", "put"],
    description: "【会丢失任何附加数据！】将手上拿着的物品装备到头上。",
    args: [],
    callback: (_name, player)=>{
        const
        equippable = player.getComponent(EntityComponentTypes.Equippable),
        hand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand),
        head = equippable.getEquipmentSlot(EquipmentSlot.Head),
        handItem = hand.getItem();
        if(head.getItem()) player.sendMessage(`§c错误：头部已装备物品，请先脱下！`);
        else if(
            handItem.getLore().length
         || handItem.nameTag
         || handItem.getDynamicPropertyIds().length
         || handItem.getComponent(ItemComponentTypes.Durability)?.damage
         || handItem.getComponent(ItemComponentTypes.Dyeable)?.color
         || handItem.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().length
        ) player.sendMessage(`§c错误：物品存在附加数据，执行操作会导致数据丢失。`);
        else if(handItem){
            const gamemode = player.getGameMode();
            system.run(()=>{
                player.sendMessage(`装备成功。`);
                //先删除物品再装备物品，防止可能的刷物品bug
                const id = handItem.typeId;
                if(gamemode === GameMode.adventure || gamemode === GameMode.survival){
                    if(handItem.amount > 1){
                        const newItem = handItem.clone();
                        newItem.amount--;
                        hand.setItem(newItem);
                    }
                    else hand.setItem();
                }
                player.runCommand(`/replaceitem entity @s slot.armor.head 0 ${id}`);
            });
        }
        else player.sendMessage(`§c错误：你没有手持任何物品！`);
        return true;
    }
});