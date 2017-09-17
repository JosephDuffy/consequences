import Condition from '../models/Condition';
import UserInput from '../models/UserInput';

namespace NumericCondition {

  abstract class Base {

    public readonly inputs = [
      {
        uniqueId: 'lhs_input',
        required: true,
        allowsMultiple: false,
        kind: UserInput.Kind.number,
      },
      {
        uniqueId: 'rhs_input',
        required: true,
        allowsMultiple: false,
        kind: UserInput.Kind.number,
      },
    ];

    public async evaluate(inputs: UserInput.Value[]): Promise<boolean> {
      const lhsInput = inputs.find(({ uniqueId }) => uniqueId === 'lhs_input');
      const rhsInput = inputs.find(({ uniqueId }) => uniqueId === 'rhs_input');

      if (lhsInput === undefined || rhsInput === undefined) {
        return false;
      }

      return this.checkValues(lhsInput.value, rhsInput.value);
    }

    protected checkValues(lhs: number, rhs: number): boolean {
      throw new Error('`checkValues` method must be overridden by subclasses');
    }

  }

  export class Equal extends Base implements Condition {

    public readonly uniqueId = 'numeric_eq';

    public readonly name = 'is equal to';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs === rhs;
    }

  }

  export class NotEqual extends Base implements Condition {

    public readonly uniqueId = 'numeric_not_eq';

    public readonly name = 'is not equal to';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs !== rhs;
    }

  }

  export class LessThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_lt';

    public readonly name = 'is less than';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs < rhs;
    }

  }

  export class GreaterThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_gt';

    public readonly name = 'is greater than';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs > rhs;
    }

  }

  export class LessThanOrEqualTo extends Base implements Condition {

    public readonly uniqueId = 'numeric_lte';

    public readonly name = 'is less than or equal to';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs <= rhs;
    }

  }

  export class GreaterOrEqualToThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_gte';

    public readonly name = 'is greater than or equal to';

    protected checkValues(lhs: number, rhs: number): boolean {
      return lhs >= rhs;
    }

  }

}

export default NumericCondition;
