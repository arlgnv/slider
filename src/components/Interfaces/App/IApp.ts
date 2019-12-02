import { IDefaultParameters } from '../Model/IModel';

export default interface IApp {
  update(parameters: Partial<IDefaultParameters>): void;
}
