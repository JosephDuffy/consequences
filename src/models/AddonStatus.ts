import Addon from './Addon';
import AddonInitialiser from './AddonInitialiser';
import { AddonOptions } from './Database';

interface AddonStatus {
  readonly moduleName: string;

  readonly metadata: AddonInitialiser.Metadata;

  readonly instances: AddonStatus.Instance[];
}

namespace AddonStatus {
  export interface Instance {
    metadata: Addon.Metadata;
    options?: AddonOptions;
  }
}

export default AddonStatus;
