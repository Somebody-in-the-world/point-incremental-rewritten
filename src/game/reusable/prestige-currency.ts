import { Currency } from "./currency";
import { Numeric } from "./numeric";

export abstract class PrestigeCurrency extends Currency {
    get nextRequirement() {
        return new Numeric();
    }
}
