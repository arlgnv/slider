interface IRunnerParameters {
  firstPositionPercent?: number;
  secondPositionPercent?: number;
}

function instanceOfIRunnerParameters(object: object): object is IRunnerParameters {
  return 'firstPositionPercent' in object || 'secondPositionPercent' in object;
}

export { IRunnerParameters, instanceOfIRunnerParameters };
