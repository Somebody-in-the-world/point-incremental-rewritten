import { DimensionalPrestige } from "../dimensional/dimensional";
import { DimensionalPower } from "../dimensional/dimensional-power";
import { Dimensions } from "../dimensional/dimensions";
import { format } from "../format";
import { AutomationPoints } from "../main/automation-points";
import { CompressedPoints } from "../main/compressed-points";
import { PointUpgrade } from "../main/point-upgrade";
import { Points } from "../main/points";
import { Effect } from "../reusable/effect";
import type { MilestoneConfig } from "../reusable/milestone";
import { Numeric } from "../reusable/numeric";

export const achievementData: MilestoneConfig[] = [
    {
        name: "You gotta start somewhere",
        description: "Get a point",
        unlockRequirement: () => Points.gte(1)
    },
    {
        name: "10 points is a lot",
        description: "Buy a point upgrade",
        unlockRequirement: () => PointUpgrade.boughtAmount >= 1
    },
    {
        name: "Hydraulic press",
        description: "Compress your points",
        unlockRequirement: () => CompressedPoints.gte(1)
    },
    {
        name: "You gotta do some sacrifices",
        description: "Sacrifice your compressed points into automation points",
        unlockRequirement: () => AutomationPoints.gte(1)
    },
    {
        name: "I never liked clicking anyways",
        description: () => `Get ${format(new Numeric(1e3))} automation points`,
        unlockRequirement: () => AutomationPoints.gte(1e3)
    },
    {
        name: "That's a big number!",
        description: () => `Get ${format(new Numeric(1e10))} points`,
        unlockRequirement: () => Points.gte(1e10),
        rewardDescription: "Unlock bulk purchasing point upgrades"
    },
    {
        name: "That's a bigger number!",
        description: () => `Get ${format(new Numeric(1e20))} points`,
        unlockRequirement: () => Points.gte(1e20)
    },
    {
        name: "(softcapped)",
        description: () => `Get ${format(new Numeric(1e30))} points`,
        unlockRequirement: () => Points.gte(1e30)
    },
    {
        name: "Raising it to a higher dimension",
        description: "Convert your points into dimension points",
        unlockRequirement: () => DimensionalPrestige.prestigeCount >= 1,
        rewardDescription: () => `Gain ${format(new Numeric(10))}x points`
    },
    {
        name: "Antimatter dimensions???",
        description: "Purchase a 1st dimension",
        unlockRequirement: () => Dimensions[0]!.boughtAmount >= 1
    },
    {
        name: "10 dimensional points is still a lot",
        description: "Purchase a 2nd dimension",
        unlockRequirement: () => Dimensions[1]!.boughtAmount >= 1
    },
    {
        name: "A million is a lot",
        description: () => `Have ${format(new Numeric(1e6))} dimensional power`,
        unlockRequirement: () => DimensionalPower.gte(1e6)
    },
    {
        name: "Googol",
        description: () => `Get ${format(new Numeric(1e100))} points`,
        unlockRequirement: () => Points.gte(1e100),
        rewardDescription:
            "Compressing your points no longer resets point upgrades"
    },
    {
        name: "Dimensional Power-up",
        description: () =>
            `Have ${format(new Numeric(1e15))} dimensional power`,
        unlockRequirement: () => DimensionalPower.gte(1e15),
        rewardDescription: "Gain a boost to points based on dimensional power",
        rewardEffect: new Effect(
            () => DimensionalPower.add(1).log10().pow(2).add(1),
            Effect.MULTIPLY
        )
    },
    {
        name: "Huh?",
        description: "Dimensional without compressing your points",
        unlockRequirement: () => false,
        rewardDescription: () =>
            `Reduce dimensional requirement from ${format(new Numeric(1e30))} \
to ${format(new Numeric(1e25))}`
    },
    {
        name: "Skipping the game",
        description: () =>
            `Have the point upgrade multiplier be over ${format(new Numeric(3))}x`,
        unlockRequirement: () => PointUpgrade.singularEffect.gte(3)
    }
] as const;
