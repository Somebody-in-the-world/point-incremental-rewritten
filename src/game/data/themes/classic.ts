import type { ThemeConfig } from "@/game/themes";

export const ClassicTheme = {
    name: "Classic",
    buttons: {
        unstyled: {
            normal: { backgroundColor: "#e8e8e8" },
            hovered: { backgroundColor: "#cccccc", color: "#202020" },
            disabled: { backgroundColor: "#f0f0f0", color: "#808080" }
        }
    },
    milestones: {
        unstyled: {
            normal: { backgroundColor: "#ff8080" },
            completed: { backgroundColor: "#78e25a" }
        },
        achievements: { normal: { backgroundColor: "#cccccc" } }
    },
    purchasable: {
        unstyled: {
            normal: { backgroundColor: "#e8e8e8" },
            hovered: { backgroundColor: "#cccccc", color: "#202020" },
            unpurchasable: { backgroundColor: "#f0f0f0", color: "#808080" },
            purchased: { backgroundColor: "#cccccc" }
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
    body: { backgroundColor: "white", color: "black", borderColor: "white" }
} as const satisfies ThemeConfig;
