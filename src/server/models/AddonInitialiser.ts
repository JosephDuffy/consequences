import * as fs from "mz/fs";
import * as path from "path";
import { Addon, Metadata } from "../../shared/models/Addon";
import UserInputType from "../../shared/models/UserInputType";

export interface AddonInitialiser {

    name: string;

    description: string;

    config?: ConfigOption[];

    createInstance(metadata: Metadata, config?: any): Promise<Addon>

}

export interface ConfigOption {
    name: string;
    type: UserInputType;
    hint?: string;
    defaultValue?: any;
}

export function validateAddonInitialiser(arg: any): arg is AddonInitialiser {
    return typeof arg.name === "string" &&
           typeof arg.description === "string" &&
           typeof arg.createInstance === "function";
}

export default AddonInitialiser;
