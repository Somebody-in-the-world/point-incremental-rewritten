import Decimal from "break_eternity.js";

import { INFINITY } from "./constants";
import { Numeric, type NumericSource } from "./reusable/numeric";

function getMantissaFromLog(log: number) {
    return 10 ** (log % 1);
}

function getExponentFromLog(log: number) {
    return Math.floor(log);
}

function formatScientific(mantissa: number, exponent: number, digits: number) {
    return `${mantissa.toFixed(digits)}e${exponent}`;
}

function signlessFormat(num: Decimal | number, digits: number) {
    if (typeof num === "number") {
        if (num < 1000) return num.toFixed(digits);
        const log = Math.log10(num);
        return formatScientific(
            getMantissaFromLog(log),
            getExponentFromLog(log),
            digits
        );
    }
    if (num.gte(INFINITY.asDecimal)) return "Infinite";
    // TODO: Add formatting support for numbers above 1e9e15
    if (num.layer > 1) return "ERROR";
    if (num.layer === 0) {
        return signlessFormat(num.mag, digits);
    }
    return formatScientific(
        getMantissaFromLog(num.mag),
        getExponentFromLog(num.mag),
        digits
    );
}

function getSign(isNegative: boolean) {
    return isNegative ? "-" : "";
}

export function format(val: NumericSource, digits = 2) {
    let num = val;
    if (val instanceof Numeric) num = val.asDecimal;
    if (typeof val === "string") num = new Decimal(val);
    if (typeof val === "number") num = new Decimal(val);
    return `${getSign((num as Decimal).sign === -1)}${signlessFormat(num as Decimal, digits)}`;
}

const noPluralList = ["dimensional power"];

export function pluralize(word: string, count: Numeric) {
    if (noPluralList.includes(word.toLowerCase())) {
        return word;
    }
    const isPlural = count.neq(1);
    return word + (isPlural ? "s" : "");
}
