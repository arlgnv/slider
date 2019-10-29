import IParameters from '../IParameters';

export default interface IModel {
  updateState(data: IParameters): void;
  getState(): IParameters;
}
