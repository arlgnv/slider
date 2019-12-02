import { IDefaultParameters } from '../../Model/IModel';

export default interface IScale {
  updateScale(parameters: IDefaultParameters): void;
}
