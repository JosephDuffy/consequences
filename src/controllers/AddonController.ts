import { Body, Get, JsonController, Param, Post} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import AddonsManager from '../models/AddonsManager';
import AddonStatus from '../models/AddonStatus';
import { AddonOptions } from '../models/Database';

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
  public async createAddonInstance(@Param('moduleName') moduleName: string, @Body() options?: AddonOptions): Promise<AddonStatus.Instance> {
    const instance = await this.addonsManager.createNewAddonInstance(moduleName, options);

    return {
      metadata: instance.instance.metadata,
      options: instance.options,
    };
  }

}
