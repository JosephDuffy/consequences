// Interfaces that are relevant to addons. Used to generate types/addons.d.ts

import Addon from '../../src/models/Addon';
import Action from '../../src/models/Action';
import AddonInitialiser from '../../src/models/AddonInitialiser';
import { EventListener, ActionStep, ConditionStep, Step } from '../../src/models/EventListener';
import { Condition, ConditionInput, UserInput } from '../../src/models/Condition';
import Package from '../../src/models/Package';
import Variable from '../../src/models/Variable';
import UserInputType from '../../src/models/UserInputType';

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
