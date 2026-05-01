import { Numeric } from "@/game/reusable/numeric";
import { PrestigeCurrency } from "@/game/reusable/prestige-currency";
import { PrestigeLayer } from "@/game/reusable/prestige-layer";

import { Achievements } from "../achievements";
import { INFINITY } from "../constants";
import {
    DimensionalPoints,
    DimensionalPrestige
} from "../dimensional/dimensional";
import { Dimensions } from "../dimensional/dimensions";
import { Points } from "../main/points";
import { player } from "../player";
import { withEffects } from "../reusable/effect";
import { Tabs } from "../tabs";
import { CurrentTheme } from "../themes";
import { SpacetimePointMultUpgrade } from "./spacetime-upgrades";
import { TearSpacetime } from "./tear-spacetime";

export const SpacetimePoints = new (class extends PrestigeCurrency {
    name = "spacetime point";

    get value() {
        return player.spacetimePoints;
    }

    set value(value) {
        player.spacetimePoints = value;
    }

    private get rawSpacetimePointGain() {
        if (!TearSpacetime.tore) return new Numeric(1);
        return new Numeric(10).pow(Points.log10().div(INFINITY.log10()).sub(1));
    }

    get gainAmount(): Numeric {
        if (Points.lt(INFINITY)) return new Numeric(0);
        return withEffects(this.rawSpacetimePointGain)
            .apply(SpacetimePointMultUpgrade.effect)
            .value.floor();
    }

    get gainPerMinute() {
        return this.gainAmount.div(SpacetimePrestige.timeSpent / 60);
    }

    get peakPerMinute() {
        return player.statistics.peakSPPerMinute;
    }

    set peakPerMinute(value) {
        player.statistics.peakSPPerMinute = value;
    }

    get gainAtPeakPerMinute() {
        return player.statistics.SPGainAtPeakPerMin;
    }

    set gainAtPeakPerMinute(value) {
        player.statistics.SPGainAtPeakPerMin = value;
    }

    calcPeak() {
        if (this.gainPerMinute.gte(this.peakPerMinute)) {
            this.peakPerMinute = this.gainPerMinute.toDecimal();
            this.gainAtPeakPerMinute = this.gainAmount.toDecimal();
        }
    }
})();

export const SpacetimePrestige = new (class extends PrestigeLayer {
    currency = SpacetimePoints;

    get requiredCurrency() {
        return Points;
    }

    get canPrestige() {
        return Points.gte(INFINITY);
    }

    get prestigeCount() {
        return player.statistics.spacetimeCount;
    }

    set prestigeCount(value) {
        player.statistics.spacetimeCount = value;
    }

    get timeSpent() {
        return player.statistics.timeInCurrentSpacetime;
    }

    set timeSpent(time) {
        player.statistics.timeInCurrentSpacetime = time;
    }

    get fastestSpacetime() {
        return player.statistics.fastestSpacetime ?? Infinity;
    }

    set fastestSpacetime(time) {
        player.statistics.fastestSpacetime = time;
    }

    get stylePreset() {
        return CurrentTheme.buttons("spacetime");
    }

    reset() {
        DimensionalPrestige.reset();
        DimensionalPoints.amount = new Numeric(0);
        DimensionalPrestige.prestigeCount = 0;
        Dimensions.forEach((dim) => {
            dim.boughtAmount = 0;
        });
        if (
            this.fastestSpacetime === null ||
            this.timeSpent < this.fastestSpacetime
        ) {
            this.fastestSpacetime = this.timeSpent;
        }
        this.timeSpent = 0;
    }

    prePrestige() {
        if (DimensionalPrestige.prestigeCount === 0) {
            Achievements.getByID("a42").complete();
        }
    }

    postPrestige() {
        if (this.prestigeCount === 1) {
            Tabs.tab("spacetime").enter();
        }
    }
})();
