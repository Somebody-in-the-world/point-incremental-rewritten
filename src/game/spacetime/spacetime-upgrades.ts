import { spacetimeUpgradesData } from "../data/spacetime-upgrades";
import { typedArrayFromConfig } from "../object-utils";
import { Purchasable } from "../reusable/Purchasable";
import { Themes } from "../themes";
import { SpacetimePoints } from "./spacetime-points";

class SpacetimeUpgrade extends Purchasable {
    repeatable = false;
    get currency() {
        return SpacetimePoints;
    }

    get stylePreset() {
        return Themes.current.purchasable("spacetime");
    }

    get boughtAmount() {
        return player.spacetimeUpgrades[this.id];
    }

    set boughtAmount(value) {
        player.spacetimeUpgrades[this.id] = value;
    }
}

export const SpacetimeUpgrades = typedArrayFromConfig(
    spacetimeUpgradesData,
    SpacetimeUpgrade
);
