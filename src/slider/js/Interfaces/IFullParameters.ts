import IDefaultParameters from './IDefaultParameters';

export default interface IFullParameters extends IDefaultParameters {
  condition: 'updatedOnPercent' | 'updatedOnInteger';
  firstValuePercent: number;
  secondValuePercent: number | null;
}
