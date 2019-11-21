import IDefaultParameters from '../../IDefaultParameters';

export default interface IRunnerView {
  updateRunner(parameters: IDefaultParameters): void;
  getPositionPercent(): number;
}
