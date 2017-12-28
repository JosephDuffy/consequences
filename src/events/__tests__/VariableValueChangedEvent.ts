import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import * as sinon from 'sinon';

chai.use(chaiAsPromised);
const { expect } = chai;

import Event from '../../interfaces/Event';
import Variable from '../../interfaces/Variable';
import Variables from '../../models/Variables';
import VariableValueChangedEvent from '../VariableValueChangedEvent';

describe('VariableValueChangedEvent', () => {
  let metadata: Event.Metadata;

  beforeEach(() => {
    metadata = {
      uniqueId: 'event-1',
      lastTriggered: null,
    };
  });

  context('Constructor', () => {
    let constructor: VariableValueChangedEvent.Constructor;

    beforeEach(() => {
      constructor = new VariableValueChangedEvent.Constructor();
    });

    context('#createEvent(metadata:inputs:)', () => {
      it('should create a new `VariableValueChangedEvent`', async () => {
        const variable = new Variables.ReadOnly({
          uniqueId: 'variable-1',
          name: 'Variable 1',
          startingValue: '',
        });

        const inputs = [
          {
            uniqueId: 'variable',
            value: variable,
          },
        ];

        const event = await constructor.createEvent(metadata, inputs);

        expect(event.metadata).to.deep.equal(metadata);
        // tslint:disable-next-line:no-string-literal
        expect(event['variable']).to.deep.equal(variable);
      });

      it('should require the inputs parameter', () => {
        expect(constructor.createEvent(metadata)).to.eventually.be.rejected;
      });

      it('should require an input with the uniqueId "variable"', () => {
        const inputs = [
          {
            uniqueId: 'not-variable',
            value: new Variables.ReadOnly({
              uniqueId: 'variable-1',
              name: 'Variable 1',
              startingValue: '',
            }),
          },
        ];

        expect(constructor.createEvent(metadata, inputs)).to.eventually.be.rejected;
      });

      it('should reject a non-Variable value with the uniqueId "variable"', () => {
        const inputs = [
          {
            uniqueId: 'variable',
            value: {},
          },
        ];

        expect(constructor.createEvent(metadata, inputs)).to.eventually.be.rejected;
      });
    });
  });

  context('instances', () => {
    it('should notify listeners when the variable\'s value is changed', async () => {
      const variable = new Variables.ReadWrite({
        uniqueId: 'variable-1',
        name: 'Variable 1',
        startingValue: '',
      });

      const event = new VariableValueChangedEvent(metadata, variable);

      const callbacks = [
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
      ];

      callbacks.forEach(event.addTriggerEventListener, event);

      const newValue = 'new value';

      await variable.updateValue(newValue);

      callbacks.forEach(callback => {
        expect(callback.calledWith(newValue)).to.be.true;
      });
    });

    it('should notify listeners when the variable\'s value is changed', async () => {
      const variable = new Variables.ReadWrite({
        uniqueId: 'variable-1',
        name: 'Variable 1',
        startingValue: '',
      });

      const event = new VariableValueChangedEvent(metadata, variable);

      const callbackToNotBeCalled = sinon.spy();

      event.addTriggerEventListener(callbackToNotBeCalled);

      const callbacksToBeCalled = [
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
        sinon.spy(),
      ];

      callbacksToBeCalled.forEach(event.addTriggerEventListener, event);

      event.removeTriggerEventListener(callbackToNotBeCalled);

      const newValue = 'new value';

      await variable.updateValue(newValue);

      expect(callbackToNotBeCalled.notCalled).to.be.true;

      callbacksToBeCalled.forEach(callback => {
        expect(callback.calledWith(newValue)).to.be.true;
      });
    });
  });
});
