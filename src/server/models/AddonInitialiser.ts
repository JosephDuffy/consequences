import * as fs from "mz/fs";
import * as path from "path";
import { Addon, Metadata } from "./Addon";

export interface AddonInitialiser {

    name: string;

    description: string;

    config?: ConfigOption[];

    createInstance(metadata: Metadata, config?: any): Promise<Addon>

}

export interface ConfigOption {
    name: string;
    type: ConfigOptionType;
    hint?: string;
    defaultValue?: any;
}

export type ConfigOptionType = "bool" | "string" | "url" | "number";

export function validateAddonInitialiser(arg: any): arg is AddonInitialiser {
    return typeof arg.name === "string" &&
           typeof arg.description === "string" &&
           typeof arg.createInstance === "function";
}

export default AddonInitialiser;
