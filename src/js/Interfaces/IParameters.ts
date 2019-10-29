export default interface IParameters {
  firstValue?: number;
  firstValuePercent?: number | null;
  secondValue?: number | null;
  secondValuePercent?: number | null;

  min?: number;
  max?: number;
  step?: number;

  hasInterval?: boolean;
  isVertical?: boolean;
  hasTip?: boolean;

  theme?: string;

  onChange?: null | Function;
}
