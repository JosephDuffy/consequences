import * as fs from "mz/fs";
import * as path from "path";
import Addon from "../../shared/models/Addon";
import UserInputType from "../../shared/models/UserInputType";

export interface AddonInitialiser {

    name: string;

    description: string;

    configOptions?: Addon.ConfigOption[];

    /**
     * Create and return a new `Addon` instance.
     *
     * @param {Addon.Metadata} metadata
     * @param {{ [id: string]: any; }} [configOptions]
     * @returns {Promise<Addon>}
     * @memberof AddonInitialiser
     */
    createInstance(metadata: Addon.Metadata, configOptions?: { [id: string]: any; }): Promise<Addon>

}

export function validateAddonInitialiser(arg: any): arg is AddonInitialiser {
    return typeof arg.name === "string" &&
           typeof arg.description === "string" &&
           typeof arg.createInstance === "function";
}

export default AddonInitialiser;
