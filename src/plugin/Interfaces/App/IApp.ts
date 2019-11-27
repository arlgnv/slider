import IDefaultParameters from '../IDefaultParameters';

export default interface IApp {
  update(parameters: Partial<IDefaultParameters>): void;
}
