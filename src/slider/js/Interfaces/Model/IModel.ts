import IFullParameters from '../IFullParameters';
import IIntegerParameters from '../IIntegerParameters';
import IPercentParameters from '../IPercentParameters';

export default interface IModel {
  updateState(parameters: IIntegerParameters | IPercentParameters): void;
  getState(): IFullParameters;
}
