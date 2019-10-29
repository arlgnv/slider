import IParameters from '../IParameters';
import IPositionsPercent from '../IPositionsPercent';

export default interface IModel {
  updateState(data: IParameters | IPositionsPercent): void;
  getState(): IParameters;
}
