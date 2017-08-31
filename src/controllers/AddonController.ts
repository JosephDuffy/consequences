
import AddonInitialiser from '../models/AddonInitialiser';
import Core from '../models/Core';

import { Get, JsonController} from 'routing-controllers';
import { Inject, Service } from 'typedi';

@JsonController('/addons')
@Service()
export default class AddonController {

  @Inject()
  private core: Core;

  @Get('/installed')
  public async getInstalledAddons(): Promise<{ [moduleName: string]: AddonInitialiser.Metadata }> {
    const { addonInitialisers } = this.core;

    const addons: { [moduleName: string]: AddonInitialiser.Metadata } = {};

    for (const moduleName of Object.keys(addonInitialisers)) {
      addons[moduleName] = addonInitialisers[moduleName].metadata;
    }

    return addons;
  }

}
