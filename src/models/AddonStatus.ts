import Addon from './Addon';
import AddonInitialiser from './AddonInitialiser';
import UserInput from './UserInput';

interface AddonStatus {
  readonly moduleName: string;

  readonly metadata: AddonInitialiser.Metadata;

  readonly instances: AddonStatus.Instance[];
}

namespace AddonStatus {
  export interface Instance {
    metadata: Addon.Metadata;
  }
}

export default AddonStatus;
