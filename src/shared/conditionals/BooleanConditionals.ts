import Condition from "../models/Conditional";

export class BooleanTrueConditional implements Condition {

    get uniqueId() {
        return "boolean_true";
    }

    get name() {
        return "is true";
    }

    supports(input: any): boolean {
        return input === true || input === false;
    }

    evaluate(input: any): boolean {
        return input === true;
    }

}

export class BooleanFalseConditional implements Condition {

    get uniqueId() {
        return "boolean_false";
    }

    get name() {
        return "is false";
    }

    supports(input: any): boolean {
        return input === true || input === false;
    }

    evaluate(input: any): boolean {
        return input === false;
    }

}
