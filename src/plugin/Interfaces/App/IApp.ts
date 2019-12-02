import IDefaultParameters from '../Model/IDefaultParameters';

export default interface IApp {
  update(parameters: Partial<IDefaultParameters>): void;
}
