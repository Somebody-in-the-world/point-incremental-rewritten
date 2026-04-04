import { ClassicTheme } from "./data/themes/classic";

type StyleState = Record<string, string>;
type ButtonStates = "normal" | "hovered" | "disabled";
type PurchasableStates = ButtonStates | "unpurchasable" | "purchased";
type MilestoneStates = "normal" | "unlocked";

type StyleConfig<T extends string> = {
    [K in T]?: StyleState;
} & { global?: StyleState };
type StylePreset<T extends string> = Record<string, StyleConfig<T>>;
type BaseConfig = Record<string, Record<string, StyleState>>;
type ButtonConfig = StylePreset<ButtonStates>;
type PurchasableConfig = StylePreset<PurchasableStates>;
type MilestoneConfig = StylePreset<MilestoneStates>;

export interface ThemeConfig {
    name: string;
    buttons: ButtonConfig;
    purchasable: PurchasableConfig;
    milestones: MilestoneConfig;
}

class BaseStyles {
    constructor(
        public styles: BaseConfig,
        public preset: string
    ) {}

    fallbackStylePreset = "unstyled";
    fallbackStyleState = "normal";

    fallbackStyle(state: string, type: string) {
        return (
            this.styles[this.preset]?.[state]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[state]?.[type] ??
            this.styles[this.preset]?.[this.fallbackStyleState]?.[type] ??
            this.styles[this.fallbackStylePreset]?.[this.fallbackStyleState]?.[
                type
            ] ??
            ""
        );
    }

    style(state: string) {
        const styles: StyleState = {};
        const definedStyles = this.styles[this.preset]?.[state];
        const fallbackStyles = ["backgroundColor", "color", "borderColor"];
        for (const style in definedStyles) {
            styles[style] = definedStyles[style] ?? "";
        }
        for (const fallback of fallbackStyles) {
            if (styles[fallback]) continue;
            styles[fallback] = this.fallbackStyle(state, fallback);
        }
        return { ...styles, ...this.global };
    }

    get global() {
        return this.styles[this.preset]?.global ?? {};
    }

    format(state: string) {
        let formatted = "";
        for (const style in this.style(state)) {
            formatted += `${style.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: \
${this.style(state)[style]};`;
        }
        return formatted;
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

    get unlocked() {
        return this.style("unlocked");
    }
}

class Theme {
    constructor(public theme: ThemeConfig) {}

    milestones(preset: string) {
        return new MilestoneStyles(this.theme.milestones, preset);
    }

    buttons(preset: string) {
        return new ButtonStyles(this.theme.buttons, preset);
    }

    purchasable(preset: string) {
        return new PurchasableStyles(this.theme.purchasable, preset);
    }

    get achievements() {
        return this.milestones("achievements");
    }

    apply() {
        // TODO: Add proper button theming
        const buttonColors = new ButtonStyles(this.theme.buttons, "unstyled");

        const stylesheet = document.createElement("style");
        stylesheet.textContent = `
button { ${buttonColors.format("normal")} }
button:hover { ${buttonColors.format("hovered")} }
button:disabled { ${buttonColors.format("disabled")} }
        `;
        document.head.appendChild(stylesheet);
    }
}

class ThemeArray extends Array<Theme> {
    get current() {
        // TODO: Add proper theme support
        return new Theme(ClassicTheme);
    }
}

export const Themes = new ThemeArray(
    ...[ClassicTheme].map((theme) => new Theme(theme))
);
