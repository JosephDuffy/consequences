import { exec } from 'child_process';

export default async function asyncExec(command: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        throw error;
      }

      // Remove new line etc.
      const normalisedResult = stdout.trim();

      resolve(normalisedResult);
    });
  });
}
