import { Effect } from "@/game/reusable/effect";
import { Numeric } from "@/game/reusable/numeric";
import type { PurchasableConfigMap } from "@/game/reusable/purchasable";

import { DimensionalPower } from "../dimensional/dimensional-power";
import { format } from "../format";
import { Points } from "../main/points";
import { SpacetimePoints, SpacetimePrestige } from "../spacetime/spacetime";
import { Time } from "../time";

export const spacetimeUpgradesData = {
    timeMult: {
        description: "Gain more points based on time played",
        cost: new Numeric(1),
        effect: new Effect({
            formula: () => new Numeric(Time.timePlayed).add(1).pow(0.4),
            type: "mul"
        })
    },
    baseIncrease: {
        description: "Increase base point upgrade multiplier (2x -> 2.2x)",
        cost: new Numeric(1)
    },
    firstDimBoost: {
        description: "1st dimensions are more effective based on points",
        cost: new Numeric(1),
        effect: new Effect({
            formula: () => Points.add(1).log10().pow(0.65).div(4).add(1),
            type: "mul"
        })
    },
    pointUpgradeCostDelay: {
        description:
            "Delay faster cost increase of point upgrades based on times spacetimed",
        cost: new Numeric(1),
        effect: new Effect({
            formula: () =>
                Numeric.min(
                    new Numeric(SpacetimePrestige.prestigeCount)
                        .mul(0.75)
                        .add(15)
                        .floor(),
                    100
                ),
            formatter: (effect) =>
                `${format(effect, { digitsBelowThousand: 0 })} upgrades later`,
            type: "add"
        })
    },
    DPBoost: {
        description:
            "Increase dimensional point gain based on dimensional power",
        cost: new Numeric(2),
        effect: new Effect({
            formula: () =>
                DimensionalPower.amount
                    .add(1)
                    .log10()
                    .pow(0.75)
                    .mul(0.25)
                    .add(1),
            type: "mul"
        })
    },
    pointSelfBoost: {
        description: "Points boost itself",
        cost: new Numeric(5),
        effect: new Effect({
            formula: () => Points.add(1).log10().pow(2.5).add(1),
            type: "mul"
        })
    },
    allDimBoost: {
        description: "All dimensions gain a boost based on fastest spacetime",
        cost: new Numeric(20),
        effect: new Effect({
            formula: () =>
                new Numeric(10 / SpacetimePrestige.fastestSpacetime + 1),
            type: "mul"
        })
    },
    dimPowBoost: {
        description:
            "Gain a multiplier to dimensional power production based on unspent spacetime points",
        cost: new Numeric(250),
        effect: new Effect({
            formula: () =>
                Numeric.min(
                    SpacetimePoints.pow(2).div(10).add(1),
                    new Numeric(1e10)
                ),
            type: "mul"
        })
    }
} as const satisfies PurchasableConfigMap;
