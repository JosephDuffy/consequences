import { UserInput } from './Condition';

interface Action {

  readonly uniqueId: string;

  perform(userInputs: UserInput[]): void;

}

export default Action;
