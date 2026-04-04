import { spacetimeMilestonesData } from "../data/spacetime-milestones";
import { pluralize } from "../format";
import { Milestone } from "../reusable/milestone";
import { SpacetimePrestige } from "./spacetime-points";

class SpacetimeMilestone extends Milestone {
    get unlockRequirement() {
        return this.config.unlockRequirement;
    }

    get description() {
        return `Spacetime ${this.unlockRequirement} ${pluralize("time", this.unlockRequirement)}`;
    }

    get unlocked() {
        return SpacetimePrestige.prestigeCount >= this.unlockRequirement;
    }
}

export const SpacetimeMilestones = spacetimeMilestonesData.map(
    (config, id) => new SpacetimeMilestone(config, id)
);
