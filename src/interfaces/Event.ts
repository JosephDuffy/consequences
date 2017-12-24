
interface Event {

  /**
   * An object provided by Consequences. The values are not needed by the event.
   */
  readonly metadata: Event.Metadata;

  /**
   * Adds the provided listener to a list of functions that will be called
   * when the event is triggered
   *
   * Even if the addon itself does not automatically know when its value has changed
   * the `listener` function MUST be called when the value is updated via the `updateValue` function
   *
   * @param listener The function to be called when the value is updated
   */
  addTriggerEventListener(listener: () => void): void;

  /**
   * Removed the provided listener from the list of functions that will be called
   * when the values updates
   *
   * @param listener The listener function to be removed from the listeners list
   */
  removeTriggerEventListener(listener: () => void): void;
}

namespace Event {
  export interface Metadata {

    /**
     * An id created by Consequences, used to track the event
     */
    readonly uniqueId: string;

    /**
     * The date that the event was last triggered. This is managed by
     * consequences and should not be set by addons
     */
    lastTriggered: Date | null;
  }
}

export default Event;
