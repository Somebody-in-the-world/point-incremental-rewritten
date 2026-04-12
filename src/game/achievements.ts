import { achievementData } from "./data/achievements";
import { EventBus, GameEvent } from "./event-bus";
import { player } from "./player";
import { Milestone, type MilestoneConfig } from "./reusable/milestone";
import { CurrentTheme } from "./themes";

export class Achievement extends Milestone {
    constructor(
        public config: MilestoneConfig,
        public id: number
    ) {
        super(config, id);
    }

    get stylePreset() {
        return CurrentTheme.milestones("achievements");
    }

    get completed() {
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

    complete() {
        if (this.completed) return;
        player.achievements[this.id] = true;
        EventBus.dispatch(GameEvent.ACHIEVEMENT_COMPLETE);
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

    get totalCompleted() {
        let total = 0;
        for (const achievement of this) {
            if (achievement.completed) total++;
        }
        return total;
    }

    complete() {
        for (const achievement of this) {
            if (achievement.config.requirement()) {
                achievement.complete();
            }
        }
    }
}

export const Achievements = new AchievementArray(
    ...achievementData.map((config, index) => new Achievement(config, index))
);
