import type { CSSProperties } from "vue";

import { themesData } from "./data/themes";
import { mapObject } from "./object-utils";
import { player } from "./player";

type StyleState = CSSProperties;
type ButtonStates = "normal" | "hovered" | "disabled";
type PurchasableStates = ButtonStates | "unpurchasable" | "purchased";
type MilestoneStates = "normal" | "completed";

type StyleConfig<T extends string> = {
    [K in T]?: StyleState;
} & { global?: StyleState };
type StylePreset<T extends string> = Record<string, StyleConfig<T>>;
type BaseConfig = StylePreset<string>;
type ButtonConfig = StylePreset<ButtonStates>;
type PurchasableConfig = StylePreset<PurchasableStates>;
type MilestoneConfig = StylePreset<MilestoneStates>;

export interface ThemeConfig {
    name: string;
    buttons: ButtonConfig;
    purchasable: PurchasableConfig;
    milestones: MilestoneConfig;
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
        public styles: BaseConfig,
        public preset: string
    ) {}

    fallbackStylePreset = "unstyled";
    fallbackStyleState = "normal";

    fallbackStyle(state: string, type: keyof CSSProperties) {
        return (
            this.styles[this.preset]?.[state]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[state]?.[type] ??
            this.styles[this.preset]?.[this.fallbackStyleState]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[this.fallbackStyleState]?.[
                type
            ]
        );
    }

    style(state: string) {
        const styles: StyleState = {};
        const definedStyles = this.styles[this.preset]?.[state];
        const fallbackStyles = ["backgroundColor", "color", "borderColor"];
        Object.assign(styles, definedStyles);
        const fallbackValues = Object.fromEntries(
            fallbackStyles
                .filter((fallback) => !styles[fallback as keyof CSSProperties])
                .map((fallback) => [
                    fallback,
                    this.fallbackStyle(state, fallback as keyof CSSProperties)
                ])
        );

        Object.assign(styles, fallbackValues);
        return { ...styles, ...this.global };
    }

    get global() {
        return this.styles[this.preset]?.global ?? {};
    }
}

class ButtonStyles extends BaseStyles {
    constructor(
        public styles: ButtonConfig,
        public preset: string
    ) {
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

class PurchasableStyles extends ButtonStyles {
    constructor(
        public styles: PurchasableConfig,
        public preset: string
    ) {
        super(styles, preset);
    }

    get purchased() {
        return this.style("purchased");
    }

    get unpurchasable() {
        return this.style("unpurchasable");
    }
}

class MilestoneStyles extends BaseStyles {
    constructor(
        public styles: MilestoneConfig,
        public preset: string
    ) {
        super(styles, preset);
    }

    get normal() {
        return this.style("normal");
    }

    get completed() {
        return this.style("completed");
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

    get achievements() {
        return this.milestones("achievements");
    }

    apply() {
        // TODO: Add proper button theming
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
    (theme, id) => new Theme(theme, id)
);
export const CurrentTheme = new (class extends Theme {
    constructor() {
        // theme and id is overriden in getter so passing placeholder
        super(null, "");
    }

    get theme() {
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
