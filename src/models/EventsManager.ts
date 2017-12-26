import { Inject, Service } from 'typedi';
import * as uuid from 'uuid/v1';

import VariableValueChangedEvent from '../events/VariableValueChangedEvent';
import Event from '../interfaces/Event';
import EventConstructor from '../interfaces/EventConstructor';
import UserInput from '../interfaces/UserInput';
import AddonsManager, { AddonResolution } from './AddonsManager';

@Service()
export default class EventsManager {

  @Inject()
  private addonsManager: AddonsManager;

  private internalConstructors: EventConstructor[];

  constructor() {
    this.internalConstructors = [
      new VariableValueChangedEvent.Constructor(),
    ];
  }

  public async getEvent(resolution: EventResolution): Promise<Event> {
    return this.resolveEvent(resolution);
  }

  public async createEvent(resolution: EventConstructorResolution, inputs?: UserInput.Value[]): Promise<Event> {
    const constructor = await this.resolveEventConstructor(resolution);

    const requiredInputs = (constructor.inputs || []).filter(input => input.required);

    const missingInputs = requiredInputs.filter((requiredInput) => {
      return inputs && inputs.findIndex((input) => input.uniqueId === requiredInput.uniqueId) === -1;
    });

    if (missingInputs.length > 0) {
      const inputsString = missingInputs.map((input) => input.name).join(', ');
      throw new Error(`Missing required inputs: ${inputsString}`);
    }

    const metadata: Event.Metadata = {
      uniqueId: uuid(),
      lastTriggered: null,
    };

    return constructor.createEvent(metadata, inputs);
  }

  private async resolveEventConstructor(resolution: EventConstructorResolution): Promise<EventConstructor> {
    if (resolution.addon.name === 'consequences') {

      for (const internalConstructor of this.internalConstructors) {
        if (internalConstructor.uniqueId === resolution.constructorId) {
          return internalConstructor;
        }
      }

      throw new Error(`Failed to find internal event constructor with the id ${resolution.constructorId}`);
    }

    const addonInstance = this.addonsManager.resolveAddon(resolution.addon);

    if (!addonInstance.eventConstructors) {
      throw new Error(`Addon ${resolution.addon.name} instance ${addonInstance.metadata.instanceId} does not offer event constructors`);
    }

    const constructors = await addonInstance.eventConstructors;

    const event = constructors.find(({ uniqueId }) => uniqueId === resolution.constructorId);

    if (!event) {
      throw new Error(`No event constructor with instance id ${resolution.constructorId} was found on module ${resolution.addon.name} instance ${addonInstance.metadata.instanceId}`);
    }

    return event;
  }

  private async resolveEvent(resolution: EventResolution): Promise<Event> {
    if (resolution.addon.name === 'consequences') {
      throw new Error(`Internal events are not supported`);
    }

    const addonInstance = this.addonsManager.resolveAddon(resolution.addon);

    if (resolution.variableId) {
      const variables = await addonInstance.variables;

      const variable = variables.find(({ uniqueId }) => uniqueId === resolution.variableId);

      if (!variable) {
        throw new Error(`No variable with id ${resolution.variableId} was found in addon ${resolution.addon.name} instance ${addonInstance.metadata.instanceId}`);
      }

      const events = variable.events;

      if (!events || events.length === 0) {
        throw new Error(`No events found on variable with id ${resolution.variableId} from addon ${resolution.addon.name} instance ${addonInstance.metadata.instanceId}`);
      }

      const event = events.find(({ metadata }) => metadata.uniqueId === resolution.eventInstanceId);

      if (!event) {
        throw new Error(`No event with instance id ${resolution.eventInstanceId} was found on variable with id ${resolution.variableId} from module ${resolution.addon.name} instance ${addonInstance.metadata.instanceId}`);
      }

      return event;
    } else {
      if (!addonInstance.events) {
        throw new Error(`Addon ${resolution.addon.name} instance ${addonInstance.metadata.instanceId} does not offer events`);
      }

      const events = await addonInstance.events;

      const event = events.find(({ metadata }) => metadata.uniqueId === resolution.eventInstanceId);

      if (!event) {
        throw new Error(`No event with instance id ${resolution.eventInstanceId} was found on module ${resolution.addon.name} instance ${addonInstance.metadata.instanceId}`);
      }

      return event;
    }
  }

}

export type EventConstructorResolution = {
  readonly addon: AddonResolution;

  constructorId: string;
};

export type EventResolution = {
  readonly addon: AddonResolution;

  variableId?: string;

  eventInstanceId: string;
};
