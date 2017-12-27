import { EventEmitter } from 'events';

import Condition from '../interfaces/Condition';
import Event from '../interfaces/Event';
import Variable from '../interfaces/Variable';

/**
 * A collection of type-safe boilerplate synchronous variables.
 */
namespace Variables {
  export class ReadOnly<StoredType> extends EventEmitter implements Variable {
    public readonly uniqueId: string;

    public readonly name: string;

    public readonly conditions?: Condition[];

    public readonly events?: Event[];

    protected storedValue: StoredType;

    constructor(options: {
      uniqueId: string,
      name: string,
      conditions?: Condition[],
      events?: Event[],
      startingValue: StoredType,
    }) {
      super();

      this.uniqueId = options.uniqueId;
      this.name = options.name;
      this.conditions = options.conditions;
      this.events = options.events;
      this.storedValue = options.startingValue;
    }

    public async retrieveValue(): Promise<StoredType> {
      return this.storedValue;
    }

    public addChangeEventListener(listener: (newValue: StoredType) => void) {
      this.addListener('valuechanged', listener);
    }

    public removeChangeEventListener(listener: () => void) {
      this.removeListener('valuechanged', listener);
    }
  }

  export class ReadWrite<StoredType> extends ReadOnly<StoredType> {
    public async updateValue(newValue: StoredType): Promise<void> {
      this.storedValue = newValue;
      this.emit('valuechanged', newValue);
    }
  }
}

export default Variables;
