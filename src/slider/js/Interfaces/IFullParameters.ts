import IDefaultParameters from './IDefaultParameters';

export default interface IFullParameters extends IDefaultParameters {
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
  onChange: null | Function;
  firstValuePercent?: number;
  secondValuePercent?: number | null;
  percent?: number;
  lastUpdatedOnPercent?: 'firstValue' | 'secondValue';
}
