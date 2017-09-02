import Loki = require('lokijs');

import Addon from './Addon';
import { AddonOptions } from './AddonsManager';
import EventListener from './EventListener';

export default class Database {

  /// The Loki instance backing the database
  private loki: Loki;

  private addons: LokiCollection<AddonSchema>;

  private eventListeners: LokiCollection<EventListener>;

  constructor(filename: string = 'database.json') {
    this.loki = new Loki(filename);

    this.addons = this.loki.addCollection<AddonSchema>('addon-options', {
      indices: ['moduleName'],
    });

    this.eventListeners = this.loki.addCollection<EventListener>('event-listeners', {
      indices: ['moduleId', 'variableId'],
    });
  }

  public retrieveAllAddons(): AddonSchema[] {
    return this.addons.find();
  }

  public createAddon(moduleName: string, options?: Addon.ConfigOption[]) {
    this.addons.insertOne({
      moduleName,
      options,
    });
  }

  public retrieveAllEventListeners(): EventListener[] {
    return this.eventListeners.find();
  }

  public saveEventListener(eventListener: EventListener) {
    this.eventListeners.add(eventListener);
  }

}

export type AddonSchema = {
  moduleName: string;
  options?: AddonOptions;
};
