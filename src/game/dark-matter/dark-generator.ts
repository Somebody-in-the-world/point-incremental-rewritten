import { withEffects } from "../core/effect";
import { Numeric } from "../core/numeric";
import { PurchasableConfigless } from "../core/purchasable";
import { darkGeneratorsData } from "../data/dark-generators";
import { Points } from "../main/points";
import { player } from "../player";
import { SpacetimePoints } from "../spacetime/spacetime";
import { TearSpacetimeUpgrades } from "../spacetime/tear-spacetime";
import { CurrentTheme } from "../themes";

export interface DarkGeneratorConfig {
    baseCost: Numeric;
    costMultiplier: Numeric;
    requirement: Numeric;
}

export class DarkGenerator extends PurchasableConfigless {
    constructor(
        public config: DarkGeneratorConfig,
        public id: number
    ) {
        super();
    }

    get repeatable() {
        return true;
    }

    get stylePreset() {
        return CurrentTheme.purchasable("darkMatter");
    }

    get currency() {
        return SpacetimePoints;
    }

    get description() {
        return `Tier ${this.id + 1} dark generator`;
    }

    get cost() {
        return this.config.baseCost.mul(
            this.config.costMultiplier.pow(this.boughtAmount)
        );
    }

    get unlocked() {
        return getUnlockedDarkGenerators() >= this.id + 1;
    }

    get production(): Numeric {
        if (this.id === 0 && this.boughtAmount === 0) return new Numeric(0);
        return withEffects(
            new Numeric(10)
                .pow(this.boughtAmount)
                .mul(DarkGenerators[this.id + 1]?.production ?? 1)
        ).apply(
            this.id === 0
                ? TearSpacetimeUpgrades.darkMatterSPBoost.effect
                : null
        ).value;
    }

    get requirement() {
        return this.config.requirement;
    }

    get boughtAmount() {
        if (this.id >= player.darkGenerators.length || this.id < 0) {
            throw new ReferenceError(`Invalid dark generator ID: ${this.id}`);
        }
        return player.darkGenerators[this.id]!;
    }

    set boughtAmount(value) {
        player.darkGenerators[this.id] = value;
    }
}

export function getUnlockedDarkGenerators() {
    return player.unlockedDarkGenerators;
}

export function getNextDarkGeneratorRequirement() {
    return DarkGenerators[getUnlockedDarkGenerators()]?.requirement ?? null;
}

export function canUnlockNextDarkGenerator() {
    return Points.gte(getNextDarkGeneratorRequirement() ?? Infinity);
}

export function unlockNextDarkGenerator() {
    if (canUnlockNextDarkGenerator()) {
        player.unlockedDarkGenerators++;
    }
}

export const DarkGenerators = darkGeneratorsData.map(
    (config, id) => new DarkGenerator(config, id)
);
