import IDefaultParameters from './IDefaultParameters';

export default interface IFullParameters extends IDefaultParameters {
  kind?: 'stateUpdated' | 'valuePercentUpdated';
  firstValuePercent?: number;
  secondValuePercent?: number | null;
  percent?: number;
  lastUpdatedOnPercent?: 'firstValue' | 'secondValue';
}
