import { UserInput } from './Condition';

export interface EventListener {

  /**
   * The unique identifier of the module to load the variable from
   */
  readonly moduleId: string;

  /**
   * The unique identifier of the variable to be watched for changes
   */
  readonly variableId: string;

  /**
   * An array of the steps to be performed when the event is triggered.
   *
   * This array is actually a tree structure, enabling for chains of zero or more
   * conditions, eventually leading to a step to be performed, if all the conditions are met.
   */
  readonly steps: Step[];

}

export interface ActionStep {
  actionId: string;
  userInputs: UserInput[];
}

export interface ConditionStep {
  conditionId: string;
  userInputs: UserInput[];
  next: Step;
}

export type Step = ActionStep | ConditionStep;

export default EventListener;
