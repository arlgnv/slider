import IDefaultParameters from '../../Model/IDefaultParameters';
import IRegularParameters from '../../View/IRegularParameters';
import IPercentParameters from '../../View/IPercentParameters';

export default interface IModel {
  dispatchState(parameters: IRegularParameters | IPercentParameters): void;
  getState(): IDefaultParameters;
}
