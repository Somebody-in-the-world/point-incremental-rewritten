import MainTab from "@/components/tabs/main/MainTab.vue";

/*
import { DimensionalPrestige } from "../dimensional/dimensional";
import { AutomationPointsUnlock } from "../main/automation-points";
import { Progress } from "../progress";
*/
import type { TabConfig } from "../tabs";

export const tabData: TabConfig[] = [
    { name: "Main", component: MainTab }
    /*
    {
        name: "Dimensional",
        component: "DimensionalTab",
        unlockCondition: () =>
            Boolean(
                AutomationPointsUnlock.boughtAmount ||
                DimensionalPrestige.prestigeCount
            )
    },
    {
        name: "Spacetime",
        unlockCondition: () => Progress.reachedSpacetime,
        subtabs: [
            { name: "Upgrades", component: "SpacetimeUpgradesTab" },
            { name: "Milestones", component: "SpacetimeMilestonesTab" }
        ]
    },
    { name: "Achievements", component: "AchievementsTab" }
     */
] as const;
