import Variable from "../../shared/models/Variable";
import Condition from "../../shared/models/Conditional";
import UserInputType from "../../shared/models/UserInputType";

interface Addon {

    /**
     * An object containing the metadata of the addon, including the id and name
     *
     * N.B.
     * This object is provided to the `AddonInitialiser` and should not be modified
     *
     * @type {Metadata}
     * @memberof Addon
     */
    readonly metadata: Addon.Metadata;



    /**
     * An array of variables this addon provides
     *
     * @type {Promise<Variable[]>}
     * @memberof Addon
     */
    readonly variables?: Promise<Variable[]>;

    /**
     * A function that the addon should call when it has added a variable
     *
     * @memberof Addon
     */
    onVariableAdded?: (variable: Variable) => void;

    /**
     * A function that the addon should call when it has removed a variable
     *
     * @memberof Addon
     */
    onVariableRemoved?: (variable: Variable) => void;

    readonly conditionals?: Promise<Condition[]>;

    /**
     * A function that the addon should call when it has added a conditional
     *
     * @memberof Addon
     */
    onConditionalAdded?: (conditional: Condition) => void;

    /**
     * A function that the addon should call when it has removed a conditional
     *
     * @memberof Addon
     */
    onConditionalRemoved?: (conditional: Condition) => void;

}

namespace Addon {
    export interface Metadata {
        id: string;
        name: string;
    }

    export interface ConfigOption {
        id: string;
        required: boolean;
        name: string;
        type: UserInputType;
        hint?: string;
        defaultValue?: any;
    }
}

export default Addon;
