import type { Currency } from "./currency";
import type { PrestigeCurrency } from "./prestige-currency";

export abstract class PrestigeLayerCounterless {
    abstract get currency(): PrestigeCurrency;
    abstract get requiredCurrency(): Currency;

    abstract reset(): void;

    prestige() {
        this.prePrestige();
        this.currency.gain();
        this.reset();
        this.postPrestige();
    }

    prePrestige() {}
    postPrestige() {}
}

export abstract class PrestigeLayer extends PrestigeLayerCounterless {
    abstract get prestigeCount(): number;
    abstract set prestigeCount(value: number);

    prestige() {
        super.prestige();
        this.prestigeCount++;
    }
}
