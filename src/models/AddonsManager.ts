import { Inject, Service } from 'typedi';
import * as winston from 'winston';

import Addon from './Addon';
import AddonInitialiser from './AddonInitialiser';
import AddonsLoader from './AddonsLoader';
import AddonStatus from './AddonStatus';
import Database, { AddonOptions, AddonSchema } from './Database';
import Variable from './Variable';

@Service()
export default class AddonsManager {

  @Inject()
  private database: Database;

  private initialisers: { [moduleName: string]: AddonInitialiser };

  private _instances: { [moduleName: string]: AddonInstance[] };

  private _variables: { [addonId: string]: Variable[] };

  public get addonStatus(): AddonStatus[] {
    const status: AddonStatus[] = [];

    for (const moduleName of Object.keys(this.initialisers)) {
      const initialiser = this.initialisers[moduleName];

      const instances = (this._instances[moduleName] || []).map((instance) => {
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

  public get instances(): { [moduleName: string]: AddonInstance[] } {
    return this._instances;
  }

  public get variables(): { [addonId: string]: Variable[] } {
    return this._variables;
  }

  constructor() {
    this.initialisers = {};
    this._instances = {};
    this._variables = {};
  }

  public async loadAddons() {
    winston.info('Loading addons');

    const [ addonModules, errors ] = await AddonsLoader.loadAddons();

    errors.forEach((error) => winston.error(error.message));

    for (const addonModule of addonModules) {
      const { moduleName, initialiser } = addonModule;
      this.initialisers[addonModule.moduleName] = initialiser;

      winston.info(`Loaded addon initialiser for ${initialiser.metadata.name} from ${moduleName}`);
    }

    const addonsToLoad = this.database.retrieveAllAddons();

    for (const addonToLoadInfo of addonsToLoad) {
      const { moduleName } = addonToLoadInfo;
      const initialiser = this.initialisers[moduleName];

      if (!initialiser) {
        winston.warn(`${moduleName} addon is stored in the database but could not be found. Has it been uninstalled?`);
        continue;
      }

      try {
        const instance = await this.loadAddonFromDatabase(addonToLoadInfo, initialiser);
        const instanceId = instance.instance.metadata.instanceId;

        if (!this._instances[instanceId]) {
          this._instances[instanceId] = [];
        }

        this._instances[instanceId].push(instance);
      } catch (error) {
        winston.error(error);
      }
    }
  }

  public async createNewAddonInstance(moduleName: string, options?: AddonOptions): Promise<AddonInstance> {
    const initialiser = this.initialisers[moduleName];

    if (!initialiser) {
      throw new Error(`No module with the name ${moduleName} was found`);
    }

    if (!initialiser.metadata.supportsMultipleInstances && this._instances[moduleName] && this._instances[moduleName].length > 0) {
      throw new Error(`Cannot create more than one instance of ${initialiser.metadata.name} from ${moduleName}`);
    }

    const metadata: Addon.Metadata = {
      instanceId: moduleName, // TODO: Generate a unique id
      name: initialiser.metadata.name, // TODO: Allow user to change this
    };

    const instance = await this.createAddonInstance(metadata, options, initialiser, moduleName);

    this.database.createAddon({
      instanceId: metadata.instanceId,
      moduleName,
      displayName: metadata.name,
      options,
    });

    return instance;
  }

  private async loadAddonFromDatabase(data: AddonSchema, initialiser: AddonInitialiser): Promise<AddonInstance> {
    winston.info(`Attempting to load stored instance of ${data.displayName} from ${data.moduleName}`);

    const metadata: Addon.Metadata = {
      instanceId: data.instanceId,
      name: data.displayName,
    };

    return this.createAddonInstance(metadata, data.options, initialiser, data.moduleName);
  }

  private async createAddonInstance(metadata: Addon.Metadata, options: AddonOptions, initialiser: AddonInitialiser, moduleName: string): Promise<AddonInstance> {
    const requiredOptions = (initialiser.metadata.configOptions || []).filter(configOption => configOption.required);

    const missingKeys = requiredOptions.filter((requiredOption) => {
      return options && !options.hasKey(requiredOption.id);
    });

    if (missingKeys.length > 0) {
      const missingKeysString = missingKeys.join(', ');
      throw new Error(`Attempted to load ${initialiser.metadata.name} from ${moduleName} but required options are missing: ${missingKeysString}`);
    }

    const addonInstance = await initialiser.createInstance(metadata, options);
    const addonId = metadata.instanceId;

    winston.info(`Created addon instance ${initialiser.metadata.name} from ${moduleName} with id ${addonId}`);

    if (addonInstance.loadVariables) {
      if (addonInstance.onVariableAdded) {
        addonInstance.onVariableAdded = this.createVariableAddedFunction(addonInstance);
      }

      if (addonInstance.onVariableRemoved) {
        addonInstance.onVariableRemoved = this.createVariableRemovedFunction(addonInstance);
      }

      this._variables[addonId] = await addonInstance.loadVariables();
    }

    if (this._instances[metadata.instanceId] === undefined) {
      this._instances[metadata.instanceId] = [];
    }

    const storedInstance = {
      instance: addonInstance,
      options,
    };

    this._instances[addonInstance.metadata.instanceId].push(storedInstance);

    return storedInstance;
  }

  private createVariableAddedFunction(addon: Addon): (variable: Variable) => void {
    const addonId = addon.metadata.instanceId;

    return (variable: Variable) => {
      if (!this._variables.hasOwnProperty(addonId)) {
        this._variables[addonId] = [];
      }

      this._variables[addonId].push(variable);
    };
  }

  private createVariableRemovedFunction(addon: Addon): (variable: Variable) => void {
    const addonId = addon.metadata.instanceId;

    return (removedVariable: Variable) => {
      if (!this._variables.hasOwnProperty(addonId)) {
        return;
      }

      this._variables[addonId] = this._variables[addonId].filter(variable => variable.uniqueId !== removedVariable.uniqueId);
    };
  }
}

interface AddonInstance {

  readonly instance: Addon;

  readonly options?: AddonOptions;
}
