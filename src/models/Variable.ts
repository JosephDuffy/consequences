
/**
 * An object that represents a value in the system that can be changed
 */
interface Variable {

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
  updateValue?(newValue: any): Promise<void>;

}

export default Variable;
