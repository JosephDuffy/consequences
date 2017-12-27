import { exec } from 'child_process';

export default async function asyncExec(command: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      /* istanbul ignore if */
      if (error) {
        throw error;
      }

      if (stderr !== '') {
        throw new Error(stderr);
      }

      // Remove new line etc.
      const normalisedResult = stdout.trim();

      resolve(normalisedResult);
    });
  });
}
