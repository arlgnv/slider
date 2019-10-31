interface IScaleParameters {
  scaleValue?: number;
}

function instanceOfIScaleParameters(object: object): object is IScaleParameters {
  return 'scaleValue' in object;
}

export { IScaleParameters, instanceOfIScaleParameters };
