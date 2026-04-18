import { Numeric } from "@/game/reusable/numeric";

import type { DimensionConfig } from "../dimensional/dimensions";

export const dimensionsData: DimensionConfig[] = [
    { baseCost: new Numeric(1), costMultiplier: new Numeric(10) },
    { baseCost: new Numeric(10), costMultiplier: new Numeric(10) },
    { baseCost: new Numeric(1e3), costMultiplier: new Numeric(100) },
    { baseCost: new Numeric(1e5), costMultiplier: new Numeric(100) },
    { baseCost: new Numeric(1e8), costMultiplier: new Numeric(1e3) },
    { baseCost: new Numeric(1e10), costMultiplier: new Numeric(1e3) },
    { baseCost: new Numeric(1e15), costMultiplier: new Numeric(1e4) },
    { baseCost: new Numeric(1e20), costMultiplier: new Numeric(1e5) }
];
