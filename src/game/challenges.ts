import type { Currency } from "./core/currency";
import { calculatedEffectGetter, type Effect } from "./core/effect";
import { Numeric } from "./core/numeric";
import { CurrentTheme } from "./themes";

export interface ChallengeConfig {
    description: string;
    requirement: Numeric;
    resetFunction?: () => void;
    currency?: Currency;
    rewardDescription: string;
    rewardEffect?: Effect;
    id?: number;
}

interface ChallengeMapPlayerConfig {
    running: boolean;
    completed: boolean;
}

export abstract class Challenge<T extends ChallengeConfig = ChallengeConfig> {
    constructor(
        public config: T,
        public id: string
    ) {}
    abstract get running(): boolean;
    abstract set running(value);
    abstract get completed(): boolean;
    abstract set completed(value);

    protected readonly namePrefix: string = "Challenge";

    readonly stylePreset: Parameters<typeof CurrentTheme.elements>[0] =
        "unstyled";
    readonly buttonStylePreset: Parameters<typeof CurrentTheme.buttons>[0] =
        "unstyled";

    get description() {
        return this.config.description;
    }

    get name() {
        return this.namePrefix;
    }

    get currency() {
        if (!this.config.currency) {
            throw new Error("currency not defined in config");
        }
        return this.config.currency;
    }

    get requirement() {
        return this.config.requirement;
    }

    protected reset() {
        if (!this.config.resetFunction) {
            throw new Error("resetFunction not defined in config");
        }
        return this.config.resetFunction();
    }

    get canComplete() {
        return this.currency.gte(this.requirement) && this.running;
    }

    get unlocked() {
        return true;
    }

    get rewardDescription() {
        return this.config.rewardDescription;
    }

    get rewardEffect() {
        return calculatedEffectGetter(this.config.rewardEffect, () =>
            Number(this.completed)
        );
    }

    enter() {
        this.reset();
        this.running = true;
    }

    exit() {
        this.beforeExit();
        this.reset();
    }

    beforeExit() {
        if (this.canComplete) this.completed = true;
    }
}

const DEFAULT_PLAYER_CONFIG = {
    running: false,
    completed: false
} as const satisfies ChallengeMapPlayerConfig;

export abstract class ChallengeMap<
    T extends ChallengeConfig = ChallengeConfig
> extends Challenge<T> {
    constructor(
        public config: T,
        public id: string,
        public numericID: number
    ) {
        super(config, id);
    }

    abstract get map(): Record<string, ChallengeMapPlayerConfig | undefined>;

    get name() {
        return `${this.namePrefix} ${this.numericID + 1}`;
    }

    private get playerConfig() {
        return this.map[this.id];
    }

    private set playerConfig(value) {
        this.map[this.id] = value;
    }

    get running() {
        return this.map[this.id]?.running ?? false;
    }

    set running(value) {
        if (!this.playerConfig) {
            this.playerConfig = { ...DEFAULT_PLAYER_CONFIG };
        }
        this.playerConfig.running = value;
    }

    get completed() {
        return this.map[this.id]?.completed ?? false;
    }

    set completed(value) {
        if (!this.playerConfig) {
            this.playerConfig = { ...DEFAULT_PLAYER_CONFIG };
        }
        this.playerConfig.completed = value;
    }
}

export function withChallengeRequirements(
    original: Numeric,
    challenges: Record<string, Challenge>
) {
    let requirement = original;
    Object.values(challenges).forEach((chall) => {
        if (chall.running) requirement = chall.requirement;
    });
    return requirement;
}
