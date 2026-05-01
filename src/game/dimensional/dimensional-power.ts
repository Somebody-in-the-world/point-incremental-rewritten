import { Currency } from "@/game/reusable/currency";

import { player } from "../player";
import { withEffects } from "../reusable/effect";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { Dimensions } from "./dimensions";

export const DimensionalPower = new (class extends Currency {
    name = "dimensional power";

    get value() {
        return player.dimensionalPower;
    }

    set value(value) {
        player.dimensionalPower = value;
    }

    get effect() {
        return withEffects(this.add(1).log10().div(30)).apply(
            TearSpacetimeUpgrades.dimPowerBoost.effect
        ).value;
    }

    get continuousGainAmount() {
        return Dimensions[0].generationEffect;
    }
})();
