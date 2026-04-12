import type { ThemeConfig } from "@/game/themes";

import { ClassicTheme } from "./classic";
import { DarkTheme } from "./dark";

export const themesData = {
    classic: ClassicTheme,
    dark: DarkTheme
} as const satisfies Record<string, ThemeConfig>;
