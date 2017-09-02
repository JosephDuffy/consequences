import { Get, JsonController} from 'routing-controllers';
import { Inject, Service } from 'typedi';

import AddonsManager, { AddonStatus } from '../models/AddonsManager';

@JsonController('/addons')
@Service()
export default class AddonController {

  @Inject()
  private addonsManager: AddonsManager;

  @Get('/')
  public async getAddonsStatus(): Promise<AddonStatus[]> {
    return this.addonsManager.addonStatus;
  }

}
