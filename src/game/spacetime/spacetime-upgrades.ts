import { spacetimeUpgradesData } from "../data/spacetime-upgrades";
import { mapObject } from "../object-utils";
import { player } from "../player";
import { PurchasableMap } from "../reusable/purchasable";
import { CurrentTheme } from "../themes";
import { SpacetimePoints } from "./spacetime";

class SpacetimeUpgrade extends PurchasableMap {
    get repeatable() {
        return false;
    }

    get currency() {
        return SpacetimePoints;
    }

    get stylePreset() {
        return CurrentTheme.purchasable("spacetime");
    }

    get map() {
        return player.spacetimeUpgrades;
    }
}

export const SpacetimeUpgrades = mapObject(
    spacetimeUpgradesData,
    (config, id) => new SpacetimeUpgrade(config, id)
);
