import Loki = require('lokijs');

import EventListener from '../../shared/models/EventListener';

class Database {

    /// The Loki instance backing the database
    private loki: Loki;

    private addonOptions: LokiCollection<AddonOptionsWrapper>;

    private eventListeners: LokiCollection<EventListener>;

    constructor(filename: string = 'database.json') {
        this.loki = new Loki(filename);

        this.addonOptions = this.loki.addCollection<AddonOptionsWrapper>('addon-options', {
            indices: ['moduleName'],
        });

        this.eventListeners = this.loki.addCollection<EventListener>('event-listeners', {
            indices: ['moduleId', 'variableId'],
        });
    }

    optionsForAddon(moduleName: string): AddonOptions | null {
        const storedObject = this.addonOptions.findOne({ moduleName });

        if (storedObject === null) {
            return null;
        }

        return storedObject === null ? null : storedObject.options;
    }

    retrieveAllEventListeners(): EventListener[] {
        return this.eventListeners.find();
    }

    saveEventListener(eventListener: EventListener) {
        this.eventListeners.add(eventListener);
    }

}

export type AddonOptions = {
    [id: string]: any;
};

type AddonOptionsWrapper = {
    moduleName: string;
    options: AddonOptions;
};

export default Database;
