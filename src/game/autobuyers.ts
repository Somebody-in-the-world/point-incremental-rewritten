import { autobuyersData } from "./data/autobuyers";
import { mapObject } from "./object-utils";
import { player } from "./player";

export type AutobuyerType = "purchase" | "prestige";

export type PlayerAutobuyerConfig = Partial<
    Record<string, { enabled: boolean; inputs: Record<string, string> }>
>;

interface AutobuyerInputConfig {
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: new (...args: any[]) => any;
    defaultValue?: string;
    unlockRequirement?: () => boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AutobuyerConfig<TConfig extends AutobuyerConfig = any> = {
    action: (this: TConfig) => void;
    requirement?: () => boolean;
    name: string;
    inputs?: Record<string, AutobuyerInputConfig>;
    type: AutobuyerType;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Autobuyer<TConfig extends AutobuyerConfig = any> {
    private frameTime = 0;
    private activate = true;

    constructor(
        public config: TConfig,
        public id: string
    ) {
        if (!player.autobuyers[this.id]) {
            const inputs = mapObject(
                this.config?.inputs ?? {},
                (config) => config.defaultValue ?? ""
            );
            player.autobuyers[this.id] = { enabled: false, inputs };
        }
    }

    get playerConfig() {
        return player.autobuyers[this.id]!;
    }

    set playerConfig(config) {
        player.autobuyers[this.id] = config;
    }

    get enabled() {
        return this.playerConfig.enabled;
    }

    set enabled(value) {
        this.playerConfig.enabled = value;
    }

    get inputs(): TConfig["inputs"] extends undefined
        ? Record<never, never>
        : {
              [K in keyof NonNullable<TConfig["inputs"]>]: InstanceType<
                  NonNullable<TConfig["inputs"]>[K]["type"]
              >;
          } {
        const inputs: TConfig["inputs"] = this.config.inputs;
        // typescript so dumb i have to do this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (inputs === undefined) return {} as any;
        return mapObject(
            inputs,
            (input, id) =>
                new input.type(
                    this.playerConfig.inputs[
                        id as keyof typeof this.playerConfig.inputs
                    ]
                )
        );
    }

    inputUnlocked(input: keyof TConfig["inputs"]) {
        return (
            this.config.inputs?.[input as string]?.unlockRequirement?.() ?? true
        );
    }

    get unlocked() {
        return this.config.requirement?.() ?? true;
    }

    get name() {
        return this.config.name;
    }

    private get interval() {
        switch (this.config.type) {
            case "purchase":
                return 0;
            case "prestige":
                return 0.05;
        }
    }

    invoke(deltaTime = 0) {
        if (this.activate) this.config.action.bind(this)();
        this.activate = false;
        this.frameTime += deltaTime;
        if (this.frameTime >= this.interval) {
            this.frameTime = 0;
            this.activate = true;
        }
    }
}

export const Autobuyers = mapObject(
    autobuyersData,
    (config, id) => new Autobuyer(config, id)
) as {
    [K in keyof typeof autobuyersData]: Autobuyer<(typeof autobuyersData)[K]>;
};

export function runAutobuyers(deltaTime: number) {
    Object.values(Autobuyers).forEach((autobuyer) => {
        if (autobuyer.unlocked && autobuyer.enabled) {
            autobuyer.invoke(deltaTime);
        }
    });
}
