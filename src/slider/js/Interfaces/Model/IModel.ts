import IParameters from '../IParameters';
import { IRunnerParameters } from '../IRunnerParameters';
import { IScaleParameters } from '../IScaleParameters';

export default interface IModel {
  updateState(data: IParameters | IRunnerParameters | IScaleParameters): void;
  getState(): IParameters;
}
