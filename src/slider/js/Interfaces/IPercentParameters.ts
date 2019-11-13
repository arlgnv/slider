import IDefaultParameters from './IDefaultParameters';

export default interface IPercentParameters extends IDefaultParameters {
  condition: 'updatedOnPercent';
  updatedValue: 'firstValue' | 'secondValue';
}
