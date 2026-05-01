import { Effect } from "@/game/reusable/effect";
import type { MilestoneConfig } from "@/game/reusable/milestone";
import { Numeric } from "@/game/reusable/numeric";

import { INFINITY } from "../constants";
import {
    DimensionalPoints,
    DimensionalPrestige
} from "../dimensional/dimensional";
import { DimensionalPower } from "../dimensional/dimensional-power";
import { Dimensions } from "../dimensional/dimensions";
import { format } from "../format";
import { AutomationPoints } from "../main/automation-points";
import { CompressedPoints } from "../main/compressed-points";
import { PointUpgrade } from "../main/point-upgrade";
import { Points } from "../main/points";
import { SpacetimePrestige } from "../spacetime/spacetime";
import { SpacetimeMilestones } from "../spacetime/spacetime-milestones";
import { SpacetimeUpgrades } from "../spacetime/spacetime-upgrades";
import { TearSpacetime } from "../spacetime/tear-spacetime";

export const achievementData: MilestoneConfig[] = [
    {
        name: "You gotta start somewhere",
        description: "Get a point",
        requirement: () => Points.gte(1)
    },
    {
        name: "10 points is a lot",
        description: "Buy a point upgrade",
        requirement: () => PointUpgrade.boughtAmount >= 1
    },
    {
        name: "Hydraulic press",
        description: "Compress your points",
        requirement: () => CompressedPoints.gte(1)
    },
    {
        name: "You gotta do some sacrifices",
        description: "Sacrifice your compressed points into automation points",
        requirement: () => AutomationPoints.gte(1)
    },
    {
        name: "I never liked clicking anyways",
        description: () => `Get ${format(new Numeric(1e3))} automation points`,
        requirement: () => AutomationPoints.gte(1e3)
    },
    {
        name: "That's a big number!",
        description: () => `Get ${format(new Numeric(1e10))} points`,
        requirement: () => Points.gte(1e10),
        rewardDescription: "Unlock bulk purchasing point upgrades"
    },
    {
        name: "That's a bigger number!",
        description: () => `Get ${format(new Numeric(1e20))} points`,
        requirement: () => Points.gte(1e20)
    },
    {
        name: "(softcapped)",
        description: () => `Get ${format(new Numeric(1e30))} points`,
        requirement: () => Points.gte(1e30)
    },
    {
        name: "Raising it to a higher dimension",
        description: "Convert your points into dimension points",
        requirement: () => DimensionalPrestige.prestigeCount >= 1,
        rewardDescription: () => `Gain ${format(new Numeric(10))}x points`,
        rewardEffect: new Effect({
            formula: () => new Numeric(10),
            formatter: null,
            type: "mul"
        })
    },
    {
        name: "Antimatter dimensions???",
        description: "Purchase a 1st dimension",
        requirement: () => Dimensions[0].boughtAmount >= 1
    },
    {
        name: "10 dimensional points is still a lot",
        description: "Purchase a 2nd dimension",
        requirement: () => Dimensions[1].boughtAmount >= 1
    },
    {
        name: "A million is a lot",
        description: () => `Have ${format(new Numeric(1e6))} dimensional power`,
        requirement: () => DimensionalPower.gte(1e6)
    },
    {
        name: "Googol",
        description: () => `Get ${format(new Numeric(1e100))} points`,
        requirement: () => Points.gte(1e100),
        rewardDescription:
            "Compressing your points no longer resets point upgrades"
    },
    {
        name: "Dimensional Power-up",
        description: () =>
            `Have ${format(new Numeric(1e15))} dimensional power`,
        requirement: () => DimensionalPower.gte(1e15),
        rewardDescription: "Gain a boost to points based on dimensional power",
        rewardEffect: new Effect({
            formula: () => DimensionalPower.add(1).log10().pow(2).add(1),
            type: "mul"
        })
    },
    {
        name: "Huh?",
        description: "Dimensional without compressing your points",
        requirement: () => false,
        rewardDescription: () =>
            `Reduce dimensional requirement from ${format(new Numeric(1e30))} \
to ${format(new Numeric(1e25))}`
    },
    {
        name: "Skipping the game",
        description: () =>
            `Have the point upgrade multiplier be over ${format(new Numeric(3))}x`,
        requirement: () => PointUpgrade.singularEffect.gte(3)
    },
    {
        name: "(hardcapped)",
        description: "Collapse spacetime",
        requirement: () => SpacetimePrestige.prestigeCount >= 1
    },
    {
        name: "Again",
        description: "Collapse spacetime twice",
        requirement: () => SpacetimePrestige.prestigeCount >= 2
    },
    {
        name: "Why bother?",
        description: "Get the fourth spacetime milestone",
        requirement: () => SpacetimeMilestones.autoCompressedPoints.completed,
        rewardDescription: () =>
            `Gain ${format(new Numeric(10))}x more compressed points`,
        rewardEffect: new Effect({
            formula: () => new Numeric(10),
            formatter: null,
            type: "mul"
        })
    },
    {
        name: "That's FAST!",
        description: "Spacetime in under 20 seconds",
        requirement: () => SpacetimePrestige.fastestSpacetime < 20,
        rewardDescription: "Point upgrade autobuyer bulk buys"
    },
    {
        name: "Halfway there!",
        description: () =>
            `Get ${format(INFINITY.sqrt())} points without having dimensional power`,
        requirement: () => Points.gte(INFINITY.sqrt()) && DimensionalPower.eq(0)
    },
    {
        name: "Scarily fast",
        description: "Spacetime under 10 seconds",
        requirement: () => SpacetimePrestige.fastestSpacetime < 10
    },
    {
        name: "This mile took a spacetime",
        description: "Complete all spacetime milestones",
        requirement: () => SpacetimeMilestones.autoSpacetime.completed
    },
    {
        name: "I AM RICH",
        description: "Purchase all spacetime upgrades",
        requirement: () =>
            Object.values(SpacetimeUpgrades).every((upg) => upg.boughtAmount)
    },
    {
        name: "Breaking the fourth wall",
        description: "Tear spacetime",
        requirement: () => TearSpacetime.tore
    },
    {
        name: "Huh???",
        description: "Spacetime without performing a dimensional reset",
        requirement: () => false,
        rewardDescription: () =>
            "Gain a multiplier to points based on dimensional points",
        rewardEffect: new Effect({
            formula: () => DimensionalPoints.pow(0.125).add(1),
            type: "mul"
        })
    }
] as const;
