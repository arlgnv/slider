import IDefaultParameters from './IDefaultParameters';

export default interface IRegularParameters extends IDefaultParameters {
  kind: 'stateUpdated';
}
