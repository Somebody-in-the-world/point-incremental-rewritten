import Decimal from "break_eternity.js";

import { Numeric } from "./numeric";

export abstract class Currency extends Numeric {
    name = "";

    get amount(): Numeric {
        return new Numeric(this.value);
    }

    set amount(value) {
        this.value =
            this.value instanceof Decimal
                ? value.toDecimal()
                : value.toNumber();
    }

    abstract override get value(): Decimal | number;
    abstract override set value(value: Decimal | number);

    get gainAmount() {
        return new Numeric(0);
    }

    get continuousGainAmount() {
        return new Numeric(0);
    }

    gain() {
        this.amount = this.add(this.gainAmount);
    }

    continuousGain(deltaTime: number) {
        this.amount = this.add(this.continuousGainAmount.mul(deltaTime));
    }
}
