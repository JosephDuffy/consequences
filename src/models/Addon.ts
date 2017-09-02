import Condition from './Condition';
import UserInputType from './UserInputType';
import Variable from './Variable';

interface Addon {

  /**
   * An object containing the metadata of the addon, including the id and name
   *
   * N.B.
   * This object is provided to the `AddonInitialiser` and should not be modified
   *
   * @type {Metadata}
   * @memberof Addon
   */
  readonly metadata: Addon.Metadata;

  /**
   * An array of variables this addon provides
   *
   * @type {Promise<Variable[]>}
   * @memberof Addon
   */
  readonly variables?: Promise<Variable[]>;

  /**
   * A function that the addon should call when it has added a variable
   *
   * @memberof Addon
   */
  onVariableAdded?: (variable: Variable) => void;

  /**
   * A function that the addon should call when it has removed a variable
   *
   * @memberof Addon
   */
  onVariableRemoved?: (variable: Variable) => void;

  readonly conditions?: Promise<Condition[]>;

  /**
   * A function that the addon should call when it has added a condition
   *
   * @memberof Addon
   */
  onConditionAdded?: (condition: Condition) => void;

  /**
   * A function that the addon should call when it has removed a condition
   *
   * @memberof Addon
   */
  onConditionRemoved?: (condition: Condition) => void;

}

namespace Addon {
  export interface Metadata {
    /**
     * A unique id for this instance of the addon. This is created by conquences and may change in the future
     *
     * @type {string}
     * @memberof Metadata
     */
    readonly id: string;

    /**
     * The name for this instance of the addon. This will default to the value provided by the
     * `AddonInitialiser`, but may be changed by the user.
     *
     * @type {string}
     * @memberof Metadata
     */
    readonly name: string;
  }

  export interface ConfigOption {
    id: string;
    required: boolean;
    name: string;
    type: UserInputType;
    hint?: string;
    defaultValue?: any;
  }
}

export default Addon;
