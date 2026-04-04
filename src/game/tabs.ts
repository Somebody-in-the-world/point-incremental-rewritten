import { reactive, markRaw, type Component } from "vue";

import { tabData } from "./data/tabs";

export interface TabConfig {
    name: string;
    component: Component;
    unlockCondition?: () => boolean;
    subtabs?: TabConfig[];
}

export class Tab {
    subtabs: SubTabArray;

    constructor(
        public config: TabConfig,
        public id: number
    ) {
        const subtabs = this.config.subtabs;
        if (subtabs) {
            this.subtabs = new SubTabArray(
                ...markRawComponents(subtabs).map(
                    (config, id) => new SubTab(config, id, this)
                )
            );
        } else {
            this.subtabs = new SubTabArray();
        }
    }

    get name() {
        return this.config.name;
    }

    get component() {
        return this.config.component;
    }

    get currentSubTab(): SubTab {
        const subtab = this.subtabs.current;
        return subtab;
    }

    enter() {
        Tabs.currentID = this.id;
    }

    get isCurrentTab() {
        return this.id === Tabs.currentID;
    }

    get unlocked() {
        if (!this.config.unlockCondition) return true;
        return this.config.unlockCondition();
    }
}

export class SubTab extends Tab {
    constructor(
        public config: TabConfig,
        public id: number,
        public parent: Tab | SubTab
    ) {
        super(config, id);
    }

    enter() {
        this.parent.subtabs.currentID = this.id;
    }

    get isCurrentTab() {
        return this.id === this.parent.subtabs.currentID;
    }
}

export class TabArray extends Array<Tab> {
    currentID = 0;
    get current(): Tab {
        const tab = this[this.currentID];
        if (!tab) throw new ReferenceError("Current tab not found");
        return tab;
    }

    get currentTabComponent() {
        let tab = this.current;
        while (tab.subtabs.length > 0) {
            tab = tab.currentSubTab;
        }
        return tab.component;
    }
}

export class SubTabArray extends Array<SubTab> {
    currentID = 0;

    get current(): SubTab {
        const tab = this[this.currentID];
        if (!tab) throw new ReferenceError("Current tab not found");
        return tab;
    }
}

function markRawComponents(config: TabConfig[]) {
    return config.map((tab) => ({ ...tab, component: markRaw(tab.component) }));
}

export const Tabs = reactive(
    new TabArray(
        ...markRawComponents(tabData).map((config, id) => new Tab(config, id))
    )
);
