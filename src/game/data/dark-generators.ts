import { Numeric } from "../core/numeric";
import type { DarkGeneratorConfig } from "../dark-matter/dark-generator";

export const darkGeneratorsData = [
    {
        baseCost: new Numeric(1e15),
        costMultiplier: new Numeric(1e3),
        requirement: new Numeric("1e3000")
    },
    {
        baseCost: new Numeric(1e30),
        costMultiplier: new Numeric(1e5),
        requirement: new Numeric("1e6500")
    },
    {
        baseCost: new Numeric(1e66),
        costMultiplier: new Numeric(1e6),
        requirement: new Numeric("1e12500")
    }
] as const satisfies DarkGeneratorConfig[];
