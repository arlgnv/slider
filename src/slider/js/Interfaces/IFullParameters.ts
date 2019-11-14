import IDefaultParameters from './IDefaultParameters';

export default interface IFullParameters extends IDefaultParameters {
  condition: 'updatedOnPercent' | 'updated';
  firstValuePercent: number;
  secondValuePercent: number | null;
}
