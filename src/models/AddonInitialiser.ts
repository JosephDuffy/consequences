import Addon from './Addon';

interface AddonInitialiser {

  /**
   * Information about the addon that can be used prior to the addon
   * being setup, along with the information that's required to create
   * a new instance of the addon.
   *
   * @type {AddonInitialiser.Metadata}
   * @memberof AddonInitialiser
   */
  readonly metadata: AddonInitialiser.Metadata;

  /**
   * Create and return a new `Addon` instance.
   *
   * This method must be implemented by addon authors.
   *
   * The `configOptions` parameter will be an array of options that were provided
   * by the `metadata.configOptions` property. If an option's `required` property
   * is `true` it is guaranteed that that option will be in the array and will
   * have passed type checking.
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
    /**
     * The user-friendly display name for the addon.
     *
     * @type {string}
     * @memberof Metadata
     */
    readonly name: string;

    /**
     * A user-friendly description of the addon.
     *
     * @type {string}
     * @memberof Metadata
     */
    readonly description: string;

    /**
     * When this value is `true` it indicates to consequences that more than one instance
     * of the addon is supported. When this value is `false` the user will only be able to
     * create one instance of this addon. For example, an addon may support multiple accounts
     * on the same platform, which would create multiple distinct instances of the addon.
     *
     * @type {boolean}
     * @memberof Metadata
     */
    readonly supportsMultipleInstances: boolean;

    /**
     * Configuration options that may be passed to the `createInstance` function.
     *
     * @type {Addon.ConfigOption[]}
     * @memberof Metadata
     */
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
