import { Numeric } from "@/game/reusable/numeric";
import { PrestigeCurrency } from "@/game/reusable/prestige-currency";
import { PrestigeLayer } from "@/game/reusable/prestige-layer";

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
import { SpacetimePointMultUpgrade } from "./spacetime-upgrades";

export const SpacetimePoints = new (class extends PrestigeCurrency {
    name = "spacetime point";

    get value() {
        return player.spacetimePoints;
    }

    set value(value) {
        player.spacetimePoints = value;
    }

    get gainAmount(): Numeric {
        if (Points.lt(INFINITY)) return new Numeric(0);
        return withEffects(new Numeric(1)).apply(
            SpacetimePointMultUpgrade.effect
        ).value;
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

    reset() {
        DimensionalPrestige.reset();
        DimensionalPoints.amount = new Numeric(0);
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

    postPrestige() {
        if (this.prestigeCount === 1) {
            Tabs.tab("spacetime").enter();
        }
    }
})();
