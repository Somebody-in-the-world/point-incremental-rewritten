import Decimal, { type DecimalSource } from "break_eternity.js";

export type NumericSource = Numeric | DecimalSource;

export class Numeric {
    private _value: Decimal | number;

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
    }

    constructor(value?: NumericSource) {
        let normalized_value = value;
        if (typeof normalized_value === "string") {
            normalized_value = new Decimal(normalized_value);
        }
        if (normalized_value instanceof Numeric) {
            normalized_value = normalized_value.value;
        }
        this._value = normalized_value ?? 0;
    }

    decimalFn(
        fn: {
            [K in keyof Decimal]: Decimal[K] extends (
                arg: DecimalSource
            ) => unknown
                ? K
                : never;
        }[keyof Decimal],
        other?: NumericSource
    ): ReturnType<Decimal[typeof fn]> {
        let otherDecimal = other ?? 0;
        if (other instanceof Numeric) {
            otherDecimal = other.toDecimal();
        } else if (typeof other === "string") {
            otherDecimal = new Decimal(other);
        }
        return this.toDecimal()[fn](otherDecimal as DecimalSource);
    }

    eq(other: NumericSource): boolean {
        return this.decimalFn("eq", other) as boolean;
    }

    neq(other: NumericSource): boolean {
        return this.decimalFn("neq", other) as boolean;
    }

    lt(other: NumericSource): boolean {
        return this.decimalFn("lt", other) as boolean;
    }

    lte(other: NumericSource): boolean {
        return this.decimalFn("lte", other) as boolean;
    }

    gt(other: NumericSource): boolean {
        return this.decimalFn("gt", other) as boolean;
    }

    gte(other: NumericSource): boolean {
        return this.decimalFn("gte", other) as boolean;
    }

    add(other: NumericSource): Numeric {
        return new Numeric(this.decimalFn("add", other) as Decimal);
    }

    sub(other: NumericSource): Numeric {
        return new Numeric(this.decimalFn("sub", other) as Decimal);
    }

    mul(other: NumericSource): Numeric {
        return new Numeric(this.decimalFn("mul", other) as Decimal);
    }

    div(other: NumericSource): Numeric {
        return new Numeric(this.decimalFn("div", other) as Decimal);
    }

    pow(other: NumericSource): Numeric {
        return new Numeric(this.decimalFn("pow", other) as Decimal);
    }

    sqrt(): Numeric {
        return new Numeric(this.decimalFn("sqrt") as Decimal);
    }

    abs(): Numeric {
        return new Numeric(this.decimalFn("abs") as Decimal);
    }

    floor(): Numeric {
        return new Numeric(this.decimalFn("floor") as Decimal);
    }

    ceil(): Numeric {
        return new Numeric(this.decimalFn("ceil") as Decimal);
    }

    log10(): Numeric {
        return new Numeric(this.decimalFn("log10") as Decimal);
    }

    static max(a: NumericSource, b: NumericSource) {
        return Numeric.from(a).gt(Numeric.from(b))
            ? Numeric.from(a)
            : Numeric.from(b);
    }

    static min(a: NumericSource, b: NumericSource) {
        return Numeric.from(a).lt(Numeric.from(b))
            ? Numeric.from(a)
            : Numeric.from(b);
    }

    static from(value: NumericSource) {
        return value instanceof Numeric ? value : new Numeric(value);
    }

    get isDecimal() {
        return this.value instanceof Decimal;
    }

    toDecimal() {
        return new Decimal(this.value);
    }

    toNumber() {
        if (typeof this.value === "number") return this.value;
        return this.value.toNumber();
    }
}
