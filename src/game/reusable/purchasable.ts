import { Themes } from "../themes";
import type { Currency } from "./currency";
import type { Effect } from "./effect";
import { Numeric, type NumericSource } from "./numeric";

export interface PurchasableConfig {
    cost: NumericSource | ((boughtAmount: number) => NumericSource);
    description: string;
    effect?: Effect;
    repeatable?: boolean;
    unlockCondition?: () => boolean;
    cap?: number;
    reduceCurrency?: boolean;
    purchaseFunc?: () => void;
}

export type PurchasableConfigs = Record<string, PurchasableConfig>;

export abstract class Purchasable {
    constructor(
        public config: PurchasableConfig = { cost: 0, description: "" },
        // placeholder for one-time purchasables
        public id: number | string = 0
    ) {}

    get stylePreset() {
        return Themes.current.purchasable("unstyled");
    }

    get cost(): Numeric {
        return new Numeric(
            this.repeatable
                ? (this.config.cost as (boughtAmount: number) => NumericSource)(
                      this.boughtAmount
                  )
                : (this.config.cost as NumericSource)
        );
    }

    get repeatable() {
        return this.config.repeatable;
    }

    abstract get currency(): Currency;
    abstract get boughtAmount(): number;
    abstract set boughtAmount(_value: number);

    get cap() {
        return this.repeatable ? (this.config.cap ?? Infinity) : 1;
    }

    get reachedCap() {
        return this.boughtAmount >= this.cap;
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

    get effect() {
        if (!this.effectObject) {
            throw new ReferenceError("effectObject does not exist");
        }
        return this.effectObject.formula(this.boughtAmount);
    }

    purchaseFunc() {
        if (this.config.purchaseFunc) this.config.purchaseFunc();
    }

    get canPurchase(): boolean {
        if (this.reachedCap) return false;
        return this.currency.gte(this.cost);
    }

    get reduceCurrency(): boolean {
        return this.config.reduceCurrency ?? true;
    }

    purchase() {
        if (!this.canPurchase) return;
        if (this.reduceCurrency) {
            this.currency.amount = this.currency.sub(this.cost);
        }
        this.boughtAmount++;
        if (this.config.purchaseFunc) this.config.purchaseFunc();
    }

    bulkPurchase(maxAmount = Infinity) {
        let amount = 0;
        while (this.canPurchase && amount < maxAmount) {
            this.purchase();
            amount++;
        }
    }
}
