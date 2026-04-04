import type { ThemeConfig } from "@/game/themes";

export const ClassicTheme: ThemeConfig = {
    name: "classic",
    buttons: {
        unstyled: {
            normal: {
                backgroundColor: "#e8e8e8",
                color: "black",
                borderColor: "black"
            },
            hovered: { backgroundColor: "#cccccc", color: "#202020" },
            disabled: { backgroundColor: "#f0f0f0", color: "#808080" }
        }
    },
    milestones: {
        unstyled: {
            normal: {
                color: "black",
                backgroundColor: "#ff8080",
                borderColor: "black"
            },
            unlocked: { backgroundColor: "#78e25a" }
        },
        achievements: { normal: { backgroundColor: "#cccccc" } }
    },
    purchasable: {
        unstyled: {
            normal: {
                backgroundColor: "#e8e8e8",
                color: "black",
                borderColor: "black"
            },
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
    }
};
