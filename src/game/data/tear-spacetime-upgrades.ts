import { Effect } from "../core/effect";
import { Numeric } from "../core/numeric";
import type { PurchasableConfig } from "../core/purchasable";
import { DarkMatter } from "../dark-matter/dark-matter";
import { DimensionalPower } from "../dimensional/dimensional-power";
import { Dimensions } from "../dimensional/dimensions";
import { format } from "../format";
import { Points } from "../main/points";
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
    spacetimePointBoost: {
        description: "Gain a boost to points based on unspent spacetime points",
        cost: new Numeric(2.5e3),
        effect: new Effect({
            formula: () =>
                Numeric.min(SpacetimePoints.pow(1.05).add(1).mul(1e9), "1e100"),
            type: "mul"
        })
    },
    dimPowerBoost: {
        description:
            "Dimensional power is more powerful based on unspent spacetime points",
        cost: new Numeric(1e4),
        effect: new Effect({
            formula: () =>
                SpacetimePoints.add(1).log10().add(1).pow(0.8).sub(1).div(3),
            type: "add",
            formatter: (effect) => `+${format(effect.mul(100), { digits: 2 })}%`
        })
    },
    freePointUpgrades: {
        description: "Gain free point upgrades based on 8th dimensions",
        cost: new Numeric(4.4444e4),
        effect: new Effect({
            formula: () =>
                new Numeric(
                    Math.min(Dimensions[7].boughtAmount * 1.5 + 20, 200)
                ),
            type: "add"
        })
    },
    allDimBoost: {
        description: "Power up all dimensions based on dimensional power",
        cost: new Numeric(2.5e5),
        effect: new Effect({
            formula: () =>
                DimensionalPower.add(1).log10().add(1).pow(2.5).mul(10000),
            type: "mul"
        })
    },
    dimAutoBulk: {
        description: "Dimension autobuyers bulk buy upgrades",
        cost: new Numeric(4e6)
    },
    dimPowerFormula: {
        description:
            "Improve dimensional power effect formula (log(x) -> log(x)^2)",
        cost: new Numeric(2.5e7)
    },
    autoDP: {
        description:
            "Automatically gain 1% of DP you would normally gain on dimensional per second",
        cost: new Numeric(1.5e11)
    },
    betterDimPowFormula: {
        description:
            "Further improve dimensional power effect formula (log(x)^2 -> log(x)^2.5)",
        cost: new Numeric(1e25)
    },
    darkMatterSPBoost: {
        description: "Dark matter and spacetime points boost each other",
        cost: new Numeric(1e45),
        effect: new Effect({
            formula: () =>
                DarkMatter.pow(0.2)
                    .add(1)
                    .mul(SpacetimePoints.add(1).log10().add(1))
                    .pow(0.5)
                    .add(1),
            type: "mul"
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
} as const satisfies Record<string, PurchasableConfig>;
