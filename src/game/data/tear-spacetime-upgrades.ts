import { Dimensions } from "../dimensional/dimensions";
import { format } from "../format";
import { Points } from "../main/points";
import { Effect } from "../reusable/effect";
import { Numeric } from "../reusable/numeric";
import type { PurchasableConfigMap } from "../reusable/purchasable";
import { SpacetimePoints } from "../spacetime/spacetime";

export const tearSpacetimeUpgradesData = {
    totalPointBoost: {
        description: "Gain a boost to points based on total points",
        cost: new Numeric(1e3),
        effect: new Effect({
            formula: () => Points.total.add(1).log10().add(1).pow(5),
            type: "mul"
        })
    },
    currentPointBoost: {
        description: "Gain a boost to points based on current points",
        cost: new Numeric(1.5e3),
        effect: new Effect({
            formula: () => Points.add(1).log10().add(1).pow(6).div(10),
            type: "mul"
        })
    },
    dim3Boost: {
        description: "3rd dimensions are more powerful based on their amount",
        cost: new Numeric(3333),
        effect: new Effect({
            formula: () =>
                Dimensions[2].totalAmount.add(1).log10().add(1).pow(10).add(1),
            type: "mul"
        })
    },
    dimPowerBoost: {
        description:
            "Dimensional power is more powerful based on unspent spacetime points",
        cost: new Numeric(1e4),
        effect: new Effect({
            formula: () =>
                SpacetimePoints.add(1).log10().add(1).pow(0.8).sub(1).div(3.33),
            type: "add",
            formatter: (effect) => `+${format(effect.mul(100), { digits: 2 })}%`
        })
    },
    freePointUpgrades: {
        description: "Gain free point upgrades based on 8th dimensions",
        cost: new Numeric(3e4),
        effect: new Effect({
            formula: () => new Numeric(Dimensions[7].boughtAmount * 1.5 + 10),
            type: "add"
        })
    },
    pointUpgradeCostMultiReduction: {
        repeatable: true,
        cap: 8,
        description: "Reduce point upgrade cost multiplier increase",
        cost: (boughtAmount) =>
            new Numeric(1e5).mul(new Numeric(5).pow(boughtAmount)),
        effect: new Effect({
            formula: (boughtAmount) => new Numeric(boughtAmount),
            type: "sub"
        })
    }
} as const satisfies PurchasableConfigMap;
