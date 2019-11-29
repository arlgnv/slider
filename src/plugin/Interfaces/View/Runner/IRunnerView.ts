import IDefaultParameters from '../../../Model/IDefaultParameters';

export default interface IRunnerView {
  updateRunner(parameters: IDefaultParameters): void;
}
