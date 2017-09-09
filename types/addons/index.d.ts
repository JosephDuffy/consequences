declare module "consequences/addons" {
    export enum UserInputType {
        boolean = 0,
        string = 1,
        url = 2,
        number = 3,
    }
    export interface Condition {
        /**
         * A unique (to the addon) identifier. This value MUST be consistent across requests and system restarts
         */
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
         * Checks if the provided input it supported by this condition. This should be a simple
         * type check, e.g. "is a boolean" or "is a known variable"
         *
         * This method may be called twice for the same input -- once with the `Variable` itself
         * and then with the value of the variable.
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
        /**
         * A unique (to the the condition) identifier. This value MUST be consistent across requests and system restarts
         */
        readonly uniqueId: string;
        /**
         * The default value to pre-populate the input field with
         */
        readonly defaultValue?: any;
        /**
         * A user-facing string to help the user identify the input
         */
        readonly name?: string;
        /**
         * A user-facing string to provide an extra hint to the user
         */
        readonly hint?: string;
        /**
         * A flag denoting whether the input requires a value for the condition to evaluated
         */
        readonly optional: boolean;
        /**
         * A flag denoting whether the user is permitted to enter more than 1 value for this input
         */
        readonly allowsMultiple: boolean;
        /**
         * The data type to ask the user to input
         */
        readonly type: UserInputType;
        /**
         * An optional function that can reject a user's input
         *
         * @param input The user's input value. Will be of type `type`
         * @returns A promise that resolves to string to show to the user in the case of rejection, or null if the input was accepted
         */
        validator?(input: any): Promise<string | null>;
    }
    export interface UserInput {
        /**
         * The unique identifier of the input, as specified by the `ConditionInput`
         */
        uniqueId: string;
        /**
         * The value the user input
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
        retrieveValue(): Promise<any>;
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
         *
         * This method may throw, in which case the contents of the error will be displayed to the user and
         * it will be assumed that the value was not updated.
         *
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
         */
        readonly metadata: Addon.Metadata;
        /**
         * An optional function that should load and return any variables the addon has. Once this
         * method has been called the `onVariableAdded` and `onVariableRemoved` functions (if
         * implemented) should start being called.
         *
         * If this method is unimplemented it is assumed that the addon does not offer any variables.
         *
         * @returns {Promise<Variable[]>} A promise that will resolve to an array of variables
         */
        loadVariables?(): Promise<Variable[]>;
        /**
         * A function that the addon must call when it has added a variable
         */
        onVariableAdded?(variable: Variable): void;
        /**
         * A function that the addon must call when it has removed a variable
         */
        onVariableRemoved?(variable: Variable): void;
        /**
         * An optional function that should load and return any conditions the addon has. Once this
         * method has been called the `onConditionAdded` and `onConditionRemoved` functions (if
         * implemented) should start being called.
         *
         * If this method is unimplemented it is assumed that the addon does not offer any conditions.
         *
         * @returns {Promise<Condition[]>} A promise that will resolve to an array of conditions
         */
        loadConditions?(): Promise<Condition[]>;
        /**
         * A function that the addon must call when it has added a condition
         */
        onConditionAdded?(condition: Condition): void;
        /**
         * A function that the addon must call when it has removed a condition
         */
        onConditionRemoved?(condition: Condition): void;
    }
    export namespace Addon {
        interface Metadata {
            /**
             * A unique id for this instance of the addon. This is created by consequences and may change in the future
             */
            readonly instanceId: string;
            /**
             * The name for this instance of the addon. This will default to the value provided by the
             * `AddonInitialiser`, but may be changed by the user.
             */
            readonly name: string;
        }
    }
    export interface AddonInitialiser {
        /**
         * Information about the addon that can be used prior to the addon
         * being setup, along with the information that's required to create
         * a new instance of the addon.
         */
        readonly metadata: AddonInitialiser.Metadata;
        /**
         * Create and return a new `Addon` instance.
         *
         * This method must be implemented by addon authors.
         *
         * The `configOptions` parameter will be an array of options that were provided
         * by the `metadata.configOptions` property. If an option's `required` property
         * is `true` it is guaranteed that that option will be in the array and will
         * have passed type checking.
         *
         * @param {Addon.Metadata} metadata
         * @param {{ [id: string]: any; }} [configOptions]
         * @returns {Promise<Addon>}
         */
        createInstance(metadata: Addon.Metadata, configOptions?: {
            [id: string]: any;
        }): Promise<Addon>;
    }
    export namespace AddonInitialiser {
        interface Metadata {
            /**
             * The user-friendly display name for the addon.
             */
            readonly name: string;
            /**
             * A user-friendly description of the addon.
             */
            readonly description: string;
            /**
             * When this value is `true` it indicates to consequences that more than one instance
             * of the addon is supported. When this value is `false` the user will only be able to
             * create one instance of this addon. For example, an addon may support multiple accounts
             * on the same platform, which would create multiple distinct instances of the addon.
             */
            readonly supportsMultipleInstances: boolean;
            /**
             * Configuration options that may be passed to the `createInstance` function.
             */
            readonly configOptions?: AddonInitialiser.ConfigOption[];
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
    export interface EventListener {
        /**
         * The unique identifier of the module to load the variable from
         */
        readonly moduleId: string;
        /**
         * The unique identifier of the variable to be watched for changes
         */
        readonly variableId: string;
        /**
         * An array of the steps to be performed when the event is triggered.
         *
         * This array is actually a tree structure, enabling for chains of zero or more
         * conditions, eventually leading to a step to be performed, if all the conditions are met.
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
