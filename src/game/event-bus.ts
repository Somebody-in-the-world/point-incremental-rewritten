export enum GameEvent {
    ACHIEVEMENT_UNLOCK
}

interface GameEventHandler {
    thisObj: object;
    func: (...args: unknown[]) => void;
}

export const EventBus = new (class {
    events: Partial<Record<GameEvent, Array<GameEventHandler>>>;

    constructor() {
        this.events = {};
    }

    on(thisObj: object, event: GameEvent, func: (...args: unknown[]) => void) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push({ func, thisObj });
    }

    dispatch(event: GameEvent, ...args: unknown[]) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => {
            callback.func.apply(callback.thisObj, args);
        });
    }

    remove(thisObj: object) {
        for (const eventID in this.events) {
            const event = Number(eventID) as GameEvent;
            this.events[event] = this.events[event]!.filter(
                (callback) => callback.thisObj !== thisObj
            );
        }
    }
})();
