export default interface IDefaultParameters {
  kind: 'stateUpdated' | 'valuePercentUpdated';
  firstValue: number;
  secondValue: number | null;
  min: number;
  max: number;
  step: number;
  hasInterval: boolean;
  hasTip: boolean;
  hasScale: boolean;
  isVertical: boolean;
  theme: 'aqua' | 'red';
  onChange: Function | null;
  firstValuePercent: number;
  secondValuePercent: number | null;
  percent?: number;
  lastUpdatedOnPercent?: 'firstValue' | 'secondValue' | 'either';
}
