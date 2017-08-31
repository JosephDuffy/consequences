declare module "consequences/addons" {
    export enum UserInputType {
        boolean = 0,
        string = 1,
        url = 2,
        number = 3,
    }
    export interface Condition {
        /** A unique (to the addon) identifier. This value MUST be consistent across requests and system restarts */
        readonly uniqueId: string;
        /**
         * A user-facing string. Will be used in the format `${inputName} ${conditionName}`
         *
         * e.g. With an input named "On" and a condition named "is true" the result would be "On is true"
         */
        readonly name: string;
        /** An optional array of extra inputs that the user may provide */
        readonly extraInputs?: ConditionInput[];
        /**
         * Checks if the provided input it supported by this condition. If this method
         * indicates that this condition supports the provided input it will be shown to the
         * user
         *
         * @param input The value to check support for
         * @returns `true` if the value is supported, otherwise `false`
         */
        supports(input: any): boolean;
        /**
         * Evaluates the provided input
         *
         * @param input The value to be evaluated
         * @param userInputs An array of extra values input by the user
         * @returns `true` if the condition check passes, otherwise `false`
         */
        evaluate(input: any, userInputs?: UserInput[]): boolean;
    }
    export interface ConditionInput {
        /** A unique (to the the condition) identifier. This value MUST be consistent across requests and system restarts */
        readonly uniqueId: string;
        /** The default value to pre-populate the input field with */
        readonly defaultValue?: any;
        /** A user-facing string to help the user identify the input */
        readonly name?: string;
        /** A user-facing string to provide an extra hint to the user */
        readonly hint?: string;
        /** A flag denoting whether the input requires a value for the condition to evaluated */
        readonly optional: boolean;
        /** The data type to ask the user to input */
        readonly type: UserInputType;
        /**
         * An optional function that can reject a user's input.
         *
         * @param input The user's input value. Will be of type `type`
         * @returns A promise that resolves to string to show to the user in the case of rejection, or null if the input was accepted
         */
        validator?(input: any): Promise<string | null>;
    }
    export interface UserInput {
        /**
         * The unique identifier of the input, as specified by the `ConditionInput`
         *
         * @type {string}
         * @memberof UserInput
         */
        uniqueId: string;
        /**
         * The value the user input
         *
         * @type {*}
         * @memberof UserInput
         */
        value: any;
    }
    export interface Action {
        readonly uniqueId: string;
        perform(userInputs: UserInput[]): void;
    }
    export interface Variable {
        /** A unique (to the addon) identifier. This value MUST be consistent across requests and system restarts */
        readonly uniqueId: string;
        /** The name of the variable */
        readonly name: string;
        /** The current value of the variable */
        readonly currentValue: any;
        /**
         * Adds the provided listener to a list of functions that will be called
         * when the values updates
         * @param listener The function to be called when the value is updated
         */
        addChangeEventListener(listener: () => void): void;
        /**
         * Removed the provided listener from the list of functions that will be called
         * when the values updates
         * @param listener The listener function to be removed from the listeners list
         */
        removeChangeEventListener(listener: () => void): void;
        /**
         * Update the value of the variable
         * @param newValue The new value of the variable
         */
        updateValue?(newValue: any): void;
    }
    export interface Addon {
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
        readonly conditions?: Promise<Condition[]>;
        /**
         * A function that the addon should call when it has added a condition
         *
         * @memberof Addon
         */
        onConditionAdded?: (condition: Condition) => void;
        /**
         * A function that the addon should call when it has removed a condition
         *
         * @memberof Addon
         */
        onConditionRemoved?: (condition: Condition) => void;
    }
    export namespace Addon {
        interface Metadata {
            id: string;
            name: string;
        }
        interface ConfigOption {
            id: string;
            required: boolean;
            name: string;
            type: UserInputType;
            hint?: string;
            defaultValue?: any;
        }
    }
    export interface AddonInitialiser {
        readonly metadata: AddonInitialiser.Metadata;
        /**
         * Create and return a new `Addon` instance.
         *
         * @param {Addon.Metadata} metadata
         * @param {{ [id: string]: any; }} [configOptions]
         * @returns {Promise<Addon>}
         * @memberof AddonInitialiser
         */
        createInstance(metadata: Addon.Metadata, configOptions?: {
            [id: string]: any;
        }): Promise<Addon>;
    }
    export namespace AddonInitialiser {
        interface Metadata {
            readonly name: string;
            readonly description: string;
            readonly configOptions?: Addon.ConfigOption[];
        }
    }
    export interface EventListener {
        /**
         * The unique identifier of the module to load the variable from
         *
         * @type {string}
         * @memberof EventListener
         */
        readonly moduleId: string;
        /**
         * The unique identifier of the variable to be watched for changes
         *
         * @type {string}
         * @memberof EventListener
         */
        readonly variableId: string;
        /**
         * An array of the steps to be performed when the event is triggered.
         *
         * This array is actually a tree structure, enabling for chains of zero or more
         * conditions, eventually leading to a step to be performed, if all the conditions are met.
         *
         * @type {Step[]}
         * @memberof EventListener
         */
        readonly steps: Step[];
    }
    export interface ActionStep {
        actionId: string;
        userInputs: UserInput[];
    }
    export interface ConditionStep {
        conditionId: string;
        userInputs: UserInput[];
        next: Step;
    }
    export type Step = ActionStep | ConditionStep;
    export interface Package {
        name: string;
        description?: string;
        author?: string;
        version: string;
        main: string;
        keywords: string[];
        peerDependencies: string[];
    }
    
}
