import Event from './Event';
import Link from './Link';

export default class Chain {
  /**
   * The event that triggers the chain to be evaluated
   */
  public readonly startingEvent: Event;

  /**
   * The first link to be evaluated when the event is triggered
   */
  public readonly startingLink: Link;

}
