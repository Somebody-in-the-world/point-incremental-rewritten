import { format } from "../format";
import { Numeric, type NumericSource } from "./numeric";

type EffectFormula = (boughtAmount?: number) => Numeric;
type EffectFormatter = (effect: Numeric) => string;
type EffectType = keyof {
    [K in keyof Numeric as Numeric[K] extends (other: NumericSource) => Numeric
        ? K
        : never]: Numeric[K];
};

interface EffectConfig {
    formula: EffectFormula;
    formatter?: EffectFormatter;
    type: EffectType;
}

export class Effect {
    constructor(public config: EffectConfig) {}

    get formula() {
        return this.config.formula;
    }

    get formatter() {
        if (this.config.formatter) {
            return this.config.formatter;
        }
        switch (this.type) {
            case "mul":
                return EffectFormatters.MULTIPLY;
            // TODO: Add more formatters
        }
        throw new ReferenceError("formatter does not exist");
    }

    get value(): Numeric | null {
        return this.formula();
    }

    get type() {
        return this.config.type;
    }
}

export class CalculatedEffect extends Effect {
    constructor(
        public config: EffectConfig,
        private boughtAmountGetter: () => number
    ) {
        super(config);
    }

    get boughtAmount() {
        return this.boughtAmountGetter();
    }

    get value() {
        return this.boughtAmount ? this.formula(this.boughtAmount) : null;
    }
}

export const EffectFormatters = {
    MULTIPLY: (effect: Numeric) => `${format(effect)}x`
} satisfies Record<string, EffectFormatter>;

export function withEffects(num: Numeric) {
    return {
        value: num,
        apply(effect: Effect) {
            if (effect.value !== null) {
                this.value = this.value[effect.type](effect.value);
            }
            return this;
        }
    };
}
