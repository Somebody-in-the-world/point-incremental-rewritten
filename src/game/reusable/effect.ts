import { format } from "../format";
import { Numeric, type NumericSource } from "./numeric";

type EffectFormula = ((boughtAmount: number) => Numeric) | (() => Numeric);
type EffectFormatter = (effect: Numeric) => string;
type EffectType = keyof {
    [K in keyof Numeric as Numeric[K] extends (other: NumericSource) => Numeric
        ? K
        : never]: Numeric[K];
};

interface EffectConfig {
    formula: EffectFormula;
    formatter?: EffectFormatter | null;
    type: EffectType;
}

export class Effect {
    constructor(public config: EffectConfig) {}

    get formula() {
        return this.config.formula;
    }

    get formatter() {
        if (this.config.formatter !== undefined) {
            return this.config.formatter;
        }
        switch (this.type) {
            case "mul":
                return EffectFormatters.MULTIPLY;
            case "add":
                return EffectFormatters.ADD;
            case "sub":
                return EffectFormatters.SUB;
            // TODO: Add more formatters
        }
        throw new ReferenceError("formatter does not exist");
    }

    get value(): Numeric | null {
        if (this.formula.length === 0) {
            return (this.formula as () => Numeric)();
        } else {
            throw new Error("Effect formula requires boughtAmount");
        }
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
    MULTIPLY: (effect: Numeric) => `${format(effect)}x`,
    ADD: (effect: Numeric) =>
        `+${format(effect, { fixedDigitsBelowThousand: false })}`,
    SUB: (effect: Numeric) =>
        `-${format(effect, { fixedDigitsBelowThousand: false })}`
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

export function shouldDisplayEffect(effect?: Effect | null) {
    if (effect === null || effect === undefined) return false;
    return effect.formatter !== null;
}
