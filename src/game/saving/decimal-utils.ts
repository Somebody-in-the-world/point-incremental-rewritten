import Decimal from "break_eternity.js";

export function isDecimal(value: unknown): value is Decimal {
    if (typeof value !== "object" || Array.isArray(value) || value === null)
        return false;
    const obj = value as Record<string, unknown>;
    return (
        obj.mag !== undefined &&
        obj.layer !== undefined &&
        obj.sign !== undefined
    );
}

export function decimalToComponents(value: Decimal) {
    return { mag: value.mag, layer: value.layer, sign: value.sign };
}

export function recursiveDecimalToObject(obj: Record<string, unknown>) {
    const result: Record<string, unknown> = {};
    for (const prop in obj) {
        const value = obj[prop];
        if (value instanceof Decimal) {
            result[prop] = decimalToComponents(value);
        } else if (typeof value === "object" && value !== null) {
            result[prop] = recursiveDecimalToObject(
                value as Record<string, unknown>
            );
        } else {
            result[prop] = value;
        }
    }
    return result;
}

export function recursiveObjectToDecimal(obj: Record<string, unknown>) {
    const result: Record<string, unknown> = {};
    for (const prop in obj) {
        const value = obj[prop];
        if (isDecimal(value)) {
            result[prop] = Decimal.fromComponents(
                value.sign,
                value.layer,
                value.mag
            );
        } else if (typeof value === "object") {
            result[prop] = recursiveObjectToDecimal(
                value as Record<string, unknown>
            );
        } else {
            result[prop] = value;
        }
    }
    return result;
}
