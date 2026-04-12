import AchievementsTab from "@/components/tabs/achievements/AchievementsTab.vue";
import AutobuyersTab from "@/components/tabs/autobuyers/AutobuyersTab.vue";
import DimensionalTab from "@/components/tabs/dimensional/DimensionalTab.vue";
import MainTab from "@/components/tabs/main/MainTab.vue";
import OptionsTab from "@/components/tabs/options/OptionsTab.vue";
import SpacetimeMilestonesTab from "@/components/tabs/spacetime/SpacetimeMilestonesTab.vue";
import SpacetimeUpgradesTab from "@/components/tabs/spacetime/SpacetimeUpgradesTab.vue";

import { Autobuyers } from "../autobuyers";
import { DimensionalPrestige } from "../dimensional/dimensional";
import { AutomationPointsUnlock } from "../main/automation-points";
import { Progress } from "../progress";
import type { TabConfig } from "../tabs";

export const tabData = {
    main: { name: "Main", component: MainTab },
    autobuyers: {
        name: "Autobuyers",
        component: AutobuyersTab,
        unlockCondition: () =>
            Object.values(Autobuyers).some((autobuyer) => autobuyer.unlocked)
    },
    dimensional: {
        name: "Dimensional",
        component: DimensionalTab,
        unlockCondition: () =>
            Boolean(
                AutomationPointsUnlock.boughtAmount ||
                DimensionalPrestige.prestigeCount
            )
    },
    spacetime: {
        name: "Spacetime",
        unlockCondition: () => Progress.reachedSpacetime,
        subtabs: {
            upgrades: { name: "Upgrades", component: SpacetimeUpgradesTab },
            milestones: {
                name: "Milestones",
                component: SpacetimeMilestonesTab
            }
        },
        component: MainTab
    },
    achievements: { name: "Achievements", component: AchievementsTab },
    options: { name: "Options", component: OptionsTab }
} as const satisfies Record<string, TabConfig>;
