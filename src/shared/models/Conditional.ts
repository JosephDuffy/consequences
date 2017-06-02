import Variable from "../../shared/models/Variable";
import UserInputType from "./UserInputType";

/**
 * An object that evaluates a given input to determine if the processing of an event should continue
 */
export interface Conditional {

    /** A unique (to the addon) identifier. This value MUST be consistent across requests and system restarts */
    readonly uniqueId: string

    /**
     * A user-facing string. Will be used in the format `${inputName} ${conditionalName}`
     *
     * e.g. With an input named "On" and a conditional named "is true" the result would be "On is true"
     */
    readonly name: string;

    /** An optional array of extra inputs that the user may provide */
    readonly extraInputs?: ConditionalInput[];

    /**
     * Checks if the provided input it supported by this conditional. If this method
     * indicates that this conditional supports the provided input it will be shown to the
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
     * @returns `true` if the conditional check passes, otherwise `false`
     */
    evaluate(input: any, userInputs?: UserInput[]): boolean;

}

/**
 * An input to present to the user when creating the conditional
 */
export interface ConditionalInput {

    /** A unique (to the the conditional) identifier. This value MUST be consistent across requests and system restarts */
    readonly uniqueId: string;

    /** The default value to pre-populate the input field with */
    readonly defaultValue?: any;

    /** A user-facing string to help the user identify the input */
    readonly name?: string;

    /** A user-facing string to provide an extra hint to the user */
    readonly hint?: string;

    /** A flag denoting whether the input requires a value for the conditional to evaluated */
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

/**
 * A value provided by the user
 */
export interface UserInput {

    key: string;

    value: any;

}

export default Conditional;
