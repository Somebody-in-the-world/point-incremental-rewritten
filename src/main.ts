import { init, startSaving } from "./game";
import { startGameLoop } from "./game/gameloop";
import { loadSave } from "./game/saving/saving";

init();
loadSave();
startSaving();
startGameLoop();
