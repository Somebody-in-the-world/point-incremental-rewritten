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
    },
    dim1To4Auto: {
        requirement: 15,
        rewardDescription: "Unlock autobuyers for dimensions 1-4"
    },
    dim5To8Auto: {
        requirement: 25,
        rewardDescription: "Unlock autobuyers for dimensions 5-8"
    },
    autoDimensional: {
        requirement: 40,
        rewardDescription: "Unlock automatic dimensional"
    },
    autoSpacetime: {
        requirement: 100,
        rewardDescription: "Unlock automatic spacetime"
    }
} as const satisfies Record<string, SpacetimeMilestoneConfig>;
