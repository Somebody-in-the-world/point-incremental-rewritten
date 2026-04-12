import type { ThemeConfig } from "@/game/themes";

export const DarkTheme = {
    name: "Dark",
    buttons: {
        unstyled: {
            normal: { backgroundColor: "#303030", borderColor: "white" },
            hovered: { backgroundColor: "#202020", color: "#dddddd" },
            disabled: { backgroundColor: "#181818", color: "#6e6e6e" }
        }
    },
    milestones: {
        unstyled: {
            normal: { backgroundColor: "#a04040" },
            completed: { backgroundColor: "#008000" }
        },
        achievements: { normal: { backgroundColor: "#808080" } }
    },
    purchasable: {
        unstyled: {
            unpurchasable: { backgroundColor: "#181818", color: "#808080" },
            purchased: { backgroundColor: "#111111" }
        },
        spacetime: {
            purchased: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            global: { transition: "0.5s all", padding: "1.5vw" }
        }
    },
    body: { backgroundColor: "#101010", color: "#d8d8d8", borderColor: "white" }
} as const satisfies ThemeConfig;
