import { CurrentTheme } from "../themes";
import type { Currency } from "./currency";
import { calculatedEffectGetter, type Effect } from "./effect";
import { Numeric } from "./numeric";

interface BasePurchasableConfig {
    description: string;
    effect?: Effect;
    unlockCondition?: () => boolean;
    cap?: number;
    reduceCurrency?: boolean;
    purchaseFunc?: () => void;
}

interface RepeatablePurchasableConfig extends BasePurchasableConfig {
    cost: (boughtAmount: number) => Numeric;
    repeatable: true;
}

interface NonRepeatablePurchasableConfig extends BasePurchasableConfig {
    cost: Numeric;
    repeatable?: false;
}

export type PurchasableConfig =
    | RepeatablePurchasableConfig
    | NonRepeatablePurchasableConfig;

export abstract class PurchasableConfigless {
    get effect() {
        return calculatedEffectGetter(
            this.effectObject,
            () => this.boughtAmount
        );
    }

    get stylePreset() {
        return CurrentTheme.purchasable("unstyled");
    }

    get cost() {
        return this.costAt(this.boughtAmount);
    }

    protected abstract calculateCost(_boughtAmount: number): Numeric;

    abstract get repeatable(): boolean;
    abstract get currency(): Currency;
    abstract get boughtAmount(): number;
    abstract set boughtAmount(_value: number);

    costAt(boughtAmount: number) {
        return this.calculateCost(boughtAmount);
    }

    get cap() {
        return this.repeatable ? Infinity : 1;
    }

    get reachedCap() {
        return this.boughtAmount >= this.cap;
    }

    get unlocked() {
        return true;
    }

    get description() {
        return "";
    }

    get effectObject(): Effect | null {
        return null;
    }

    protected purchaseFunc() {}

    get canPurchase(): boolean {
        if (this.reachedCap) return false;
        return this.currency.gte(this.cost);
    }

    get reduceCurrency(): boolean {
        return true;
    }

    get bought() {
        return this.boughtAmount >= 1;
    }

    set bought(value) {
        this.boughtAmount = value ? this.boughtAmount : 0;
    }

    purchase() {
        if (!this.canPurchase) return;
        if (this.reduceCurrency) {
            this.currency.amount = this.currency.sub(this.cost);
        }
        this.boughtAmount++;
        this.purchaseFunc();
    }

    bulkPurchase() {
        if (!this.canPurchase) return;
        let amt = 1;
        let total = this.costAt(this.boughtAmount + amt);
        while (this.currency.gte(total)) {
            amt *= 2;
            total = this.costAt(this.boughtAmount + amt);
        }
        if (amt === 1) {
            this.purchase();
            return;
        }
        let low = amt / 2,
            high = amt;
        while (high - low > 1) {
            const mid = Math.floor((high + low) / 2);
            if (this.currency.gte(this.costAt(this.boughtAmount + mid))) {
                low = mid;
            } else {
                high = mid;
            }
        }
        if (this.currency.gte(this.costAt(this.boughtAmount + high))) {
            amt = high;
        } else {
            amt = low;
        }
        while (amt >= 1) {
            total = this.costAt(this.boughtAmount + amt);
            let depth = 1;
            let stopped = false;
            while (total.lte(this.currency)) {
                if (amt - depth === 0) {
                    stopped = true;
                    break;
                }
                const added = this.costAt(this.boughtAmount + amt - depth);
                total = total.add(added);
                if (total.div(added).lt(1e-6)) {
                    stopped = true;
                    break;
                }
                depth++;
            }
            if (!stopped) {
                amt--;
            } else {
                break;
            }
        }
        this.boughtAmount += amt;
        this.currency.amount = this.currency.sub(total);

        if (this.canPurchase) this.bulkPurchase(); // ??? floating point
    }
}

export abstract class Purchasable extends PurchasableConfigless {
    constructor(
        public readonly config: PurchasableConfig,
        public readonly id: number | string
    ) {
        super();
    }

    get stylePreset() {
        return CurrentTheme.purchasable("unstyled");
    }

    calculateCost(boughtAmount: number) {
        return this.config.repeatable
            ? this.config.cost(boughtAmount)
            : this.config.cost;
    }

    get repeatable() {
        return this.config.repeatable ?? false;
    }

    abstract get currency(): Currency;
    abstract get boughtAmount(): number;
    abstract set boughtAmount(_value: number);

    get cap() {
        return this.repeatable ? (this.config.cap ?? Infinity) : 1;
    }

    get unlocked(): boolean {
        if (this.config.unlockCondition) return this.config.unlockCondition();
        return true;
    }

    get description() {
        return this.config.description ?? "";
    }

    get effectObject() {
        if (!this.config.effect) return null;
        return this.config.effect;
    }

    protected purchaseFunc() {
        if (this.config.purchaseFunc) this.config.purchaseFunc();
    }

    get reduceCurrency() {
        return this.config.reduceCurrency ?? true;
    }
}

export abstract class PurchasableMap extends Purchasable {
    constructor(
        public config: PurchasableConfig,
        public readonly id: string
    ) {
        super(config, id);
    }

    protected abstract get map(): Record<string, number>;

    get boughtAmount() {
        return this.map[this.id] ?? 0;
    }

    set boughtAmount(value) {
        this.map[this.id] = value;
    }
}
