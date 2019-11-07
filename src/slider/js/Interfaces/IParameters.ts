export default interface IParameters {
  condition?: 'afterUpdateState' | 'afterUpdatePercent' | 'afterUpdateSingleValue';
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
  isVertical?: boolean;
  theme?: 'aqua' | 'red';
  onChange?: null | Function;
}
