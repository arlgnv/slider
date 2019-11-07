import IParameters from './IParameters';

export default interface IUpdateParameters extends IParameters {
  condition?: 'afterUpdateState';
}
