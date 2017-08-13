import { Condition, ConditionInput, UserInput } from "../models/Conditional";
import UserInputType from "../models/UserInputType";

export class NumericInput implements ConditionInput {

    get uniqueId() {
        return "rhs_input";
    }

    get optional() {
        return false;
    }

    get type() {
        return UserInputType.number;
    }

}

export class NumericConditional {

    get userInputs() {
        return [
            new NumericInput()
        ]
    }

    supports(input: any): boolean {
        return Number.isFinite(input);
    }

}

export class NumericEqualConditional extends NumericConditional implements Condition {

    get uniqueId() {
        return "numeric_eq";
    }

    get name() {
        return "is equal to";
    }

    evaluate(input: any, userInputs?: UserInput[]): boolean {
        const userInput = userInputs.find((input) => { return input.key === "rhs_input"});

        return input === userInput.value;
    }

}

export class NumericLessThanConditional extends NumericConditional implements Condition {

    get uniqueId() {
        return "numeric_lt";
    }

    get name() {
        return "is less than";
    }

    evaluate(input: any, userInputs?: UserInput[]): boolean {
        const userInput = userInputs.find((input) => { return input.key === "rhs_input"});

        return input < userInput.value;
    }

}

export class NumericGreaterThanConditional extends NumericConditional implements Condition {

    get uniqueId() {
        return "numeric_gt";
    }

    get name() {
        return "is greater than";
    }

    evaluate(input: any, userInputs?: UserInput[]): boolean {
        const userInput = userInputs.find((input) => { return input.key === "rhs_input"});

        return input > userInput.value;
    }

}

export class NumericLessThanOrEqualToConditional extends NumericConditional implements Condition {

    get uniqueId() {
        return "numeric_lte";
    }

    get name() {
        return "is less than or equal to";
    }

    evaluate(input: any, userInputs?: UserInput[]): boolean {
        const userInput = userInputs.find((input) => { return input.key === "rhs_input"});

        return input <= userInput.value;
    }

}

export class NumericGreaterOrEqualToThanConditional extends NumericConditional implements Condition {

    get uniqueId() {
        return "numeric_gte";
    }

    get name() {
        return "is greater than or equal to";
    }

    evaluate(input: any, userInputs?: UserInput[]): boolean {
        const userInput = userInputs.find((input) => { return input.key === "rhs_input"});

        return input >= userInput.value;
    }

}
