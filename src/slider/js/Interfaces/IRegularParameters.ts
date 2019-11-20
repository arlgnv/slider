import IFullParameters from './IFullParameters';

export default interface IRegularParameters extends IFullParameters {
  kind: 'stateUpdated';
}
