import IDefaultParameters from '../IDefaultParameters';

export default interface IApp {
  update(parameters: IDefaultParameters): void;
}
