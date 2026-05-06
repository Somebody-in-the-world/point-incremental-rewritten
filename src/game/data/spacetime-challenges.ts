import { Effect } from "../core/effect";
import { Numeric } from "../core/numeric";
import { DimensionalPoints } from "../dimensional/dimensional";
import { DimensionalPower } from "../dimensional/dimensional-power";
import type { SpacetimeChallengeConfig } from "../spacetime/spacetime-challenges";

export const spacetimeChallengesData = {
    noDimensions: {
        description: "Dimensions are disabled",
        requirement: new Numeric("1e512"),
        unlockRequirement: new Numeric("1e1000"),
        rewardDescription:
            "Dimension power is more powerful based on dimensional points",
        rewardEffect: new Effect({
            // i have absolutely no idea why i need to cast this, i HATE typescript
            formula: (() =>
                DimensionalPoints.add(1)
                    .log10()
                    .add(1)
                    .log10()
                    .add(1)
                    .pow(3)
                    .div(30)
                    .add(1)) as () => Numeric,
            type: "mul"
        })
    },
    dimNoPerPurchase: {
        description: "Dimension per-purchase multiplier is always 1x",
        requirement: new Numeric("1e1075"),
        unlockRequirement: new Numeric("1e1600"),
        rewardDescription:
            "Increase dimension per-purchase multiplier (2x -> 2.5x)",
        rewardEffect: new Effect({
            formula: () => new Numeric(0.5),
            type: "add",
            formatter: null
        })
    },
    pointGainSqrt: {
        description: "Point gain is square rooted",
        requirement: new Numeric("1e365"),
        unlockRequirement: new Numeric("1e2345"),
        rewardDescription: "Point gain ^1.05",
        rewardEffect: new Effect({
            formula: () => new Numeric(1.05),
            type: "pow",
            formatter: null
        })
    },
    expensivePointUpgrades: {
        description: "Point upgrade cost is hyper-exponentially increased",
        requirement: new Numeric("1e1050"),
        unlockRequirement: new Numeric("1e4200"),
        rewardDescription: "Point upgrade cost multiplier increase 2x -> 1.75x",
        rewardEffect: new Effect({
            formula: () => new Numeric(0.25),
            type: "sub",
            formatter: null
        })
    },
    noCPAndAP: {
        description:
            "Compressed points effect is always 1x and automation points effect is always 100%",
        requirement: new Numeric("1e1575"),
        unlockRequirement: new Numeric("1e7000"),
        rewardDescription:
            "Increase compressed points and automation points effect exponent"
    },
    dimPowMult: {
        description:
            "Dimensional power boosts points, point upgrades are disabled",
        requirement: new Numeric("1e7777"),
        unlockRequirement: new Numeric("1e14000"),
        rewardDescription:
            "Dimensional power boosts points with reduced effect",
        rewardEffect: new Effect({
            formula: () => DimensionalPower.add(1).pow(0.1).mul("1e150"),
            type: "mul"
        })
    }
} as const satisfies Record<string, SpacetimeChallengeConfig>;
