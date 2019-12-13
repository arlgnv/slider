import { IDefaultParameters } from '../../Model/IModel';

interface IRunner {
  updateRunner(parameters: IDefaultParameters): void;
}

export default IRunner;
