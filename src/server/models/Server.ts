import { Server as HapiServer, ServerConnectionOptions } from 'hapi';
import winston = require('winston');

import createRoutes from '../routes';

import AddonsLoader from './AddonsLoader';
import AddonInitialiser from './AddonInitialiser';
import Addon from '../../shared/models/Addon';
import Database from './Database';

// tslint:disable-next-line:no-var-requires
const Good = require('good');
const GoodWinston = require('good-winston');

class Server {

  private httpServer: HapiServer;
  private database: Database;

  private _addons: Addon[];
  private _addonInitialisers: AddonInitialiser[];

  get addons(): Addon[] {
    return this._addons;
  }

  get addonInitialisers(): AddonInitialiser[] {
    return this._addonInitialisers;
  }

  constructor() {
    this.httpServer = new HapiServer({
        debug: {
            request: ['error']
        }
    });

    this.database = new Database();

    this._addons = [];
    this._addonInitialisers = [];
  }

  public async start() {
    winston.info('Starting Consequences server');

    await this.loadAddons();

    const options: ServerConnectionOptions = {
      port: 27345,
      host: 'localhost',
      routes: {
        cors: true,
      },
    };

    this.httpServer.connection(options);

    createRoutes(this.httpServer);

    const pluginRegisterError = await this.httpServer.register({
      register: Good,
      options: {
        reporters: {
          winston: [ new GoodWinston({ winston }) ],
        },
      },
    });

    if (pluginRegisterError) {
      throw pluginRegisterError;
    }

    const serverStartError = await this.httpServer.start();

    if (serverStartError) {
      throw serverStartError;
    }

    if (this.httpServer.info) {
      this.httpServer.log('info', `Server running at: ${this.httpServer.info.uri}`);
    }
  }

  private async loadAddons() {
    const [ addonModules, errors ] = await AddonsLoader.loadAddons();

    errors.forEach((error) => winston.error(error.message));

    const addons: Addon[] = [];

    for (const addonModule of addonModules) {
      const { name: moduleName, initialiser } = addonModule;

      try {
        const metadata: Addon.Metadata = {
          id: moduleName,
          name: initialiser.name,
        };
        let addon: Addon;

        if ('configOptions' in initialiser) {
          const storedOptions = this.database.optionsForAddon(name);

          if (storedOptions !== null) {
            const requiredOptions = initialiser.configOptions.filter(configOption => configOption.required);

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
    this._addonInitialisers = addonModules.map(addonModule => addonModule.initialiser);
  }

}

export default Server;
