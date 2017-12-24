import { EventEmitter } from 'events';

import Event from '../interfaces/Event';
import EventConstructor from '../interfaces/EventConstructor';
import UserInput from '../interfaces/UserInput';
import Variable from '../interfaces/Variable';

class VariableValueChangedEvent extends EventEmitter implements Event {

  public readonly metadata: Event.Metadata;

  private readonly variable: Variable;

  constructor(metadata: Event.Metadata, variable: Variable) {
    super();

    this.variable = variable;
    this.metadata = metadata;

    variable.addChangeEventListener(() => {
      this.emit('eventTriggered');
    });
  }

  public addTriggerEventListener(listener: () => void) {
    super.addListener('eventTriggered', listener);
  }

  public removeTriggerEventListener(listener: () => void) {
    super.removeListener('eventTriggered', listener);
  }

}

namespace VariableValueChangedEvent {
  export class Constructor implements EventConstructor {

    public readonly uniqueId = 'variable_value_changed';

    public readonly name = 'Variable Value Changed';

    public readonly inputs: UserInput[] = [
      {
        uniqueId: 'variable',
        name: 'Variable',
        required: true,
        allowsMultiple: false,
        kind: UserInput.Kind.variable,
      },
    ];

    public async createEvent(metadata: Event.Metadata, inputs?: UserInput.Value[]): Promise<VariableValueChangedEvent> {
      if (!inputs) {
        throw new Error(`${name} requires a variable`);
      }

      const variable = inputs.find((input) => input.uniqueId === 'variable');

      if (!variable) {
        throw new Error(`${name} requires a variable`);
      }

      return new VariableValueChangedEvent(metadata, variable.value);
    }

  }
}

export default VariableValueChangedEvent;
