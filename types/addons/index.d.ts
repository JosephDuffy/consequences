declare module "consequences/addons" {
    export interface UserInput {
        /**
         * A unique (to the the condition) identifier. This value MUST be consistent across requests and system restarts
         */
        readonly uniqueId: string;
        /**
         * A flag denoting whether the input requires a value for the condition to evaluated
         */
        readonly required: boolean;
        /**
         * A flag denoting whether the user is permitted to enter more than 1 value for this input
         */
        readonly allowsMultiple: boolean;
        /**
         * The kind of data to ask the user to input
         */
        readonly kind: UserInput.Kind;
        /**
         * An optional array of options the user may input. If provided
         * the user will _only_ be able to input one of these values.
         */
        readonly options?: any[];
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
         * An optional function that can reject a user's input
         *
         * @param input The user's input value. Will be of type `type`
         * @returns A promise that resolves to string to show to the user in the case of rejection, or null if the input was accepted
         */
        validator?(input: any): Promise<string | null>;
        /**
         * An optional function that can filter input options that will be presented to the
         * user. This is only used for the following kinds of inputs:
         *
         *  - Variables
         *
         * @param {any[]} options The options that Consequences found that match the `kind`
         * @returns {Promise<any[]>} A subset of the options array, with any options that
         *                           shouldn't be shown to the user removed
         */
        filter?(options: any[]): Promise<any[]>;
    }
    export namespace UserInput {
        /**
         * The different object kinds that an input may support
         */
        enum Kind {
            /**
             * A Consequences `Variable`
             */
            variable = 0,
            /**
             * A JavaScript boolean
             */
            boolean = 1,
            /**
             * A JavaScript string
             */
            string = 2,
            /**
             * A JavaScript string that is a valid URL
             */
            url = 3,
            /**
             * A JavaScript number
             */
            number = 4,
        }
        /**
         * A value provided by the user
         */
        interface Value {
            /**
             * The unique identifier of the input, as specified by the `UserInput`
             */
            uniqueId: string;
            /**
             * The value the user input
             */
            value: any;
        }
    }
    export interface Action {
        readonly uniqueId: string;
        perform(userInputs: UserInput.Value[]): Promise<void>;
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
        /**
         * An optional array of inputs that the user may provide
         */
        readonly inputs?: UserInput[];
        /**
         * Evaluates the provided input
         *
         * @param inputs An array of values input by the user
         * @returns `true` if the condition check passes, otherwise `false`
         */
        evaluate(inputs: UserInput.Value[]): Promise<boolean>;
    }
    export interface Event {
        /**
         * An object provided by Consequences. The values are not needed by the event.
         */
        readonly metadata: Event.Metadata;
        /**
         * Adds the provided listener to a list of functions that will be called
         * when the event is triggered
         *
         * Even if the addon itself does not automatically know when its value has changed
         * the `listener` function MUST be called when the value is updated via the `updateValue` function
         *
         * @param listener The function to be called when the value is updated
         */
        addTriggerEventListener(listener: () => void): void;
        /**
         * Removed the provided listener from the list of functions that will be called
         * when the values updates
         *
         * @param listener The listener function to be removed from the listeners list
         */
        removeTriggerEventListener(listener: () => void): void;
    }
    export namespace Event {
        interface Metadata {
            /**
             * An id created by Consequences, used to track the event
             */
            readonly uniqueId: string;
            /**
             * The date that the event was last triggered. This is managed by
             * consequences and should not be set by addons
             */
            lastTriggered: Date | null;
        }
    }
    export default interface EventConstructor {
        /**
         * An id that can be used to identify the event constructor.
         */
        readonly uniqueId: string;
        /**
         * A user-friendly name for the event
         */
        readonly name: string;
        /**
         * An optional array of extra inputs that the user may provide
         */
        readonly inputs?: UserInput[];
        createEvent(metadata: Event.Metadata, inputs?: UserInput.Value[]): Promise<Event>;
    }
    export interface Variable {
        /**
         * An id that must be unique to this addon or `VariableCollection` and remain constant
         * across requests and system restarts
         */
        readonly uniqueId: string;
        /**
         * A user-friendly name for the variable
         */
        readonly name: string;
        /**
         * An array of conditions that this variable offers. These conditions should
         * be associated with this variable.
         */
        readonly conditions?: Condition[];
        /**
         * An array of events that this variable offers. These events should be associated
         * with this variable.
         */
        readonly events?: Event[];
        /**
         * Asks the variable to return its latest value, optionally performing work
         * asynchronously to retrieve the value
         *
         * @returns {Promise<any>} A promise that resolves to the current value
         */
        retrieveValue(): Promise<any>;
        /**
         * Adds the provided listener to a list of functions that will be called
         * when the values updates
         *
         * Even if the addon itself does not automatically know when its value has changed
         * the `listener` function MUST be called when the value is updated via the `updateValue` function
         *
         * @param listener The function to be called when the value is updated
         */
        addChangeEventListener(listener: () => void): void;
        /**
         * Removed the provided listener from the list of functions that will be called
         * when the values updates
         *
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
        updateValue?(newValue: any): Promise<void>;
    }
    export interface VariableCollection {
        /**
         * An id that must be unique to this addon and remain constant across requests and system restarts
         */
        readonly uniqueId: string;
        /**
         * A user-friendly name for the variable
         */
        readonly name: string;
        /**
         * The variables to include in the collection
         */
        readonly variables: Variable[];
        /**
         * An array of conditions that this variable collection offers. These conditions should
         * be associated with this collection of variables.
         *
         * N.B.
         *
         * Any conditions offered by variables in this collection will automatically be offered
         * to the user; they do not need to be included in this array.
         */
        readonly conditions?: Condition[];
        /**
         * An array of events that this collection of variable offers. These events
         * should be associated with this collection of variables.
         *
         * N.B.
         *
         * Any events offered by variables in this collection will automatically be offered
         * to the user; they do not need to be included in this array.
         */
        readonly events?: Event[];
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
         * An optional property that should return an array of promises that each resolve to either
         * a `Variable` or a `VariableCollection`.
         *
         * If this property is unimplemented it is assumed that the addon does not offer any variables.
         */
        readonly variables?: Promise<Array<Variable | VariableCollection>>;
        /**
         * An optional property that should return an array of promises that resolve to conditions.
         *
         * If this property is unimplemented it is assumed that the addon does not offer any conditions.
         */
        readonly conditions?: Promise<Condition[]>;
        /**
         * An optional property that should return an array of promises that resolve to events.
         *
         * If this property is unimplemented it is assumed that the addon does not offer any events.
         */
        readonly events?: Promise<Event[]>;
        /**
         * An optional property that should return an array of promises that resolve to event constructors.
         *
         * If this property is unimplemented it is assumed that the addon does not offer any event constructors.
         */
        readonly eventConstructors?: Promise<EventConstructor[]>;
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
            /**
             * An array of inputs the user provided
             */
            readonly userProvidedInputs: UserInput.Value[];
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
         * The `inputs` property of the `metadata` parameter will be an array of inputs that
         * were provided by the `metadata.inputs` property of this `AddonInitialiser`. If an input's
         * `required` property is `true` it is guaranteed that that inputs will be in the array and
         * will have passed type checking.
         *
         * @param {Addon.Metadata} metadata Metadata about the addon, including user inputs. To be stored
         *                                  by the `Addon` instance
         * @param {(data: object) => void} saveData A function that can be called to save the provided object
         *                                          in a database. See the `savedData` parameter
         * @param {object} savedData The most recent object that was passed to the `saveData` object. This object
         *                           will be `undefined` if `saveData` has never been called.
         * @returns {Promise<Addon>}
         */
        createInstance(metadata: Addon.Metadata, saveData: (data: object) => void, savedData?: object): Promise<Addon>;
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
             * Configuration options that may be passed to the `createInstance` function. These
             * inputs will be presented to the user prior to creation.
             */
            readonly inputs?: UserInput[];
        }
    }
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
