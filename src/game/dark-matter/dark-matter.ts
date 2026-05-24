import { Currency } from "../core/currency";
import { Effect } from "../core/effect";
import { Numeric } from "../core/numeric";
import { player } from "../player";
import { DarkGenerators } from "./dark-generator";

export const DarkMatter = new (class extends Currency {
    name = "dark matter";

    get amount() {
        return player.darkMatter;
    }

    set amount(val) {
        player.darkMatter = val;
    }

    get continuousGainAmount() {
        return DarkGenerators[0]?.production ?? new Numeric(0);
    }

    get boostExponent() {
        return 60;
    }

    get effect() {
        return new Effect({
            formula: () => this.add(1).pow(this.boostExponent),
            type: "mul"
        });
    }
})();
