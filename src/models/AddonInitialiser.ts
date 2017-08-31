import Addon from './Addon';

interface AddonInitialiser {

  readonly metadata: AddonInitialiser.Metadata;

  /**
   * Create and return a new `Addon` instance.
   *
   * @param {Addon.Metadata} metadata
   * @param {{ [id: string]: any; }} [configOptions]
   * @returns {Promise<Addon>}
   * @memberof AddonInitialiser
   */
  createInstance(metadata: Addon.Metadata, configOptions?: { [id: string]: any; }): Promise<Addon>;

}

namespace AddonInitialiser {
  export interface Metadata {
    readonly name: string;

    readonly description: string;

    readonly configOptions?: Addon.ConfigOption[];
  }

  export function validate(arg: any): arg is AddonInitialiser {
    return typeof arg.metadata === 'object' &&
          validateMetadata(arg.metadata) &&
          typeof arg.createInstance === 'function';
  }

  export function validateMetadata(arg: any): arg is AddonInitialiser.Metadata {
    return typeof arg.name === 'string' &&
          typeof arg.description === 'string';
  }

}

export default AddonInitialiser;
