import { Inject, Service } from 'typedi';
import * as uuid from 'uuid/v1';
import * as winston from 'winston';

import Addon from '../interfaces/Addon';
import AddonInitialiser from '../interfaces/AddonInitialiser';
import UserInput from '../interfaces/UserInput';
import AddonsLoader from './AddonsLoader';
import Database, { AddonSchema } from './Database';

@Service()
export default class AddonsManager {

  @Inject()
  private database: Database;

  private _initialisers: { [moduleName: string]: AddonInitialiser };

  private _instances: { [moduleName: string]: Addon[] };

  public get initialisers(): { [moduleName: string]: AddonInitialiser } {
    return this._initialisers;
  }

  public get instances(): { [moduleName: string]: Addon[] } {
    return this._instances;
  }

  constructor() {
    this._initialisers = {};
    this._instances = {};
  }

  public async loadAddons() {
    winston.info('Loading addons');

    const [ addonModules, errors ] = await AddonsLoader.loadAddons();

    errors.forEach(({addonName, error}) => winston.error(`Error loading ${addonName} module.`, error));

    for (const addonModule of addonModules) {
      const { moduleName, initialiser } = addonModule;
      this._initialisers[addonModule.moduleName] = initialiser;

      winston.info(`Loaded addon initialiser for ${initialiser.metadata.name} from ${moduleName}`);
    }

    const addonsToLoad = this.database.retrieveAllAddons();

    for (const addonToLoadInfo of addonsToLoad) {
      const { moduleName } = addonToLoadInfo;
      const initialiser = this._initialisers[moduleName];

      if (!initialiser) {
        winston.warn(`${moduleName} addon is stored in the database but could not be found. Has it been uninstalled?`);
        continue;
      }

      try {
        const instance = await this.loadAddonFromDatabase(addonToLoadInfo, initialiser);

        if (!this._instances[moduleName]) {
          this._instances[moduleName] = [];
        }

        this._instances[moduleName].push(instance);
      } catch (error) {
        winston.error(`Failed to load stored ${moduleName} instance ${addonToLoadInfo.instanceId}`, error);
      }
    }
  }

  public async createNewAddonInstance(moduleName: string, inputs: UserInput.Value[] = []): Promise<Addon> {
    const initialiser = this._initialisers[moduleName];

    if (!initialiser) {
      throw new Error(`No module with the name ${moduleName} was found`);
    }

    if (!initialiser.metadata.supportsMultipleInstances && this._instances[moduleName] && this._instances[moduleName].length > 0) {
      throw new Error(`Cannot create more than one instance of ${initialiser.metadata.name} from ${moduleName}`);
    }

    const metadata: Addon.Metadata = {
      instanceId: uuid(),
      name: initialiser.metadata.name, // TODO: Allow user to change this
      userProvidedInputs: inputs,
    };

    const instance = await this.createAddonInstance(metadata, initialiser, moduleName);

    this.database.createAddon({
      instanceId: metadata.instanceId,
      moduleName,
      displayName: metadata.name,
      userProvidedInputs: inputs,
    });

    return instance;
  }

  public resolveAddon(resolution: AddonResolution): Addon {
    const addonInstances = this.instances[resolution.name];

    if (addonInstances === undefined) {
      throw new Error(`Failed to find module with name ${resolution.name}`);
    }

    if (addonInstances.length === 0) {
      throw new Error(`No instance of addon ${resolution.name} found}`);
    }

    if (resolution.instanceId) {
      const foundInstance = addonInstances.find((instance) => instance.metadata.instanceId === resolution.instanceId);

      if (!foundInstance) {
        throw new Error(`Found ${addonInstances.length} instances for addon ${resolution.name}, but none with instance id ${resolution.instanceId}`);
      }

      return foundInstance;
    } else {
      if (addonInstances.length > 1) {
        throw new Error(`Found ${addonInstances.length} instances for addon ${resolution.name}, but no instance id was provided`);
      }

      return addonInstances[0];
    }

  }

  private async loadAddonFromDatabase(data: AddonSchema, initialiser: AddonInitialiser): Promise<Addon> {
    winston.info(`Attempting to load stored instance of ${data.displayName} from ${data.moduleName}`);

    const metadata: Addon.Metadata = {
      instanceId: data.instanceId,
      name: data.displayName,
      userProvidedInputs: data.userProvidedInputs,
    };

    return this.createAddonInstance(metadata, initialiser, data.moduleName, data.savedData);
  }

  private async createAddonInstance(metadata: Addon.Metadata, initialiser: AddonInitialiser, moduleName: string, savedObject?: object): Promise<Addon> {
    const requiredInputs = (initialiser.metadata.inputs || []).filter(input => input.required);

    const missingInputs = requiredInputs.filter((requiredInput) => {
      return metadata.userProvidedInputs.findIndex((input) => input.uniqueId === requiredInput.uniqueId) === -1;
    });

    if (missingInputs.length > 0) {
      const missingKeysString = missingInputs.map((input) => input.name).join(', ');
      throw new Error(`Attempted to load ${initialiser.metadata.name} from ${moduleName} but required inputs are missing: ${missingKeysString}`);
    }

    const addonId = metadata.instanceId;
    const instance = await initialiser.createInstance(metadata, (dataToSave: object) => {
      this.database.saveAddonData(addonId, dataToSave);
    }, savedObject);

    winston.info(`Created addon instance ${initialiser.metadata.name} from ${moduleName} with id ${addonId}`);

    if (this._instances[moduleName] === undefined) {
      this._instances[moduleName] = [];
    }

    this._instances[moduleName].push(instance);

    return instance;
  }
}

export type AddonResolution = {

  readonly name: string;

  readonly instanceId?: string;
};
