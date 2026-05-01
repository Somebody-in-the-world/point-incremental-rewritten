import Decimal, { type DecimalSource } from "break_eternity.js";

export type NumericSource = Numeric | DecimalSource;

export class Numeric {
    private _value: Decimal | number;

    protected get value() {
        return this._value;
    }

    protected set value(val) {
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

    decimalFn<
        T extends {
            [K in keyof Decimal]: Decimal[K] extends (
                arg: DecimalSource
            ) => unknown
                ? K
                : never;
        }[keyof Decimal]
    >(fn: T, other?: NumericSource): ReturnType<Decimal[T]> {
        return this.toDecimal()[fn](
            Numeric.from(other ?? 0)._value
        ) as ReturnType<Decimal[T]>;
    }

    eq(other: NumericSource) {
        return this.decimalFn("eq", other);
    }

    neq(other: NumericSource) {
        return this.decimalFn("neq", other);
    }

    lt(other: NumericSource) {
        return this.decimalFn("lt", other);
    }

    lte(other: NumericSource) {
        return this.decimalFn("lte", other);
    }

    gt(other: NumericSource) {
        return this.decimalFn("gt", other);
    }

    gte(other: NumericSource) {
        return this.decimalFn("gte", other);
    }

    add(other: NumericSource) {
        return new Numeric(this.decimalFn("add", other));
    }

    sub(other: NumericSource) {
        return new Numeric(this.decimalFn("sub", other));
    }

    mul(other: NumericSource) {
        return new Numeric(this.decimalFn("mul", other));
    }

    div(other: NumericSource) {
        return new Numeric(this.decimalFn("div", other));
    }

    pow(other: NumericSource) {
        return new Numeric(this.decimalFn("pow", other));
    }

    sqrt() {
        return new Numeric(this.decimalFn("sqrt"));
    }

    abs() {
        return new Numeric(this.decimalFn("abs"));
    }

    floor() {
        return new Numeric(this.decimalFn("floor"));
    }

    ceil() {
        return new Numeric(this.decimalFn("ceil"));
    }

    log10() {
        return new Numeric(this.decimalFn("log10"));
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

    toString() {
        return this._value.toString();
    }
}
