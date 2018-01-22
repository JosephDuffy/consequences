import NumericCondition from '../NumericCondition';

describe.only('NumericCondition.GreaterThan', () => {
  let condition: NumericCondition.GreaterThan;

  beforeEach(() => {
    condition = new NumericCondition.GreaterThan();
  });

  describe('#evaluate(inputs:)', () => {

    function evaluateInputs(lhs: any, rhs: any): Promise<boolean> {
      const inputs = [
        {
          uniqueId: 'lhs_input',
          value: lhs,
        },
        {
          uniqueId: 'rhs_input',
          value: rhs,
        },
      ];

      return condition.evaluate(inputs);
    }

    // Left-hand side greater than than right-hand side

    it('should return `true` when the lhs is the number 0 and rhs is Number.MIN_VALUE', async () => {
      await expect(evaluateInputs(Number.MIN_VALUE, 0)).resolves.toBe(true);
    });

    it('should return `true` when the lhs is Number.MIN_VALUE negated and rhs is the number 0', async () => {
      await expect(evaluateInputs(0, -Number.MIN_VALUE)).resolves.toBe(true);
    });

    it('should return `true` when the lhs is the number 0 and rhs is the number 1', async () => {
      await expect(evaluateInputs(1, 0)).resolves.toBe(true);
    });

    it('should return `true` when the lhs is the number -1 and rhs is the number 0', async () => {
      await expect(evaluateInputs(0, -1)).resolves.toBe(true);
    });

    it('should return `true` when the lhs is the number -1 and rhs is the number 1', async () => {
      await expect(evaluateInputs(1, -1)).resolves.toBe(true);
    });

    it('should return `true` when the lhs is negative infinity and rhs is positive infinity', async () => {
      await expect(evaluateInputs(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY)).resolves.toBe(true);
    });

    // Left-hand side less than right-hand side

    it('should return `false` when the lhs is the number 0 and rhs is Number.MIN_VALUE', async () => {
      await expect(evaluateInputs(0, Number.MIN_VALUE)).resolves.toBe(false);
    });

    it('should return `false` when the lhs is Number.MIN_VALUE negated and rhs is the number 0', async () => {
      await expect(evaluateInputs(-Number.MIN_VALUE, 0)).resolves.toBe(false);
    });

    it('should return `false` when the lhs is the number 0 and rhs is the number 1', async () => {
      await expect(evaluateInputs(0, 1)).resolves.toBe(false);
    });

    it('should return `false` when the lhs is the number -1 and rhs is the number 0', async () => {
      await expect(evaluateInputs(-1, 0)).resolves.toBe(false);
    });

    it('should return `false` when the lhs is the number -1 and rhs is the number 1', async () => {
      await expect(evaluateInputs(-1, 1)).resolves.toBe(false);
    });

    it('should return `false` when the lhs is negative infinity and rhs is positive infinity', async () => {
      await expect(evaluateInputs(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).resolves.toBe(false);
    });

    // Equal

    it('should return `false` when both the lhs and rhs inputs are 0', async () => {
      await expect(evaluateInputs(0, 0)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are 1', async () => {
      await expect(evaluateInputs(1, 1)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are -1', async () => {
      await expect(evaluateInputs(-1, -1)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are Number.MIN_VALUE', async () => {
      await expect(evaluateInputs(Number.MIN_VALUE, Number.MIN_VALUE)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are Number.MAX_VALUE', async () => {
      await expect(evaluateInputs(Number.MAX_VALUE, Number.MAX_VALUE)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are the maximum safe integer', async () => {
      await expect(evaluateInputs(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are the minimum safe integer', async () => {
      await expect(evaluateInputs(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are positive infinity', async () => {
      await expect(evaluateInputs(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are negative infinity', async () => {
      await expect(evaluateInputs(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are 612356.234872354', async () => {
      await expect(evaluateInputs(612356.234872354, 612356.234872354)).resolves.toBe(false);
    });

    it('should return `false` when both the lhs and rhs inputs are -183957.416591', async () => {
      await expect(evaluateInputs(-183957.416591, -183957.416591)).resolves.toBe(false);
    });
  });
});
