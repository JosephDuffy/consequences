import Condition from '../models/Condition';

// tslint:disable:max-classes-per-file
namespace BooleanCondition {

  export class True implements Condition {

    public get uniqueId() {
      return 'boolean_true';
    }

    public get name() {
      return 'is true';
    }

    public supports(input: any): boolean {
      return input === true || input === false;
    }

    public evaluate(input: any): boolean {
      return input === true;
    }

  }

  export class False implements Condition {

    public get uniqueId() {
      return 'boolean_false';
    }

    public get name() {
      return 'is false';
    }

    public supports(input: any): boolean {
      return input === true || input === false;
    }

    public evaluate(input: any): boolean {
      return input === false;
    }

  }

}

export default BooleanCondition;
