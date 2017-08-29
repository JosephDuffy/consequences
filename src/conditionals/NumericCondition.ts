import { Condition, ConditionInput, UserInput } from '../models/Condition';
import UserInputType from '../models/UserInputType';

// tslint:disable:max-classes-per-file
namespace NumericCondition {

  export class Input implements ConditionInput {

    public get uniqueId() {
      return 'rhs_input';
    }

    public get optional() {
      return false;
    }

    public get type() {
      return UserInputType.number;
    }

  }

  export class Base {

    public get userInputs() {
      return [
        new Input(),
      ];
    }

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
      throw new Error('`checkValues` method must be overriden by subclasses');
    }

  }

  export class Equal extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_eq';
    }

    public get name() {
      return 'is equal to';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs === rhs;
    }

  }

  export class NotEqual extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_not_eq';
    }

    public get name() {
      return 'is not equal to';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs !== rhs;
    }

  }

  export class LessThan extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_lt';
    }

    public get name() {
      return 'is less than';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs < rhs;
    }

  }

  export class GreaterThan extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_gt';
    }

    public get name() {
      return 'is greater than';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs > rhs;
    }

  }

  export class LessThanOrEqualTo extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_lte';
    }

    public get name() {
      return 'is less than or equal to';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs <= rhs;
    }

  }

  export class GreaterOrEqualToThan extends Base implements Condition {

    public get uniqueId() {
      return 'numeric_gte';
    }

    public get name() {
      return 'is greater than or equal to';
    }

    protected checkValues(lhs: any, rhs: any): boolean {
      return lhs >= rhs;
    }

  }

}

export default NumericCondition;
