import Condition from '../models/Condition';

// tslint:disable:max-classes-per-file
namespace BooleanCondition {

  export class True implements Condition {

    public readonly uniqueId = 'boolean_true';

    public readonly name = 'is true';

    public supports(input: any): boolean {
      return input === true || input === false;
    }

    public evaluate(input: any): boolean {
      return input === true;
    }

  }

  export class False implements Condition {

    public readonly uniqueId = 'boolean_false';

    public readonly name = 'is false';

    public supports(input: any): boolean {
      return input === true || input === false;
    }

    public evaluate(input: any): boolean {
      return input === false;
    }

  }

}

export default BooleanCondition;
