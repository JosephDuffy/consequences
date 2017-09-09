import Condition from './Condition';
import Variable from './Variable';

interface Addon {

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

namespace Addon {
  export interface Metadata {
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

export default Addon;
