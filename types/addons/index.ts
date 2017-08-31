// Interfaces that are relevant to addons. Used to generate types/addons.d.ts

import Action from '../../src/models/Action';
import Addon from '../../src/models/Addon';
import AddonInitialiser from '../../src/models/AddonInitialiser';
import { Condition, ConditionInput, UserInput } from '../../src/models/Condition';
import { ActionStep, ConditionStep, EventListener, Step } from '../../src/models/EventListener';
import Package from '../../src/models/Package';
import UserInputType from '../../src/models/UserInputType';
import Variable from '../../src/models/Variable';

export {
  Addon,
  Action,
  AddonInitialiser,
  EventListener,
  ActionStep,
  ConditionStep,
  Step,
  Condition,
  ConditionInput,
  UserInput,
  Package,
  Variable,
  UserInputType,
};
