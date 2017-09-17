import UserInput from './UserInput';

interface Action {

  readonly uniqueId: string;

  perform(userInputs: UserInput.Value[]): Promise<void>;

}

export default Action;
