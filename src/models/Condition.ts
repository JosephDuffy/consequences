import UserInputType from './UserInputType';

/**
 * An object that evaluates a given input to determine if the processing of an event should continue
 */
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

/**
 * An input to present to the user when creating the condition
 */
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

/**
 * A value provided by the user
 */
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

export default Condition;
