import type { ThemeData } from "./config";

export const DarkTheme = {
    name: "Dark",
    buttons: {
        unstyled: {
            normal: { backgroundColor: "#303030" },
            hovered: { backgroundColor: "#282828", color: "#aaaaaa" },
            disabled: { backgroundColor: "#202020", color: "#808080" }
        },
        darkMatter: {
            normal: {
                backgroundColor: "white",
                color: "black",
                borderColor: "black"
            },
            hovered: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            disabled: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            global: { transition: "all 0.5s", padding: "1.25vw" }
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
            unpurchasable: { backgroundColor: "#202020", color: "#6e6e6e" },
            purchased: { backgroundColor: "#111111" }
        },
        spacetime: {
            purchased: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            global: { transition: "0.5s all", padding: "1.5vw" }
        },
        darkMatter: {
            normal: {
                backgroundColor: "white",
                color: "black",
                borderColor: "black"
            },
            hovered: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            unpurchasable: {
                backgroundColor: "black",
                color: "white",
                borderColor: "white"
            },
            global: { transition: "all 0.5s", padding: "1.25vw" }
        }
    },
    body: {
        backgroundColor: "#101010",
        color: "#d8d8d8",
        borderColor: "white"
    },
    elements: {}
} as const satisfies ThemeData;
