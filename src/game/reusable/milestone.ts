import { CurrentTheme } from "../themes";
import { CalculatedEffect, type Effect } from "./effect";

export interface MilestoneConfig {
    name?: string;
    description: string | (() => string);
    requirement: () => boolean;
    rewardDescription?: string | (() => string);
    rewardEffect?: Effect;
}

export abstract class MilestoneConfigless {
    private _effect?: CalculatedEffect;

    get rewardEffect() {
        if (!this._effect) {
            if (this.rewardEffectObject) {
                this._effect = new CalculatedEffect(
                    this.rewardEffectObject,
                    () => Number(this.completed)
                );
            } else {
                throw new ReferenceError("effect does not exist");
            }
        }
        return this._effect;
    }

    get stylePreset() {
        return CurrentTheme.milestones("unstyled");
    }

    get name(): string | undefined {
        return undefined;
    }
    abstract get description(): string;

    get rewardDescription(): string | null {
        return null;
    }

    get rewardEffectObject(): Effect | null {
        return null;
    }

    abstract get requirement(): () => boolean;

    abstract get completed(): boolean;
    abstract complete(): void;
}

export abstract class Milestone extends MilestoneConfigless {
    constructor(
        public config: MilestoneConfig,
        public readonly id: string | number
    ) {
        super();
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

    get requirement() {
        return this.config.requirement;
    }
}

export abstract class MilestoneMap extends MilestoneConfigless {
    constructor(
        public config: MilestoneConfig | unknown,
        public readonly id: string
    ) {
        super();
    }

    abstract get map(): Record<string, boolean>;

    get completed() {
        return this.map[this.id] ?? false;
    }

    complete() {
        this.map[this.id] = true;
    }
}
