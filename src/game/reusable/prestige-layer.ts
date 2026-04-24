import type { Currency } from "./currency";
import type { PrestigeCurrency } from "./prestige-currency";

export abstract class PrestigeLayerCounterless {
    abstract get currency(): PrestigeCurrency;
    abstract get requiredCurrency(): Currency;
    abstract get canPrestige(): boolean;

    abstract reset(): void;

    prestige() {
        if (!this.canPrestige) return;
        this.prePrestige();
        this.currency.gain();
        this.reset();
        this.postPrestige();
    }

    protected prePrestige() {}
    protected postPrestige() {}
}

export abstract class PrestigeLayer extends PrestigeLayerCounterless {
    abstract get prestigeCount(): number;
    abstract set prestigeCount(value: number);

    prestige() {
        if (!this.canPrestige) return;
        this.prePrestige();
        this.currency.gain();
        this.reset();
        this.prestigeCount++;
        this.postPrestige();
    }
}
