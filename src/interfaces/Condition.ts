import UserInput from './UserInput';

/**
 * An object that evaluates a given input to determine if the processing of an event should continue
 */
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

export default Condition;
