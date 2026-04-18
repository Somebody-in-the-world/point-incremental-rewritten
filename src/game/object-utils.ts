import Decimal from "break_eternity.js";

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type HasProp<T, K extends string> = K extends keyof T ? true : false;

/* eslint-disable @typescript-eslint/no-explicit-any */
export function mergeObjects(
    dest: Record<string, any>,
    src: Record<string, any>
): typeof dest & typeof src {
    const result = { ...dest };
    for (const prop in src) {
        const value = src[prop];
        if (value instanceof Decimal) {
            result[prop] = value;
            continue;
        }
        if (
            typeof value === "object" &&
            !Array.isArray(value) &&
            value !== null
        ) {
            result[prop] = mergeObjects(result[prop], value);
        } else if (Array.isArray(value)) {
            result[prop] = mergeArrays(result[prop], value);
        } else {
            result[prop] = value;
        }
    }
    return result;
}

export function mergeArrays(
    dest: unknown[],
    src: unknown[]
): typeof dest & typeof src {
    const result = [];
    for (const idx in dest) {
        result.push(Number(idx) >= src.length ? dest[idx] : src[idx]);
    }
    return result;
}

export function mapObject<TObject extends Record<string, any>, TReturn>(
    obj: TObject,
    fn: <K extends keyof TObject>(value: TObject[K], key: K) => TReturn
): {
    [K in keyof TObject]: TReturn;
} {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            fn(value, key as keyof TObject)
        ])
    ) as any;
}
