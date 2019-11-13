export default interface IDefaultParameters {
  firstValue?: number;
  secondValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  hasInterval?: boolean;
  hasTip?: boolean;
  hasScale?: boolean;
  isVertical?: boolean;
  theme?: 'aqua' | 'red';
  onChange?: null | Function;
}
