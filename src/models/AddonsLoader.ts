import * as fs from 'mz/fs';
import * as path from 'path';
import Addon from './Addon';
import { Package, validatePackage } from './Package';
import exec from '../helpers/exec';
import { AddonInitialiser, validateAddonInitialiser } from './AddonInitialiser';

export type AddonModule = {
  /**
   * The name of the addon's npm module
   *
   * @type {string}
   */
  name: string;

  /**
   * An object that is capable of creating a new instance of the addon and
   * provides some basic metadata about the addon. This object is provided
   * by the addon itself
   *
   * @type {AddonInitialiser}
   */
  initialiser: AddonInitialiser;
};

export default class AddonsLoader {

  public static async globalModulesPath(): Promise<string> {
    return exec('npm root -g');
  }

  public static async loadAddons(): Promise<[AddonModule[], Error[]]> {
    const addons: AddonModule[] = [];
    const errors: Error[] = [];

    const globalModulesPath = await this.globalModulesPath();
    const globalModules = await fs.readdir(globalModulesPath);

    const addonNames = globalModules.filter((moduleName) => {
      return moduleName.startsWith('consequences-');
    });

    for (const addonName of addonNames) {
      try {
        const addon = await this.loadAddon(addonName, globalModulesPath);
        addons.push(addon);
      } catch (error) {
        errors.push(error);
      }
    }

    return [addons, errors];
  }

  public static async loadAddon(name: string, globalModulesPath: string): Promise<AddonModule> {
    const addonPath = path.join(globalModulesPath, name);
    const packageJSON = await this.loadPackageJSON(addonPath, name);

    if (validatePackage(packageJSON)) {
      const mainScriptPath = path.join(addonPath, packageJSON.main);

      if (!(await fs.exists(mainScriptPath))) {
        throw new Error(`${name}'s main script does not exist`);
      }

      // tslint:disable-next-line:variable-name
      const AddonInitialiser = require(mainScriptPath).default;

      if (typeof AddonInitialiser === 'function') {
        const initialiser = new AddonInitialiser();

        if (validateAddonInitialiser(initialiser)) {
          return {
            name,
            initialiser,
          };
        } else {
          throw new Error(`${name}'s main script must export a class that implements AddonInitialiser`);
        }
      } else {
        throw new Error(`${name}'s main script's default export must be a function`);
      }
    } else {
      throw new Error(`${name}'s package.json is missing a required key`);
    }
  }

  private static async loadPackageJSON(packagePath: string, packageName: string): Promise<object> {
    const packageJSONPath = path.join(packagePath, 'package.json');

    if (!(await fs.exists(packageJSONPath))) {
      throw new Error(`${packageName} does not contain a package.json file at expected location: ${packageJSONPath}`);
    }

    try {
      return JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
    } catch (error) {
      throw new Error(`${packageName}'s package.json file is not valid JSON. Error: ${error}`);
    }
  }

}
