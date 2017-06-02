import Conditional from "../models/Conditional";

export class BooleanTrueConditional implements Conditional {

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

export class BooleanFalseConditional implements Conditional {

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
