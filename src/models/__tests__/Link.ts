import Link from '../Link';
import * as sinon from 'sinon';
import Action from '../../interfaces/Action';
import UserInput from '../../interfaces/UserInput';
import { expect } from 'chai';

describe('Link', () => {
  describe('#evaluate()', () => {
    it('should execute all of its actions', async () => {
      const actions: Array<[Action, UserInput.Value[]]> = [];
      const stubs: sinon.SinonStub[] = [];

      for (let i = 0; i < 3; i++) {
        const promise = Promise.resolve();
        const stub = sinon.stub().returns(promise);
        const action = {
          uniqueId: `${i}`,
          perform: stub,
        };
        actions.push([action, []]);
        stubs.push(stub);
      }

      const link = new Link('test-link-1', [], actions);
      await link.evaluate();

      stubs.forEach(stub => {
        expect(stub.calledOnce).to.be.true;
      });
    })
  })
})