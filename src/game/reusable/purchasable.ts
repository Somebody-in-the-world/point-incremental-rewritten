import { CurrentTheme } from "../themes";
import type { Currency } from "./currency";
import { CalculatedEffect, type Effect } from "./effect";
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

export type PurchasableConfigMap = Record<string, PurchasableConfig>;

export abstract class PurchasableConfigless {
    private _effect?: CalculatedEffect;

    get effect() {
        if (!this._effect) {
            if (this.effectObject) {
                this._effect = new CalculatedEffect(
                    this.effectObject,
                    () => this.boughtAmount
                );
            } else {
                throw new ReferenceError("effect does not exist");
            }
        }
        return this._effect;
    }

    get stylePreset() {
        return CurrentTheme.purchasable("unstyled");
    }

    abstract get cost(): Numeric;
    abstract get repeatable(): boolean;
    abstract get currency(): Currency;
    abstract get boughtAmount(): number;
    abstract set boughtAmount(_value: number);

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

    purchase() {
        if (!this.canPurchase) return;
        if (this.reduceCurrency) {
            this.currency.amount = this.currency.sub(this.cost);
        }
        this.boughtAmount++;
        this.purchaseFunc();
    }

    bulkPurchase(maxAmount = Infinity) {
        let amount = 0;
        while (this.canPurchase && amount < maxAmount) {
            this.purchase();
            amount++;
        }
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

    get cost(): Numeric {
        return this.repeatable
            ? (this.config as RepeatablePurchasableConfig).cost(
                  this.boughtAmount
              )
            : (this.config as NonRepeatablePurchasableConfig).cost;
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
