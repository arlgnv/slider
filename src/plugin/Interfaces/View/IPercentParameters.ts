import IDefaultParameters from '../Model/IDefaultParameters';

export default interface IPercentParameters extends IDefaultParameters {
  kind: 'valuePercentUpdated';
  percent: number;
  lastUpdatedOnPercent: 'firstValue' | 'secondValue' | 'either';
}
