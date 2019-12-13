import { IDefaultParameters } from '../Model/IModel';

interface IApp {
  update(parameters: Partial<IDefaultParameters>): void;
}

export default IApp;
