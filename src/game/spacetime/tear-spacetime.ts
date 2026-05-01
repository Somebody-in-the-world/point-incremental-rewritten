import { tearSpacetimeUpgradesData } from "../data/tear-spacetime-upgrades";
import { mapObject } from "../object-utils";
import { player } from "../player";
import { Numeric } from "../reusable/numeric";
import { PurchasableMap } from "../reusable/purchasable";
import { CurrentTheme } from "../themes";
import { SpacetimePoints } from "./spacetime";

export const TearSpacetime = {
    requirement: new Numeric(1000),

    get tore() {
        return player.spacetimeTore;
    },

    set tore(value) {
        player.spacetimeTore = value;
    },

    get canTear() {
        return SpacetimePoints.gte(this.requirement);
    },

    tear() {
        if (this.canTear) this.tore = true;
    }
};

class TearSpacetimeUpgrade extends PurchasableMap {
    get stylePreset() {
        return CurrentTheme.purchasable("spacetime");
    }

    get currency() {
        return SpacetimePoints;
    }

    get map() {
        return player.tearSpacetimeUpgrades;
    }
}

export const TearSpacetimeUpgrades = mapObject(
    tearSpacetimeUpgradesData,
    (config, id) => new TearSpacetimeUpgrade(config, id)
);
