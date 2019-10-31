export default interface IParameters {
  firstValue?: number;
  firstValuePercent?: number;
  secondValue?: number | null;
  secondValuePercent?: number | null;
  min?: number;
  max?: number;
  step?: number;
  hasInterval?: boolean;
  hasTip?: boolean;
  hasScale?: boolean;
  scaleValues?: object | null;
  isVertical?: boolean;
  theme?: string;
  onChange?: null | Function;
}
