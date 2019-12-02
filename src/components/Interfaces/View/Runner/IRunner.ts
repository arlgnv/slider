import { IDefaultParameters } from '../../Model/IModel';

export default interface IRunner {
  updateRunner(parameters: IDefaultParameters): void;
}
