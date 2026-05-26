import { Numeric } from "../core/numeric";
import type { DarkGeneratorConfig } from "../dark-matter/dark-generator";

export const darkGeneratorsData = [
    {
        baseCost: new Numeric(1e15),
        costMultiplier: new Numeric(1e3),
        requirement: new Numeric("1e3000"),
        multiplier: new Numeric(10)
    },
    {
        baseCost: new Numeric(1e30),
        costMultiplier: new Numeric(1e5),
        requirement: new Numeric("1e6350"),
        multiplier: new Numeric(12)
    },
    {
        baseCost: new Numeric(1e60),
        costMultiplier: new Numeric(1e10),
        requirement: new Numeric("1e11750"),
        multiplier: new Numeric(15)
    },
    {
        baseCost: new Numeric(1e100),
        costMultiplier: new Numeric(1e15),
        requirement: new Numeric("1e18500"),
        multiplier: new Numeric(20)
    }
] as const satisfies DarkGeneratorConfig[];
