import { Body, Get, HttpError, JsonController, OnUndefined, Param, Post, Put } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import * as winston from 'winston';

import Addon from '../interfaces/Addon';
import AddonsManager from '../models/AddonsManager';
import AddonStatus from '../interfaces/AddonStatus';
import UserInput from '../interfaces/UserInput';
import Variable from '../interfaces/Variable';
import VariableCollection from '../interfaces/VariableCollection';
import VariableState from '../interfaces/VariableState';

@JsonController('/addons')
@Service()
export default class AddonController {

  @Inject()
  private addonsManager: AddonsManager;

  @Get('/')
  public async getAddonsStatuses(): Promise<AddonStatus[]> {
    const initialisers = this.addonsManager.initialisers;
    const instances = this.addonsManager.instances;

    const statuses: AddonStatus[] = [];

    for (const moduleName of Object.keys(initialisers)) {
      const initialiser = initialisers[moduleName];

      const moduleInstances = (instances[moduleName] || []).map((instance) => {
        return {
          metadata: instance.metadata,
        };
      });

      statuses.push({
        moduleName,
        metadata: initialiser.metadata,
        instances: moduleInstances,
      });
    }

    return statuses;
  }

  @Post('/:moduleName/')
  public async createAddonInstance(
    @Param('moduleName') moduleName: string,
    @Body() inputs?: { [uniqueId: string]: any },
  ): Promise<AddonStatus.Instance> {
    const inputsArray: UserInput.Value[] = [];

    for (const inputKey of Object.keys((inputs || {}))) {
      inputsArray.push({
        uniqueId: inputKey,
        value: inputs[inputKey],
      });
    }

    const instance = await this.addonsManager.createNewAddonInstance(moduleName, inputsArray);

    return {
      metadata: instance.metadata,
    };
  }

  @Get('/:moduleName/:instanceId/variables/')
  @OnUndefined(204)
  public async getAddonVariables(
    @Param('moduleName') moduleName: string,
    @Param('instanceId') instanceId: string,
  ): Promise<VariableState[]> {
    const instance = this.retrieveAddon(moduleName, instanceId);

    if (!instance.variables) {
      return;
    }

    const variables = await instance.variables;

    const variableStates: VariableState[] = [];

    async function addVariable(variable: Variable, parent?: {uniqueId: string, name: string }) {
      variableStates.push({
        id: variable.uniqueId,
        name: variable.name,
        value: await variable.retrieveValue(),
        supportsManualUpdating: !!variable.updateValue,
        parent,
      });
    }

    for (const varOrCollection of variables) {
      if (VariableCollection.isVariableCollection(varOrCollection)) {
        const parent = {
          uniqueId: varOrCollection.uniqueId,
          name: varOrCollection.name,
        };
        for (const variable of varOrCollection.variables) {
          await addVariable(variable, parent);
        }
      } else {
        await addVariable(varOrCollection);
      }
    }

    return variableStates;
  }

  @Get('/:moduleName/:instanceId/variables/:variableId')
  public async getAddonVariableState(
    @Param('moduleName') moduleName: string,
    @Param('instanceId') instanceId: string,
    @Param('variableId') variableId: string,
  ): Promise<VariableState> {
    const variable = await this.retrieveVariable(moduleName, instanceId, variableId);

    return {
      id: variable.uniqueId,
      name: variable.name,
      value: await variable.retrieveValue(),
      supportsManualUpdating: !!variable.updateValue,
    };
  }

  @Put('/:moduleName/:instanceId/variables/:variableId/value')
  @OnUndefined(204)
  public async updateAddonVariableValue(
    @Param('moduleName') moduleName: string,
    @Param('instanceId') instanceId: string,
    @Param('variableId') variableId: string,
    @Body() body: {newValue: any},
  ) {
    const variable = await this.retrieveVariable(moduleName, instanceId, variableId);

    if (!variable.updateValue) {
      throw new HttpError(400, 'Variable does not support being updated');
    }

    try {
      await variable.updateValue(body.newValue);
    } catch (error) {
      winston.error(error);
      throw new HttpError(400, `Addon failed to set value. See logs for more information`);
    }
  }

  private retrieveAddon(moduleName: string, instanceId: string): Addon {
    const addonInstances = this.addonsManager.instances[moduleName];

    if (!addonInstances) {
      throw new HttpError(404, `An addon with the module name ${moduleName} was not found`);
    }

    const addonInstance = addonInstances.find(instance => instance.metadata.instanceId === instanceId);

    if (!addonInstance) {
      throw new HttpError(404, `No instance of the addon with id ${instanceId} from the ${moduleName} module was found`);
    }

    return addonInstance;
  }

  private async retrieveVariable(moduleName: string, instanceId: string, variableId: string): Promise<Variable> {
    const addon = this.retrieveAddon(moduleName, instanceId);

    if (!addon.variables) {
      throw new HttpError(400, `The ${addon.metadata.name} instance ${instanceId} does support variables`);
    }

    const variables = await addon.variables;

    if (!variables) {
      throw new HttpError(400, `The ${addon.metadata.name} instance ${instanceId} does not have any variables`);
    }

    const variable = (() => {
      for (const varOrCollection of variables) {
        if (VariableCollection.isVariableCollection(varOrCollection)) {
          for (const childVariable of varOrCollection.variables) {
            if (childVariable.uniqueId === variableId) {
              return childVariable;
            }
          }
        } else if (varOrCollection.uniqueId === variableId) {
          return varOrCollection;
        }
      }
    })();

    if (!variable) {
      throw new HttpError(404, `The ${addon.metadata.name} instance ${instanceId} does not have a variable with the id ${variableId}`);
    }

    return variable;
  }

}
