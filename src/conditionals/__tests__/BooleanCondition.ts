import { expect } from 'chai';
import BooleanCondition from '../BooleanCondition';

describe('BooleanCondition', () => {
  context('True', () => {
    let condition: BooleanCondition.True;

    beforeEach(() => {
      condition = new BooleanCondition.True();
    });

    describe('#evaluate(inputs:)', () => {
      it('should return `true` when passed an input with id "input" and value "true"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: true,
          },
        ]);

        expect(result).to.be.true;
      });

      it('should return `true` when passed multiple inputs with id "input", the first with value "true" and second value "false"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: true,
          },
          {
            uniqueId: 'input',
            value: false,
          },
        ]);

        expect(result).to.be.true;
      });

      it('should return `false` when passed multiple inputs with id "input", the first with value "false" and second value "true"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: false,
          },
          {
            uniqueId: 'input',
            value: true,
          },
        ]);

        expect(result).to.be.false;
      });

      it('should return `false` with 0 inputs', async () => {
        const result = await condition.evaluate([]);

        expect(result).to.be.false;
      });

      it('should return `false` when no values have the id "input"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'not-input',
            value: true,
          },
        ]);

        expect(result).to.be.false;
      });
    });
  });

  context('False', () => {
    let condition: BooleanCondition.False;

    beforeEach(() => {
      condition = new BooleanCondition.False();
    });

    describe('#evaluate(inputs:)', () => {
      it('should return `true` when passed an input with id "input" and value "false"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: false,
          },
        ]);

        expect(result).to.be.true;
      });

      it('should return `true` when passed multiple inputs with id "input", the first with value "false" and second value "true"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: false,
          },
          {
            uniqueId: 'input',
            value: true,
          },
        ]);

        expect(result).to.be.true;
      });

      it('should return `false` when passed multiple inputs with id "input", the first with value "true" and second value "false"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'input',
            value: true,
          },
          {
            uniqueId: 'input',
            value: false,
          },
        ]);

        expect(result).to.be.false;
      });

      it('should return `false` with 0 inputs', async () => {
        const result = await condition.evaluate([]);

        expect(result).to.be.false;
      });

      it('should return `false` when no values have the id "input"', async () => {
        const result = await condition.evaluate([
          {
            uniqueId: 'not-input',
            value: false,
          },
        ]);

        expect(result).to.be.false;
      });
    });
  });
});
