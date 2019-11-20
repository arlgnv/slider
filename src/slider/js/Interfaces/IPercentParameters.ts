import IFullParameters from './IFullParameters';

export default interface IPercentParameters extends IFullParameters {
  kind: 'valuePercentUpdated';
  percent: number;
  lastUpdatedOnPercent: 'firstValue' | 'secondValue';
}
