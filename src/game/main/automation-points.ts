import { Numeric } from "@/game/reusable/numeric";
import { PrestigeCurrency } from "@/game/reusable/prestige-currency";
import { PrestigeLayerCounterless } from "@/game/reusable/prestige-layer";
import { PurchasableConfigless } from "@/game/reusable/purchasable";

import { player } from "../player";
import { SpacetimeMilestones } from "../spacetime/spacetime-milestones";
import { CompressedPoints } from "./compressed-points";

export const AutomationPointsUnlock = new (class extends PurchasableConfigless {
    get repeatable() {
        return false;
    }
    get reduceCurrency() {
        return false;
    }
    get description() {
        return "Unlock automation points";
    }

    get cost() {
        return new Numeric(50);
    }

    get currency() {
        return CompressedPoints;
    }

    get boughtAmount() {
        return player.automationPointsUnlocked;
    }

    set boughtAmount(value) {
        player.automationPointsUnlocked = value;
    }
})();

export const AutomationPoints = new (class extends PrestigeCurrency {
    name = "automation point";
    get value() {
        return player.automationPoints;
    }

    set value(value) {
        player.automationPoints = value;
    }

    get effect() {
        return this.pow(0.6).div(2.5);
    }

    get gainAmount() {
        return CompressedPoints.amount;
    }

    get continuousGainAmount() {
        if (!SpacetimeMilestones.autoAutomationPoints.completed)
            return new Numeric(0);
        return this.gainAmount.div(10);
    }
})();

export const AutomationPointsSacrifice =
    new (class extends PrestigeLayerCounterless {
        currency = AutomationPoints;
        get requiredCurrency() {
            return CompressedPoints;
        }

        reset() {
            CompressedPoints.amount = new Numeric(0);
        }
    })();
