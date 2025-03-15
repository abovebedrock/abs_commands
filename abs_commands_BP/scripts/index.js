import { commonInit } from "./common/common";
import { commandInit } from "./common/commandBase";
import { welcomeInit } from "./welcome";
import { fstInit } from "./fst";
import { playersInit } from "./players";
import { enchantInit } from "./enchant";
import { coordinateInit } from "./coordinate";
import { messageInit } from "./message";
import { performanceInit } from "./performance";
import { undergroundInit } from "./underground/underground";
import { deathCoordsInit } from "./deathCoords";
import { equipInit } from "./equip";
import { dayInit } from "./day";
import { biomeInit } from "./biome";
import { tridentInit } from "./trident";
import { civilInit } from "./civil/index";
import { aboutInit } from "./about";
import { antiCheatInit } from "./antiCheat/index";
import { lockInit } from "./locks/index";

commonInit();

commandInit();

welcomeInit();
fstInit();
playersInit();
enchantInit();
coordinateInit();
messageInit();
performanceInit();
undergroundInit();
deathCoordsInit();
equipInit();
dayInit();
biomeInit();
tridentInit();
civilInit();
aboutInit();

antiCheatInit();

lockInit();