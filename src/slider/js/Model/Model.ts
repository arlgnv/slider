import EventEmitter from '../EventEmitter/EventEmitter';
import IModel from '../Interfaces/Model/IModel';
import IParameters from '../Interfaces/IParameters';
import IRunnerParameters from '../Interfaces/IRunnerParameters';
import IScaleParameters from '../Interfaces/IScaleParameters';
import IUpdateParameters from '../Interfaces/IUpdateParameters';

export default class Model extends EventEmitter implements IModel {
  private state: IParameters;

  constructor(parameters: IParameters) {
    super();

    this.state = this.validateParameters({ ...parameters, condition: 'afterUpdateState' });
  }

  public updateState(parameters: IUpdateParameters | IRunnerParameters | IScaleParameters): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });

    this.notify('updateState', this.state);
  }

  public getState(): IParameters {
    return this.state;
  }

  private validateParameters(
    parameters: IUpdateParameters | IRunnerParameters | IScaleParameters): IParameters {
    let validatedParameters: IParameters;

    switch (parameters.condition) {
      case 'afterUpdateState':
        validatedParameters = this.validateParametersAfterUpdateState(parameters);
        break;
      case 'afterUpdatePercent':
        validatedParameters = this.validateParametersAfterUpdatePercent(parameters);
        break;
      case 'afterUpdateSingleValue':
        validatedParameters = this.validateParametersAfterUpdateSingleValue(parameters);
      default: break;
    }

    const { firstValue, secondValue, min, max, hasInterval } = validatedParameters;
    validatedParameters.firstValuePercent = this.convertValueToPercent(firstValue, min,  max);
    validatedParameters.secondValuePercent =
      hasInterval === true ? this.convertValueToPercent(secondValue, min,  max) : null;

    return validatedParameters;
  }

  private validateParametersAfterUpdateState(parameters: IParameters): IParameters {
    const step = this.validateStepValue(parameters.step);
    const { min, max } = this.validateMinMax(parameters);
    const { firstValue, secondValue } = this.validateValues({ ...parameters, step, min, max });

    return { ...parameters, firstValue, secondValue, min, max, step };
  }

  private validateParametersAfterUpdatePercent(parameters: IRunnerParameters): IParameters {
    const { firstPositionPercent, secondPositionPercent, min, max } = parameters;
    let { firstValue, secondValue } = parameters;

    firstValue = 'firstPositionPercent' in parameters
      ? this.convertValueFromPercentToNum(firstPositionPercent, min, max) : firstValue;
    secondValue = 'secondPositionPercent' in parameters
      ? this.convertValueFromPercentToNum(secondPositionPercent, min, max) : secondValue;

    delete parameters.firstPositionPercent;
    delete parameters.secondPositionPercent;

    return { ...parameters, ...this.validateValues({ ...parameters, firstValue, secondValue }) };
  }

  private validateParametersAfterUpdateSingleValue(parameters: IScaleParameters): IParameters {
    const { scaleValue } = parameters;
    let { firstValue, secondValue } = parameters;

    if (parameters.hasInterval === true) {
      const isFirstValueNearer =
        (Math.max(firstValue, scaleValue) - Math.min(firstValue, scaleValue))
        < (Math.max(secondValue, scaleValue) - Math.min(secondValue, scaleValue));

      if (isFirstValueNearer) firstValue = scaleValue;
      else secondValue = scaleValue;
    } else firstValue = scaleValue;

    delete parameters.scaleValue;

    return {
      ...parameters, ...this.validateValues({ ...parameters, firstValue, secondValue }) };
  }

  private validateMinMax({ min, max }: IParameters): IParameters {
    return min > max
      ? { min: Math.round(Math.min(max, min)), max: Math.round(Math.max(max, min)) }
      : { min: Math.round(min), max: Math.round(max) };
  }

  private validateValues({firstValue: first, secondValue: second,
    min, max, step, hasInterval }: IParameters): IParameters {
    let [firstValue, secondValue] = [first, second];

    firstValue = firstValue !== min && firstValue < max
      ? this.correctValueWithStep(firstValue, step, min) : firstValue;
    firstValue = firstValue > max ? max : firstValue < min ? min : firstValue;

    if (hasInterval === true) {
      secondValue = secondValue === null ? max : secondValue;
      secondValue = secondValue !== max
        ? this.correctValueWithStep(secondValue, step, min) : secondValue;
      secondValue = secondValue > max ? max : secondValue < min ? min : secondValue;

      [firstValue, secondValue] = firstValue > secondValue
        ? [Math.min(firstValue, secondValue), Math.max(firstValue, secondValue)]
        : [firstValue, secondValue];
    }

    return { firstValue, secondValue };
  }

  private validateStepValue(value: number): number {
    return value < 1 ? 1 : Math.round(value);
  }

  private correctValueWithStep(value: number, step: number, min: number): number {
    return (Math.round((value - min) / step) * step + min);
  }

  private convertValueToPercent(value: number, min: number, max: number): number {
    return ((value - min) * 100) / (max - min);
  }

  private convertValueFromPercentToNum(value: number, min: number, max: number): number {
    return min + (value * (max - min)) / 100;
  }
}
