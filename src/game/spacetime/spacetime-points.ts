import { INFINITY } from "../constants";
import {
    DimensionalPoints,
    DimensionalPrestige
} from "../dimensional/dimensional";
import { Dimensions } from "../dimensional/dimensions";
import { Points } from "../main/points";
import { PrestigeCurrency } from "../reusable/prestige-currency";
import { PrestigeLayer } from "../reusable/prestige-layer";

export const SpacetimePoints = new (class extends PrestigeCurrency {
    name = "spacetime point";

    get amount() {
        return player.spacetimePoints;
    }

    set amount(value) {
        player.spacetimePoints = value;
    }

    get gainAmount() {
        if (Points.lt(INFINITY)) return new Decimal(0);
        return new Decimal(1);
    }
})();

export const SpacetimePrestige = new (class extends PrestigeLayer {
    currency = SpacetimePoints;

    get prestigeCount() {
        return player.statistics.spacetimeCount;
    }

    set prestigeCount(value) {
        player.statistics.spacetimeCount = value;
    }

    reset() {
        DimensionalPrestige.reset();
        DimensionalPoints.amount = new Decimal(0);
        Dimensions.forEach((dim) => {
            dim.boughtAmount = 0;
        });
    }
})();
