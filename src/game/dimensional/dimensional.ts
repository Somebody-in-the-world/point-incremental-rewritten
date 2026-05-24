import { Numeric } from "@/game/core/numeric";
import { PrestigeCurrency } from "@/game/core/prestige-currency";
import { PrestigeLayer } from "@/game/core/prestige-layer";

import { Achievements } from "../achievements";
import { withEffects } from "../core/effect";
import {
    AutomationPoints,
    AutomationPointsUnlock
} from "../main/automation-points";
import {
    CompressedPoints,
    CompressedPointsPrestige
} from "../main/compressed-points";
import { PointUpgrade } from "../main/point-upgrade";
import { Points } from "../main/points";
import { player } from "../player";
import { SpacetimeMilestones } from "../spacetime/spacetime-milestones";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { DimensionalPower } from "./dimensional-power";
import { Dimensions } from "./dimensions";

export const DimensionalPoints = new (class extends PrestigeCurrency {
    name = "dimensional point";

    get amount() {
        return player.dimensionalPoints;
    }

    set amount(value) {
        player.dimensionalPoints = value;
    }

    get prestigeRequirement() {
        if (Achievements.getByID("a42").completed) return new Numeric(1e15);
        if (Achievements.getByID("a27").completed) return new Numeric(1e25);
        return new Numeric(1e30);
    }

    get gainAmount() {
        return withEffects(Points.div(this.prestigeRequirement).pow(0.1))
            .apply(SpacetimeUpgrades.DPBoost.effect)
            .value.floor();
    }

    get nextRequirement() {
        return this.gainAmount.add(1).pow(10).mul(this.prestigeRequirement);
    }

    get continuousGainAmount() {
        if (!TearSpacetimeUpgrades.autoDP.bought) return new Numeric(0);
        return this.gainAmount.div(100);
    }
})();

export const DimensionalPrestige = new (class extends PrestigeLayer {
    currency = DimensionalPoints;

    get requiredCurrency() {
        return Points;
    }

    get canPrestige() {
        return Points.gte(this.currency.prestigeRequirement);
    }

    get prestigeCount() {
        return player.statistics.dimensionalCount;
    }

    set prestigeCount(value) {
        player.statistics.dimensionalCount = value;
    }

    prePrestige() {
        if (CompressedPointsPrestige.prestigeCount === 0) {
            Achievements.getByID("a27").complete();
        }
    }

    reset() {
        CompressedPointsPrestige.reset();
        PointUpgrade.boughtAmount = 0;
        CompressedPoints.amount = new Numeric(0);
        if (SpacetimeMilestones.startingAutomationPoints.completed) {
            AutomationPoints.amount = new Numeric(100);
            AutomationPointsUnlock.bought = true;
        } else {
            AutomationPoints.amount = new Numeric(0);
            AutomationPointsUnlock.bought = false;
        }
        DimensionalPower.amount = new Numeric(0);
        Dimensions.forEach((dim) => {
            dim.generatedAmount = new Numeric(0);
        });
        CompressedPointsPrestige.prestigeCount = 0;
    }
})();
