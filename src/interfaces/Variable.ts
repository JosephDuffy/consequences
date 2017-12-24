import Condition from './Condition';
import Event from './Event';

/**
 * An object that represents a value in the system that can be changed
 */
interface Variable {

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

export default Variable;
