
/**
 * An object that represents a value in the system that can be changed
 */
export interface Variable {
  /** The name of the variable */
  readonly name: string;
  /** The current value of the variable */
  readonly currentValue: any;
  /**
   * Adds the provided listener to a list of functions that will be called
   * when the values updates
   * @param listener The function to be called when the value is updated
   */
  addChangeEventListener(listener: Function): void;
  /**
   * Removed the provided listener from the list of functions that will be called
   * when the values updates
   * @param listener The listener function to be removed from the listeners list
   */
  removeChangeEventListener(listener: Function): void;
  /**
   * Update the value of the variable
   * @param newValue The new value of the variable
   */
  updateValue?(newValue: any): void;
}

export interface Addon {
  metadata: Metadata;
  variables?: Variable[];
}

export interface Metadata {
  id: string;
  name: string;
  creationDate: Date;
}

export interface AddonInitialiser {
  name: string;
  description: string;
  config?: ConfigOption[];
  createInstance(metadata: Metadata, config?: any): Promise<Addon>;
}

export interface ConfigOption {
  name: string;
  type: ConfigOptionType;
  hint?: string;
  defaultValue?: any;
}

export type ConfigOptionType = 'bool' | 'string' | 'url' | 'number';
