import { format } from "../format";
import type { Numeric } from "./numeric";

type EffectFormula = (boughtAmount?: number) => Numeric;
type EffectFormatter = (effect: Numeric) => string;

export class Effect {
    constructor(
        public formula: EffectFormula,
        public formatter: EffectFormatter
    ) {}

    static MULTIPLY(effect: Numeric) {
        return `${format(effect)}x`;
    }
}
