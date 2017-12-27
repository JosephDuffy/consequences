import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
// tslint:disable-next-line:no-var-requires
const { stubSpawnOnce } = require('stub-spawn-once');

chai.use(chaiAsPromised);
const { expect } = chai;

import asyncExec from '../exec';

describe('asyncExec', () => {
  it('should resolve to the contents of stdout if there is no error', async () => {
    const command = 'cat dog.fish';
    const expectedResult = 'echo "woof!";';
    stubSpawnOnce(command, expectedResult, '');

    expect(asyncExec(command)).to.eventually.become(expectedResult);
  });

  it('should normalise the output of stdout by trimming whitespace', async () => {
    const command = 'cat dog.fish';
    const expectedResult = 'echo "woof!";';
    stubSpawnOnce(command, `\r\n ${expectedResult} \r\n\r\n \r\n `, '');

    expect(asyncExec(command)).to.eventually.become(expectedResult);
  });

  it('should throw the contents of stderr', () => {
    const command = 'car dog.fish';
    const errorMessage = 'Unknown command \'car\'';
    stubSpawnOnce(command, '', errorMessage);

    expect(asyncExec(command)).to.eventually.be.rejectedWith(new Error(errorMessage));
  });
});
