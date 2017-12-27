import { expect } from 'chai';
import * as sinon from 'sinon';
import Action from '../../interfaces/Action';
import Condition from '../../interfaces/Condition';
import UserInput from '../../interfaces/UserInput';
import Link from '../Link';
import BooleanCondition from '../../conditionals/BooleanCondition';

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
    });

    it('should only evaluate conditional links that meet their requirements', async () => {
      const conditionalLinks: Array<[Condition, UserInput.Value[], Link]> = [];
      const stubsToBeCalled: sinon.SinonStub[] = [];
      const stubsToNotBeCalled: sinon.SinonStub[] = [];

      for (let i = 0; i < 10; i++) {
        const condition = new BooleanCondition.True();
        const link = new Link(`test-link-${i}`, [], []);
        const stub = sinon.stub(link, 'evaluate');
        const shouldSucceed = i % 2 === 0;

        conditionalLinks.push([
          condition,
          [
            {
              uniqueId: 'input',
              value: shouldSucceed,
            },
          ],
          link,
        ]);

        if (shouldSucceed) {
          stubsToBeCalled.push(stub);
        } else {
          stubsToNotBeCalled.push(stub);
        }
      }

      const rootLink = new Link('root-test-link-1', conditionalLinks, []);
      await rootLink.evaluate();

      stubsToBeCalled.forEach(stub => {
        expect(stub.calledOnce).to.be.true;
      });

      stubsToNotBeCalled.forEach(stub => {
        expect(stub.notCalled).to.be.true;
      });
    });
  });
});
