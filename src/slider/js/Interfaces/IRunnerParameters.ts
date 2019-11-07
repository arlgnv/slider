import IParameters from './IParameters';

export default interface IRunnerParameters extends IParameters {
  condition?: 'afterUpdatePercent';
  firstPositionPercent?: number;
  secondPositionPercent?: number;
}
