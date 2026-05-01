import Decimal from "break_eternity.js";

import { INFINITY } from "./constants";
import { player } from "./player";
import { Numeric, type NumericSource } from "./reusable/numeric";

interface FormatConfig {
    digitsBelowThousand?: number;
    digits?: number;
    fixedDigits?: boolean;
    fixedDigitsBelowThousand?: boolean;
}

function getMantissaFromLog(log: number) {
    return 10 ** (log % 1);
}

function getExponentFromLog(log: number) {
    return Math.floor(log);
}

function toTruncated(num: number, digits: number) {
    const factor = Math.pow(10, digits);
    return String(Math.trunc(num * factor) / factor);
}

function formatNumber(num: number, config: FormatConfig) {
    if (num < 1000) {
        if (config.fixedDigitsBelowThousand ?? true) {
            return num.toFixed(config.digitsBelowThousand ?? 2);
        } else {
            return toTruncated(num, config.digitsBelowThousand ?? 2);
        }
    } else {
        if (config.fixedDigits ?? true) {
            return num.toFixed(config.digits ?? 2);
        } else {
            return toTruncated(num, config.digits ?? 2);
        }
    }
}

function formatScientific(
    mantissa: number,
    exponent: number,
    config: FormatConfig
) {
    return `${formatNumber(mantissa, config)}e${exponent}`;
}

function signlessFormat(num: Decimal | number, config: FormatConfig) {
    if (typeof num === "number") {
        if (num < 1000) return formatNumber(num, config);
        const log = Math.log10(num);
        return formatScientific(
            getMantissaFromLog(log),
            getExponentFromLog(log),
            config
        );
    }
    // i know i used player instead of TearSpacetime but that causes circular imports
    if (num.gte(INFINITY.toDecimal()) && !player.spacetimeTore)
        return "Infinite";
    // TODO: Add formatting support for numbers above 1e9e15
    if (num.layer > 1) return "ERROR";
    if (num.layer === 0) {
        return signlessFormat(num.mag, config);
    }
    return formatScientific(
        getMantissaFromLog(num.mag),
        getExponentFromLog(num.mag),
        config
    );
}

function getSign(isNegative: boolean) {
    return isNegative ? "-" : "";
}

export function format(val: NumericSource, config: FormatConfig = {}) {
    let num = val;
    if (val instanceof Numeric) num = val.toDecimal();
    if (typeof val === "string") num = new Decimal(val);
    if (typeof val === "number") num = new Decimal(val);
    return `${getSign((num as Decimal).sign === -1)}${signlessFormat(num as Decimal, config)}`;
}

const noPluralList = ["dimensional power"];

export function pluralize(word: string, count: NumericSource) {
    if (noPluralList.includes(word.toLowerCase())) {
        return word;
    }
    const isPlural = Numeric.from(count).toNumber() !== 1;
    return word + (isPlural ? "s" : "");
}
