import { Numeric } from "@/game/core/numeric";
import { PrestigeCurrency } from "@/game/core/prestige-currency";
import { PrestigeLayerCounterless } from "@/game/core/prestige-layer";
import { PurchasableConfigless } from "@/game/core/purchasable";

import { player } from "../player";
import { SpacetimeChallenges } from "../spacetime/spacetime-challenges";
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
        let exponent = 0.6;
        if (SpacetimeChallenges.noCPAndAP.completed) exponent += 0.025;
        if (SpacetimeChallenges.noCPAndAP.running) {
            return new Numeric(1);
        }
        return this.pow(exponent).div(2.5);
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

        get canPrestige() {
            return CompressedPoints.gt(0);
        }

        reset() {
            CompressedPoints.amount = new Numeric(0);
        }
    })();
