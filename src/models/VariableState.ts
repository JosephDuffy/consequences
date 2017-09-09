export default interface VariableState {
  readonly id: string;
  readonly name: string;
  readonly value: any;
  readonly supportsManualUpdating: boolean;
}
