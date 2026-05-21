import Decimal from "break_eternity.js";

import { Numeric } from "./numeric";

export abstract class Currency extends Numeric {
    name = "";

    get amount() {
        return Numeric.from(this.value);
    }

    set amount(value) {
        this.value = Numeric.normalize(value);
    }

    abstract override get value(): Decimal;
    abstract override set value(value);

    get gainAmount() {
        return new Numeric(0);
    }

    get continuousGainAmount() {
        return new Numeric(0);
    }

    gain() {
        this.amount = this.add(this.gainAmount);
        this.postGain(this.gainAmount);
    }

    continuousGain(deltaTime: number) {
        this.amount = this.add(this.continuousGainAmount.mul(deltaTime));
        this.postContinousGain(this.continuousGainAmount.mul(deltaTime));
    }

    protected postGain(_gainAmount: Numeric) {}
    protected postContinousGain(_gainAmount: Numeric) {}
}
