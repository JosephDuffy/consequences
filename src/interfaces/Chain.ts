import Event from './Event';
import Link from '../models/Link';

export default interface Chain {
  /**
   * The event that triggers the chain to be evaluated
   */
  readonly startingEvent: Event;

  /**
   * The first link to be evaluated when the event is triggered
   */
  readonly startingLink: Link;

}
