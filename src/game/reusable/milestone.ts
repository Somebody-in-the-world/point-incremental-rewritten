import { Themes } from "../themes";
import type { Effect } from "./effect";

export interface MilestoneConfig {
    name: string;
    description: string | (() => string);
    unlockRequirement: () => boolean;
    rewardDescription?: string | (() => string);
    rewardEffect?: Effect;
}

export abstract class Milestone {
    constructor(
        public config: MilestoneConfig,
        public id: string | number
    ) {}

    get stylePreset() {
        return Themes.current.milestones("unstyled");
    }

    get name() {
        return this.config.name;
    }

    get description() {
        if (typeof this.config.description === "function") {
            return this.config.description();
        }
        return this.config.description;
    }

    get rewardDescription() {
        const description = this.config.rewardDescription;
        if (!description) return null;
        if (typeof description === "function") {
            return description();
        }
        return description;
    }

    get rewardEffectObject() {
        return this.config.rewardEffect ?? null;
    }

    get rewardEffect() {
        if (!this.rewardEffectObject) return null;
        return this.rewardEffectObject.formula();
    }

    abstract get unlocked(): boolean;
    abstract unlock(): void;
}
