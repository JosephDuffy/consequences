import winston = require('winston');
import { Inject, Service } from 'typedi';

import Addon from './Addon';
import AddonInitialiser from './AddonInitialiser';
import AddonsLoader from './AddonsLoader';
import Database from './Database';
import Server from './Server';

@Service()
export default class Core {

  @Inject()
  private database: Database;

  @Inject()
  private server: Server;

  private _addons: Addon[];
  private _addonInitialisers: { [moduleName: string]: AddonInitialiser };

  get addons(): Addon[] {
    return this._addons;
  }

  get addonInitialisers(): { [moduleName: string]: AddonInitialiser } {
    return this._addonInitialisers;
  }

  constructor() {
    this._addons = [];
    this._addonInitialisers = {};
  }

  public async start() {
    winston.info('Consequences core starting');

    await this.loadAddons();

    await this.server.start();
  }

  private async loadAddons() {
    winston.info('Loading addons');

    const [ addonModules, errors ] = await AddonsLoader.loadAddons();

    errors.forEach((error) => winston.error(error.message));

    for (const addonModule of addonModules) {
      this._addonInitialisers[addonModule.name] = addonModule.initialiser;
    }

    const addons: Addon[] = [];

    for (const addonModule of addonModules) {
      const { name: moduleName, initialiser } = addonModule;

      try {
        const metadata: Addon.Metadata = {
          id: moduleName,
          name: initialiser.metadata.name,
        };
        let addon: Addon;

        if ('configOptions' in initialiser) {
          const storedOptions = this.database.optionsForAddon(name);

          if (storedOptions !== null) {
            const requiredOptions = initialiser.metadata.configOptions.filter(configOption => configOption.required);

            for (const requiredOption of requiredOptions) {
              if (!storedOptions.hasKey(requiredOption.id)) {
                // We can't load an addon without all of its required options
                continue;
              }
            }
          }

          addon = await initialiser.createInstance(metadata, storedOptions);
        } else {
          addon = await initialiser.createInstance(metadata);
        }

        addons.push(addon);

        winston.info(`Loaded ${metadata.name} addon from ${moduleName}`);
      } catch (error) {
        winston.error(`Unable to load ${moduleName}: ${error}`);
      }
    }

    this._addons = addons;
  }

}
