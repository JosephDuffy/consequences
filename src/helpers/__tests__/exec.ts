import asyncExec from '../exec';

// tslint:disable-next-line:no-var-requires
const { stubSpawnOnce } = require('stub-spawn-once');

describe('asyncExec', () => {
  test('should resolve to the contents of stdout if there is no error', async () => {
    const command = 'cat dog.fish';
    const expectedResult = 'echo "woof!";';
    stubSpawnOnce(command, expectedResult, '');

    await expect(asyncExec(command)).resolves.toEqual(expectedResult);
  });

  test('should normalise the output of stdout by trimming whitespace', async () => {
    const command = 'cat dog.fish';
    const expectedResult = 'echo "woof!";';
    stubSpawnOnce(command, `\r\n ${expectedResult} \r\n\r\n \r\n `, '');

    await expect(asyncExec(command)).resolves.toEqual(expectedResult);
  });

  test('should throw the contents of stderr', async () => {
    const command = 'car dog.fish';
    const errorMessage = 'Unknown command \'car\'';
    stubSpawnOnce(command, '', errorMessage);

    await expect(asyncExec(command)).rejects.toThrowError(errorMessage);
  });
});
