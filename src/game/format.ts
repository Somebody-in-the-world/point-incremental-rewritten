import Decimal from "break_eternity.js";

import { INFINITY } from "./constants";
import { Numeric, type NumericSource } from "./core/numeric";
import { player } from "./player";

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

function formatNumber(
    num: number,
    isBelowThousand: boolean,
    config: FormatConfig
) {
    if (isBelowThousand) {
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
    return `${formatNumber(mantissa, false, config)}e${exponent}`;
}

function signlessFormat(num: Decimal | number, config: FormatConfig) {
    if (typeof num === "number") {
        if (num < 1000) return formatNumber(num, true, config);
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
    return `${getSign((num as Decimal).sign === -1)}${signlessFormat(num as Decimal | number, config)}`;
}

const alwaysSingular = ["dimensional power", "dark matter"];

export function pluralize(word: string, count: NumericSource) {
    if (alwaysSingular.includes(word.toLowerCase())) {
        return word;
    }
    const isPlural = new Numeric(count).toNumber() !== 1;
    return word + (isPlural ? "s" : "");
}

export function ordinalOf(num: number) {
    let suffix = "th";
    if (Math.floor((num % 100) / 10) !== 2) {
        switch (num) {
            case 1:
                suffix = "st";
                break;
            case 2:
                suffix = "nd";
                break;
            case 3:
                suffix = "rd";
                break;
        }
    }
    return `${num}${suffix}`;
}
