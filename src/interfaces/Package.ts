
export interface Package {
  name: string;
  description?: string;
  author?: string;
  version: string;
  main: string;
  keywords: string[];
  peerDependencies: string[];
}

export function validatePackage(arg: any): arg is Package {
  return typeof arg.name === 'string' &&
         typeof arg.version === 'string' &&
         typeof arg.main === 'string' &&
         arg.keywords !== undefined &&
         arg.peerDependencies !== undefined;
}

export default Package;
