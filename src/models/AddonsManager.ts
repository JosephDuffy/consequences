import { Inject, Service } from 'typedi';
import winston = require('winston');

import Addon from './Addon';
import AddonInitialiser from './AddonInitialiser';
import AddonsLoader from './AddonsLoader';
import Database from './Database';

@Service()
export default class AddonsManager {

  @Inject()
  private database: Database;

  private initialisers: { [moduleName: string]: AddonInitialiser };

  private instances: { [moduleName: string]: AddonInstance[] };

  public get addonStatus(): AddonStatus[] {
    const status: AddonStatus[] = [];

    for (const moduleName of Object.keys(this.initialisers)) {
      const initialiser = this.initialisers[moduleName];

      const instances = (this.instances[moduleName] || []).map((instance) => {
        return {
          metadata: instance.instance.metadata,
          options: instance.options,
        };
      });

      status.push({
        moduleName,
        metadata: initialiser.metadata,
        instances,
      });
    }

    return status;
  }

  constructor() {
    this.initialisers = {};
    this.instances = {};
  }

  public async loadAddons() {
    winston.info('Loading addons');

    const [ addonModules, errors ] = await AddonsLoader.loadAddons();

    errors.forEach((error) => winston.error(error.message));

    for (const addonModule of addonModules) {
      this.initialisers[addonModule.moduleName] = addonModule.initialiser;

      winston.info(`Loaded addon initialiser for ${addonModule.initialiser.metadata.name} from ${addonModule.moduleName}`);
    }

    const addonsToLoad = this.database.retrieveAllAddons();

    for (const addonToLoadInfo of addonsToLoad) {
      const { moduleName, options } = addonToLoadInfo;
      const initialiser = this.initialisers[moduleName];

      if (!initialiser) {
        winston.warn(`${moduleName} addon is stored in the database but could not be found. Has it been uninstalled?`);
        continue;
      }

      const requiredOptions = initialiser.metadata.configOptions.filter(configOption => configOption.required);

      const missingKeys = requiredOptions.filter((requiredOption) => {
        return options && !options.hasKey(requiredOption.id);
      });

      if (missingKeys.length > 0) {
        // We can't load an addon without all of its required options
        const missingKeysString = missingKeys.join(', ');
        winston.warn(`Attempted to load ${initialiser.metadata.name} from ${moduleName} but required options are missing: ${missingKeysString}`);
        continue;
      }

      const metadata: Addon.Metadata = {
        id: moduleName,
        name: initialiser.metadata.name,
      };
      const instance = await initialiser.createInstance(metadata, options);

      if (this.instances[metadata.id] === undefined) {
        this.instances[metadata.id] = [];
      }

      this.instances[metadata.id].push({
        instance,
        options,
      });

      winston.info(`Loaded ${initialiser.metadata.name} from ${moduleName} with id ${metadata.id}`);
    }
  }
}

export interface AddonStatus {
  readonly moduleName: string;

  readonly metadata: AddonInitialiser.Metadata;

  readonly instances: Array<{
    metadata: Addon.Metadata,
    options?: AddonOptions;
  }>;
}

export interface AddonInstance {

  readonly instance: Addon;

  readonly options?: AddonOptions;
}

export type AddonOptions = {
  [id: string]: any;
};
