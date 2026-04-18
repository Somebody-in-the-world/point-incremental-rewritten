import { MilestoneConfigless } from "@/game/reusable/milestone";

import { spacetimeMilestonesData } from "../data/spacetime-milestones";
import { pluralize } from "../format";
import { mapObject } from "../object-utils";
import { SpacetimePrestige } from "./spacetime";

export interface SpacetimeMilestoneConfig {
    requirement: number;
    rewardDescription: string;
}

class SpacetimeMilestone extends MilestoneConfigless {
    constructor(
        public config: SpacetimeMilestoneConfig,
        public id: string
    ) {
        super();
    }

    get requirement() {
        return () => SpacetimePrestige.prestigeCount >= this.config.requirement;
    }

    get description() {
        return `Spacetime ${this.config.requirement} ${pluralize("time", Number(this.config.requirement))}`;
    }

    get completed() {
        return this.requirement();
    }

    get rewardDescription() {
        return this.config.rewardDescription;
    }

    complete() {}
}

export const SpacetimeMilestones = mapObject(
    spacetimeMilestonesData,
    (config, id) => new SpacetimeMilestone(config, id)
);
