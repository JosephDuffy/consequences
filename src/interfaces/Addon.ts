import Condition from './Condition';
import Event from './Event';
import EventConstructor from './EventConstructor';
import UserInput from './UserInput';
import Variable from './Variable';
import VariableCollection from './VariableCollection';

interface Addon {

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

    /**
     * An array of inputs the user provided
     */
    readonly userProvidedInputs: UserInput.Value[];
  }
}

export default Addon;
