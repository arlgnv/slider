import IParameters from './IParameters';

export default interface IScaleParameters extends IParameters {
  condition?: 'afterUpdateSingleValue';
  scaleValue?: number;
}
