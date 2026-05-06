import { Currency } from "@/game/core/currency";

import { withEffects } from "../core/effect";
import { Numeric } from "../core/numeric";
import { player } from "../player";
import { SpacetimeChallenges } from "../spacetime/spacetime-challenges";
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

    private get rawEffect() {
        let effect = this.add(1).log10().div(30);
        if (TearSpacetimeUpgrades.dimPowerFormula.bought) {
            effect = Numeric.max(this.add(1).log10().pow(2).div(6000), effect);
        }
        if (TearSpacetimeUpgrades.betterDimPowFormula.bought) {
            effect = Numeric.max(
                this.add(1).log10().pow(2.5).div(125000),
                effect
            );
        }
        return effect;
    }

    get effect() {
        return withEffects(this.rawEffect)
            .apply(TearSpacetimeUpgrades.dimPowerBoost.effect)
            .apply(SpacetimeChallenges.noDimensions.rewardEffect).value;
    }

    get continuousGainAmount() {
        return Dimensions[0].production;
    }
})();
