import { IDefaultParameters } from '../Model/IModel';

interface IPresenter {
  update(parameters: Partial<IDefaultParameters>): void;
}

export default IPresenter;
