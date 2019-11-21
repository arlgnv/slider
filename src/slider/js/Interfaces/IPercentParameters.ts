import IDefaultParameters from './IDefaultParameters';

export default interface IPercentParameters extends IDefaultParameters {
  kind: 'valuePercentUpdated';
  percent: number;
  lastUpdatedOnPercent: 'firstValue' | 'secondValue';
}
