import type { MergeDeep } from "type-fest";
// using CSSProperties provides better typing but slower compilation
// import type { CSSProperties } from "vue";

import { themesData } from "./data/themes";
import { CommonThemeData } from "./data/themes/common";
import type { RawThemeData } from "./data/themes/config";
import { mapObject, mergeObjects } from "./object-utils";
import { player } from "./player";

export type StyleState = /* CSSProperties */ Record<string, string>;
type ButtonStates = "normal" | "hovered" | "disabled";
type PurchasableStates = ButtonStates | "unpurchasable" | "purchased";
type MilestoneStates = "normal" | "completed";

type StylePreset<T extends string> = {
    [K in T]?: StyleState;
} & { global?: StyleState };
type StyleConfig<T extends string> = Record<string, StylePreset<T>>;
export type BasePreset = StylePreset<string>;
export type ButtonPreset = StylePreset<ButtonStates>;
export type PurchasablePreset = StylePreset<PurchasableStates>;
export type MilestonePreset = StylePreset<MilestoneStates>;
export type ElementStylesPreset = StylePreset<"normal">;

type BaseConfig = StyleConfig<string>;
type ButtonConfig = StyleConfig<ButtonStates>;
type PurchasableConfig = StyleConfig<PurchasableStates>;
type MilestoneConfig = StyleConfig<MilestoneStates>;
type ElementStylesConfig = StyleConfig<"normal">;

export interface ThemeConfig {
    name: string;
    buttons: ButtonConfig;
    purchasable: PurchasableConfig;
    milestones: MilestoneConfig;
    elements: ElementStylesConfig;
    global?: StyleState;
    body?: StyleState;
}

function formatStyles(styles: StyleState) {
    let formatted = "";
    for (const style in styles) {
        if (!styles[style as keyof typeof styles]) continue;
        formatted += `${style.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${styles[style as keyof typeof styles]};`;
    }
    return formatted;
}

function addStyleToStylesheet(
    stylesheet: string,
    selector: string,
    styles?: StyleState
) {
    if (!styles) return stylesheet;
    return stylesheet + `${selector} { ${formatStyles(styles)} }\n`;
}

function addStylesToStylesheet(
    stylesheet: string,
    configs: { selector: string; styles?: StyleState }[]
) {
    let styles = stylesheet;
    configs.forEach((config) => {
        styles = addStyleToStylesheet(styles, config.selector, config.styles);
    });
    return styles;
}

class BaseStyles {
    constructor(
        private styles: BaseConfig,
        private preset: string
    ) {}

    private fallbackStylePreset = "unstyled";
    private fallbackStyleState = "normal";

    protected fallbackStyle(state: string, type: keyof StyleState) {
        return (
            this.styles[this.preset]?.[state]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[state]?.[type] ??
            this.styles[this.preset]?.[this.fallbackStyleState]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[this.fallbackStyleState]?.[
                type
            ]
        );
    }

    protected style(state: string) {
        const styles: StyleState = {};
        const definedStyles = this.styles[this.preset]?.[state];
        const fallbackStyles = ["backgroundColor", "color", "borderColor"];
        Object.assign(styles, definedStyles);
        const fallbackValues = Object.fromEntries(
            fallbackStyles
                .filter((fallback) => !styles[fallback as keyof StyleState])
                .map((fallback) => [
                    fallback,
                    this.fallbackStyle(state, fallback as keyof StyleState)
                ])
        );

        Object.assign(styles, fallbackValues);
        return { ...styles, ...this.global };
    }

    get global() {
        return this.styles[this.preset]?.global ?? {};
    }
}

export class ButtonStyles extends BaseStyles {
    constructor(styles: ButtonConfig, preset: string) {
        super(styles, preset);
    }

    get normal() {
        return this.style("normal");
    }

    get hovered() {
        return this.style("hovered");
    }

    get disabled() {
        return this.style("disabled");
    }
}

export class PurchasableStyles extends ButtonStyles {
    constructor(styles: PurchasableConfig, preset: string) {
        super(styles, preset);
    }

    get purchased() {
        return this.style("purchased");
    }

    get unpurchasable() {
        return this.style("unpurchasable");
    }
}

export class MilestoneStyles extends BaseStyles {
    constructor(styles: MilestoneConfig, preset: string) {
        super(styles, preset);
    }

    get normal() {
        return this.style("normal");
    }

    get completed() {
        return this.style("completed");
    }
}

export class ElementStyles extends BaseStyles {
    constructor(styles: ElementStylesConfig, preset: string) {
        super(styles, preset);
    }

    get normal() {
        return this.style("normal");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Theme<TConfig extends ThemeConfig = any> {
    constructor(
        private _theme: TConfig,
        private _id: string
    ) {}

    get theme() {
        return this._theme;
    }

    get name() {
        return this.theme.name;
    }

    get id() {
        return this._id;
    }

    milestones(preset: keyof TConfig["milestones"] & string) {
        return new MilestoneStyles(this.theme.milestones, preset);
    }

    buttons(preset: keyof TConfig["buttons"] & string) {
        return new ButtonStyles(this.theme.buttons, preset);
    }

    purchasable(preset: keyof TConfig["purchasable"] & string) {
        return new PurchasableStyles(this.theme.purchasable, preset);
    }

    elements(preset: keyof TConfig["elements"] & string) {
        return new ElementStyles(this.theme.elements, preset);
    }

    get achievements() {
        return this.milestones("achievements");
    }

    apply() {
        const STYLESHEET_ID = "theme-stylesheet";

        document.getElementById(STYLESHEET_ID)?.remove();

        const buttonColors = new ButtonStyles(this.theme.buttons, "unstyled");

        const stylesheet = document.createElement("style");
        stylesheet.id = STYLESHEET_ID;
        stylesheet.textContent = addStylesToStylesheet(stylesheet.textContent, [
            { selector: "button", styles: buttonColors.normal },
            { selector: "button:hover", styles: buttonColors.hovered },
            { selector: "button:disabled", styles: buttonColors.disabled },
            { selector: "*", styles: this.theme.global },
            { selector: "body", styles: this.theme.body }
        ]);
        document.head.appendChild(stylesheet);
    }
}

export const Themes = mapObject(
    themesData,
    (theme, id) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Theme(mergeObjects(CommonThemeData, theme as any) as any, id)
) as {
    [K in keyof typeof themesData]: Theme<
        MergeDeep<(typeof themesData)[K], typeof CommonThemeData>
    >;
};

export const CurrentTheme = new (class extends Theme<RawThemeData> {
    constructor() {
        // theme and id is overriden in getter so passing placeholder
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(null as any, null as any);
    }

    get theme(): RawThemeData {
        return Themes[this.id].theme;
    }

    get id() {
        return player.options.theme;
    }

    set id(id) {
        player.options.theme = id;
        CurrentTheme.apply();
    }
})();
