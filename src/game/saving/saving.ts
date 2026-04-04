import { mergeObjects } from "../object-utils";
import { player } from "../player";
import {
    recursiveDecimalToObject,
    recursiveObjectToDecimal
} from "./decimal-utils";

export const savefileKey = "pointIncrementalSavefile";

export function saveGame() {
    const savefile = btoa(JSON.stringify(recursiveDecimalToObject(player)));
    localStorage.setItem(savefileKey, savefile);
}

export function loadSave() {
    const saveData = localStorage.getItem(savefileKey);
    if (!saveData) return;
    const savefile = recursiveObjectToDecimal(JSON.parse(atob(saveData)));

    mergeObjects(player, savefile);
}
