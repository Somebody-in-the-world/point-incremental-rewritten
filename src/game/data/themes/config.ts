import type { OmitDeep } from "type-fest";

import type {
    ButtonPreset,
    ElementStylesPreset,
    MilestonePreset,
    PurchasablePreset,
    ThemeConfig
} from "@/game/themes";

import type { CommonThemeData } from "./common";

export interface RawThemeData extends ThemeConfig {
    buttons: {
        unstyled: ButtonPreset;
        spacetime: ButtonPreset;
        darkMatter: ButtonPreset;
    };
    purchasable: {
        unstyled: PurchasablePreset;
        spacetime: PurchasablePreset;
        darkMatter: PurchasablePreset;
    };
    milestones: { unstyled: MilestonePreset; achievements: MilestonePreset };
    elements: { unstyled: ElementStylesPreset; spacetime: ElementStylesPreset };
}

type CommonThemePath<T extends keyof typeof CommonThemeData & string> =
    `${T}.${keyof (typeof CommonThemeData)[T] & string}`;

export type ThemeData = OmitDeep<
    RawThemeData,
    | CommonThemePath<"buttons">
    | CommonThemePath<"purchasable">
    | CommonThemePath<"milestones">
    | CommonThemePath<"elements">
>;
