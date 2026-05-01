import {
    PurchasableConfigless,
    PurchasableMap
} from "@/game/reusable/purchasable";

import { Autobuyers } from "../autobuyers";
import { spacetimeUpgradesData } from "../data/spacetime-upgrades";
import { mapObject } from "../object-utils";
import { player } from "../player";
import { Effect } from "../reusable/effect";
import { Numeric } from "../reusable/numeric";
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

export const SpacetimePointMultUpgrade =
    new (class extends PurchasableConfigless {
        get cost() {
            return new Numeric(10).mul(new Numeric(25).pow(this.boughtAmount));
        }

        get effectObject() {
            return new Effect({
                formula: (boughtAmount) => new Numeric(3).pow(boughtAmount),
                type: "mul"
            });
        }

        get repeatable() {
            return true;
        }

        get boughtAmount() {
            return player.spacetimePointMultUpgrade;
        }

        set boughtAmount(value) {
            player.spacetimePointMultUpgrade = value;
        }

        get currency(): typeof SpacetimePoints {
            return SpacetimePoints;
        }

        get description() {
            return "Triple spacetime point gain";
        }

        get stylePreset() {
            return CurrentTheme.purchasable("spacetime");
        }

        purchaseFunc() {
            Autobuyers.spacetime.playerConfig.inputs.threshold =
                Autobuyers.spacetime.inputs.threshold.mul(3).toString();
        }
    })();
