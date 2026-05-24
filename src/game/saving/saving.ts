import { mergeObjects } from "../object-utils";
import { player } from "../player";
import {
    recursiveNumericToObject,
    recursiveObjectToNumeric
} from "./decimal-utils";

export const savefileKey = "pointIncrementalSavefile";
let shouldSave = true;

export function saveGame() {
    if (!shouldSave) return;
    const savefile = btoa(JSON.stringify(recursiveNumericToObject(player)));
    localStorage.setItem(savefileKey, savefile);
}

export function loadSave() {
    const savefile = getSavefile();
    if (!savefile) return;
    const parsed = recursiveObjectToNumeric(JSON.parse(atob(savefile)));

    Object.assign(player, mergeObjects(player, parsed));
}

export function getSavefile() {
    return localStorage.getItem(savefileKey);
}

export function importSavefile(savefile: string | null) {
    shouldSave = false;
    if (savefile === null) {
        localStorage.removeItem(savefileKey);
    } else {
        try {
            JSON.parse(atob(savefile));
        } catch (e) {
            shouldSave = true;
            throw e;
        }
        localStorage.setItem(savefileKey, savefile);
    }
    location.reload();
}
