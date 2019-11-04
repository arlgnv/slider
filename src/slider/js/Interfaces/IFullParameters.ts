import IParameters from './IParameters';

export default interface IFullParameters extends IParameters {
  firstValuePercent?: number;
  secondValuePercent?: number | null;
  scaleValues?: {[key: string]: number} | null;
}
