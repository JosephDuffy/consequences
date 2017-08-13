import { UserInput } from './Conditional';

interface Action {

    readonly uniqueId: string;

    perform(userInputs: UserInput[]): void;

}

export default Action;
