import IParameters from '../IParameters';
import { IRunnerParameters } from '../IRunnerParameters';

export default interface IModel {
  updateState(data: IParameters | IRunnerParameters): void;
  getState(): IParameters;
}
