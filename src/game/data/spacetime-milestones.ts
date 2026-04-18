import type { SpacetimeMilestoneConfig } from "../spacetime/spacetime-milestones";

export const spacetimeMilestonesData = {
    pointUpgradeAutobuyer: {
        requirement: 1,
        rewardDescription: "Unlock point upgrade autobuyer"
    },
    startingAutomationPoints: {
        requirement: 2,
        rewardDescription:
            "Start every dimensional and spacetime reset with automation points unlocked and 100 automation points"
    },
    autoAutomationPoints: {
        requirement: 5,
        rewardDescription:
            "Gain 10% of automation points you would normally gain per second"
    },
    autoCompressedPoints: {
        requirement: 10,
        rewardDescription:
            "Gain 10% of compressed points you would normally gain per second"
    }
} as const satisfies Record<string, SpacetimeMilestoneConfig>;
