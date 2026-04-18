import { Currency } from "@/game/reusable/currency";

import { player } from "../player";
import { Dimensions } from "./dimensions";

export const DimensionalPower = new (class extends Currency {
    name = "dimensional power";

    get value() {
        return player.dimensionalPower;
    }

    set value(value) {
        player.dimensionalPower = value;
    }

    get effect() {
        return this.add(1).log10().div(30);
    }

    get continuousGainAmount() {
        return Dimensions[0]!.generationEffect;
    }
})();
