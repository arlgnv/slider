import IDefaultParameters from '../Model/IDefaultParameters';

export default interface IRegularParameters extends IDefaultParameters {
  kind: 'stateUpdated';
}
