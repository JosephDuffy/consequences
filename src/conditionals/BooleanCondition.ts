import Condition from '../models/Condition';
import UserInput from '../models/UserInput';

namespace BooleanCondition {

  export class True implements Condition {

    public readonly uniqueId = 'boolean_true';

    public readonly name = 'is true';

    public readonly inputs = [
      {
        uniqueId: 'input',
        required: true,
        allowsMultiple: false,
        kind: UserInput.Kind.boolean,
      },
    ];

    public async evaluate(inputs: UserInput.Value[]): Promise<boolean> {
      for (const input of inputs) {
        if (input.uniqueId === 'input') {
          return input.value === true;
        }
      }

      return false;
    }

  }

  export class False implements Condition {

    public readonly uniqueId = 'boolean_false';

    public readonly name = 'is false';

    public readonly inputs = [
      {
        uniqueId: 'input',
        required: true,
        allowsMultiple: false,
        kind: UserInput.Kind.boolean,
      },
    ];

    public async evaluate(inputs: UserInput.Value[]): Promise<boolean> {
      for (const input of inputs) {
        if (input.uniqueId === 'input') {
          return input.value === false;
        }
      }

      return false;
    }

  }

}

export default BooleanCondition;
