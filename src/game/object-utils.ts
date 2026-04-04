import Decimal from "break_eternity.js";

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

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
        if (typeof value === "object" && !Array.isArray(value)) {
            mergeObjects(result[prop], value);
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

export function typedArrayFromConfig<
    T extends new (config: unknown, id: string) => any
>(configs: Record<string, object>, type: T): Record<string, InstanceType<T>> {
    const pairs = Object.entries(configs);
    const result: Record<string, InstanceType<T>> = {};
    for (const [id, config] of pairs) {
        result[id] = new type(config, id);
    }
    return result;
}
