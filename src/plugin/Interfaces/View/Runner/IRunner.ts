import IDefaultParameters from '../../Model/IDefaultParameters';

export default interface IRunner {
  updateRunner(parameters: IDefaultParameters): void;
}
