import { Condition, ConditionInput, UserInput } from '../models/Condition';
import UserInputType from '../models/UserInputType';

// tslint:disable:max-classes-per-file
namespace NumericCondition {

  export class Input implements ConditionInput {

    public readonly uniqueId = 'rhs_input';

    public readonly optional = false;

    public readonly allowsMultiple = false;

    public readonly type = UserInputType.number;

  }

  abstract class Base {

    public readonly userInputs = [
      new Input(),
    ];

    public supports(input: any): boolean {
      return Number.isFinite(input);
    }

    public evaluate(input: any, userInputs?: UserInput[]): boolean {
      const idToFind = new Input().uniqueId;
      const userInput = userInputs.find(({ uniqueId }) => uniqueId === idToFind);

      if (userInput === undefined) {
        return false;
      }

      return this.checkValues(input, userInput.value);
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      throw new Error('`checkValues` method must be overridden by subclasses');
    }

  }

  export class Equal extends Base implements Condition {

    public readonly uniqueId = 'numeric_eq';

    public readonly name = 'is equal to';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs === rhs;
    }

  }

  export class NotEqual extends Base implements Condition {

    public readonly uniqueId = 'numeric_not_eq';

    public readonly name = 'is not equal to';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs !== rhs;
    }

  }

  export class LessThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_lt';

    public readonly name = 'is less than';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs < rhs;
    }

  }

  export class GreaterThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_gt';

    public readonly name = 'is greater than';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs > rhs;
    }

  }

  export class LessThanOrEqualTo extends Base implements Condition {

    public readonly uniqueId = 'numeric_lte';

    public readonly name = 'is less than or equal to';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs <= rhs;
    }

  }

  export class GreaterOrEqualToThan extends Base implements Condition {

    public readonly uniqueId = 'numeric_gte';

    public readonly name = 'is greater than or equal to';

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs >= rhs;
    }

  }

}

export default NumericCondition;
