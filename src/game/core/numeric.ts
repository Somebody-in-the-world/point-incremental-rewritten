import Decimal, { type DecimalSource } from "break_eternity.js";

export type NumericSource = Numeric | DecimalSource;

export class Numeric {
    constructor(value?: NumericSource) {
        this._value = Numeric.normalize(value);
    }

    private readonly _value: Decimal;

    protected get value() {
        return this._value;
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
        return this.toDecimal()[fn](new Numeric(other).value) as ReturnType<
            Decimal[T]
        >;
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

    static normalize(value?: NumericSource): Decimal {
        let normalized_value = value;
        if (
            typeof normalized_value === "string" ||
            typeof normalized_value === "number"
        ) {
            normalized_value = new Decimal(normalized_value);
        }
        if (normalized_value instanceof Numeric) {
            normalized_value = normalized_value.value;
        }
        return normalized_value ?? Decimal.dZero;
    }

    static max(a: NumericSource, b: NumericSource) {
        return new Numeric(a).gt(new Numeric(b))
            ? new Numeric(a)
            : new Numeric(b);
    }

    static min(a: NumericSource, b: NumericSource) {
        return new Numeric(a).lt(new Numeric(b))
            ? new Numeric(a)
            : new Numeric(b);
    }

    static from(value?: NumericSource) {
        return value instanceof Numeric ? value : new Numeric(value);
    }

    toDecimal() {
        return this.value;
    }

    toNumber() {
        return this.value.toNumber();
    }

    toString() {
        return this.value.toString();
    }
}
