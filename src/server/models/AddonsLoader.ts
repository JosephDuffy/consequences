import exec from "../helpers/exec";
import * as fs from "mz/fs";
import * as path from "path";
import Addon from "./Addon";
import { Package, validatePackage } from "./Package";
import { AddonInitialiser, validateAddonInitialiser } from "./AddonInitialiser";

export default class AddonsLoader {

    static async loadAddons(): Promise<[AddonInitialiser[], Error[]]> {
        let addonInitialisers: AddonInitialiser[] = [];
        let errors: Error[] = [];

        const globalModulesPath = await exec("npm root -g");
        const globalModules = await fs.readdir(globalModulesPath);

        const addonNames = globalModules.filter((moduleName) => {
            return moduleName.startsWith("consequences-");
        });

        for (let addonName of addonNames) {
            try {
                const addonPath = path.join(globalModulesPath, addonName);
                const packageJSON = await this.loadPackageJSON(addonPath, addonName);

                if (validatePackage(packageJSON)) {
                    const mainScriptPath = path.join(addonPath, packageJSON.main);

                    if (!(await fs.exists(mainScriptPath))) {
                        throw new Error(`${addonName}'s main script does not exist`);
                    }

                    const AddonInitialiserType = require(mainScriptPath).default;

                    if (typeof AddonInitialiserType === "function") {
                        const initialiser = new AddonInitialiserType();

                        if (validateAddonInitialiser(initialiser)) {
                            addonInitialisers.push(initialiser);
                        } else {
                            throw new Error(`${addonName}'s main script must export a class that implements AddonInitialiser`);
                        }
                    } else {
                        throw new Error(`${addonName}'s main script's default export must be a function`);
                    }
                } else {
                    throw new Error(`${addonName}'s package.json is missing a required key`);
                }
            } catch (error) {
                errors.push(error);
            }
        }

        return [addonInitialisers, errors];
    }

    static async loadPackageJSON(packagePath: string, packageName: string): Promise<object> {
        const packageJSONPath = path.join(packagePath, "package.json");

        if (!(await fs.exists(packageJSONPath))) {
            throw new Error(`${packageName} does not contain a package.json file`);
        }

        try {
            return JSON.parse(await fs.readFile(packageJSONPath, 'utf8'));
        } catch (error) {
            throw new Error(`${packageName}'s package.json file is not valid JSON. Error: ${error}`);
        }
    }

}