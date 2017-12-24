import Event from './Event';
import UserInput from './UserInput';

/**
 * Something can happen and can exist on its own, without relying on a variable.
 */
export default interface EventConstructor {

  /**
   * An id that can be used to identify the event constructor.
   */
  readonly uniqueId: string;

  /**
   * A user-friendly name for the event
   */
  readonly name: string;

  /**
   * An optional array of extra inputs that the user may provide
   */
  readonly inputs?: UserInput[];

  createEvent(metadata: Event.Metadata, inputs?: UserInput.Value[]): Promise<Event>;

}
