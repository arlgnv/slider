import IDefaultParameters from './IDefaultParameters';

export default interface IPercentParameters extends IDefaultParameters {
  condition: 'updatedOnPercent';
  percent: number;
  lastUpdatedOnPercent: 'firstValue' | 'secondValue';
}
