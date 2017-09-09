import * as createError from 'http-errors';
import { Context } from 'koa';
import { Body, Ctx, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import Addon from '../models/Addon';
import AddonsManager from '../models/AddonsManager';
import AddonStatus from '../models/AddonStatus';
import { AddonOptions } from '../models/Database';
import Variable from '../models/Variable';
import VariableState from '../models/VariableState';

@JsonController('/addons')
@Service()
export default class AddonController {

  @Inject()
  private addonsManager: AddonsManager;

  @Get('/')
  public async getAddonsStatus(): Promise<AddonStatus[]> {
    return this.addonsManager.addonStatus;
  }

  @Post('/:moduleName/')
  public async createAddonInstance(
    @Param('moduleName') moduleName: string,
    @Body() options?: AddonOptions,
  ): Promise<AddonStatus.Instance> {
    const instance = await this.addonsManager.createNewAddonInstance(moduleName, options);

    return {
      metadata: instance.instance.metadata,
      options: instance.options,
    };
  }

  @Get('/:moduleName/:addonId/variables/')
  public async getAddonVariables(
    @Ctx() context: Context,
    @Param('moduleName') moduleName: string,
    @Param('addonId') addonId: string,
  ): Promise<VariableState[]> {
    const instance = this.retrieveAddon(moduleName, addonId);

    const variables = this.addonsManager.variables[instance.metadata.instanceId];

    if (!variables) {
      context.status = 204;
      return;
    }

    const variableStates: VariableState[] = [];

    for (const variable of variables) {
      variableStates.push({
        id: variable.uniqueId,
        name: variable.name,
        value: await variable.retrieveValue(),
        supportsManualUpdating: !!variable.updateValue,
      });
    }

    return variableStates;
  }

  @Get('/:moduleName/:addonId/variables/:variableId')
  public async getAddonVariableState(
    @Param('moduleName') moduleName: string,
    @Param('addonId') addonId: string,
    @Param('variableId') variableId: string,
  ): Promise<VariableState> {
    const variable = this.retrieveVariable(moduleName, addonId, variableId);

    return {
      id: variable.uniqueId,
      name: variable.name,
      value: await variable.retrieveValue(),
      supportsManualUpdating: !!variable.updateValue,
    };
  }

  @Put('/:moduleName/:addonId/variables/:variableId/value')
  public updateAddonVariableValue(
    @Ctx() context: Context,
    @Param('moduleName') moduleName: string,
    @Param('addonId') addonId: string,
    @Param('variableId') variableId: string,
    @Body() body: {newValue: any},
  ) {
    const variable = this.retrieveVariable(moduleName, addonId, variableId);

    if (!variable.updateValue) {
      throw createError(400, 'Variable does not support being updated');
    }

    try {
      variable.updateValue(body.newValue);
      context.status = 204;
    } catch (error) {
      throw createError(400, `Addon rejected value`, { addonError: error });
    }
  }

  private retrieveAddon(moduleName: string, addonId: string): Addon {
    const addonInstances = this.addonsManager.instances[moduleName];

    if (!addonInstances) {
      throw createError(404, `An addon with the module name ${moduleName} was not found`);
    }

    const addonInstance = addonInstances.find(instance => instance.instance.metadata.instanceId === addonId);

    if (!addonInstance) {
      throw createError(404, `No instance of the addon with id ${addonId} from the ${moduleName} module was found`);
    }

    return addonInstance.instance;
  }

  private retrieveVariable(moduleName: string, addonId: string, variableId: string): Variable {
    const addon = this.retrieveAddon(moduleName, addonId);

    const variables = this.addonsManager.variables[addon.metadata.instanceId];

    if (!variables) {
      throw createError(400, `The ${addon.metadata.name} instance ${addonId} does not have any variables`);
    }

    const foundVariable = variables.find(variable => variable.uniqueId === variableId);

    if (!foundVariable) {
      throw createError(404, `The ${addon.metadata.name} instance ${addonId} does not have a variable with the id ${variableId}`);
    }

    return foundVariable;
  }

}
