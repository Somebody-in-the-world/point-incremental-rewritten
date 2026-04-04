import { achievementData } from "./data/achievements";
import { EventBus, GameEvent } from "./event-bus";
import { player } from "./player";
import { Milestone, type MilestoneConfig } from "./reusable/milestone";

export class Achievement extends Milestone {
    constructor(
        public config: MilestoneConfig,
        public id: number
    ) {
        super(config, id);
    }

    get unlocked() {
        return player.achievements[this.id] ?? false;
    }

    get row() {
        return Math.floor(this.id / 8);
    }

    get col() {
        return this.id % 8;
    }

    get displayedID() {
        return `a${this.row + 1}${this.col + 1}`;
    }

    unlock() {
        if (this.unlocked) return;
        player.achievements[this.id] = true;
        EventBus.dispatch(GameEvent.ACHIEVEMENT_UNLOCK);
    }
}

class AchievementArray extends Array<Achievement> {
    getByID(id: string): Achievement {
        const match = id.match(/^a(\d+)(\d)$/);
        if (match === null) {
            throw new ReferenceError(`Invalid achievement ID: ${id}`);
        }
        const row = Number(match[1]) - 1;
        const col = Number(match[2]) - 1;
        const ach = this[row * 8 + col];
        if (!ach) throw new ReferenceError(`Invalid achievement ID: ${id}`);
        return ach;
    }

    unlock() {
        for (const achievement of this) {
            if (achievement.config.unlockRequirement()) {
                achievement.unlock();
            }
        }
    }
}

export const Achievements = new AchievementArray(
    ...achievementData.map((config, index) => new Achievement(config, index))
);
