import IDefaultParameters from '../IDefaultParameters';
import IRegularParameters from '../IRegularParameters';
import IPercentParameters from '../IPercentParameters';

export default interface IModel {
  dispatchState(parameters: IRegularParameters | IPercentParameters): void;
  getState(): IDefaultParameters;
}
