
/**
 * An input to present to the user when creating the condition
 */
interface UserInput {

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

namespace UserInput {

  /**
   * The different object kinds that an input may support
   */
  export enum Kind {
    /**
     * A Consequences `Variable`
     */
    variable,

    /**
     * A JavaScript boolean
     */
    boolean,

    /**
     * A JavaScript string
     */
    string,

    /**
     * A JavaScript string that is a valid URL
     */
    url,

    /**
     * A JavaScript number
     */
    number,
  }

  /**
   * A value provided by the user
   */
  export interface Value {
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

export default UserInput;
