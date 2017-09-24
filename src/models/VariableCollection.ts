import Condition from './Condition';
import Event from './Event';
import Variable from './Variable';

/**
 * An object that represents a collection of values in the system that can be changed
 */
interface VariableCollection {

  /**
   * An id that must be unique to this addon and remain constant across requests and system restarts
   */
  readonly uniqueId: string;

  /**
   * A user-friendly name for the variable
   */
  readonly name: string;

  /**
   * The variables to include in the collection
   */
  readonly variables: Variable[];

  /**
   * An array of conditions that this variable collection offers. These conditions should
   * be associated with this collection of variables.
   *
   * N.B.
   *
   * Any conditions offered by variables in this collection will automatically be offered
   * to the user; they do not need to be included in this array.
   */
  readonly conditions?: Condition[];

  /**
   * An array of events that this collection of variable offers. These events
   * should be associated with this collection of variables.
   *
   * N.B.
   *
   * Any events offered by variables in this collection will automatically be offered
   * to the user; they do not need to be included in this array.
   */
  readonly events?: Event[];

}

namespace VariableCollection {
  export function isVariableCollection(object: any): object is VariableCollection {
    return Array.isArray(object.variables) &&
           typeof object.uniqueId === 'string' &&
           typeof object.name === 'string';
  }
}

export default VariableCollection;
