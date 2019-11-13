import EventEmitter from '../EventEmitter/EventEmitter';
import IModel from '../Interfaces/Model/IModel';
import IDefaultParameters from '../Interfaces/IDefaultParameters';
import IFullParameters from '../Interfaces/IFullParameters';
import IPercentParameters from '../Interfaces/IPercentParameters';
import IIntegerParameters from '../Interfaces/IIntegerParameters';

export default class Model extends EventEmitter implements IModel {
  private state: IFullParameters;

  constructor(parameters: IDefaultParameters) {
    super();

    this.state = this.validateParameters({ ...parameters, condition: 'updatedOnInteger' });
  }

  public updateState(parameters: IIntegerParameters | IPercentParameters): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });

    this.notify('updateState', this.state);
  }

  public getState(): IFullParameters {
    return this.state;
  }

  private validateParameters(parameters: IIntegerParameters | IPercentParameters): IFullParameters {
    if (parameters.condition === 'updatedOnInteger') {
      return this.validateParametersWithInteger(parameters);
    }

    if (parameters.condition === 'updatedOnPercent') {
      return this.validateParametersWithPercent(parameters);
    }
  }

  private validateParametersWithInteger(parameters: IIntegerParameters): IFullParameters {
    const { hasInterval } = parameters;
    const step = this.validateStepValue(parameters.step);
    const { min, max } = this.validateMinMax(parameters);
    const { firstValue, secondValue } = this.validateValues({ ...parameters, step, min, max });
    const firstValuePercent = this.convertValueToPercent(firstValue, min,  max);
    const secondValuePercent =
      hasInterval === true ? this.convertValueToPercent(secondValue, min,  max) : null;

    return { ...parameters, firstValue, firstValuePercent, secondValue, secondValuePercent,
      min, max, step };
  }

  private validateParametersWithPercent(parameters: IPercentParameters): IFullParameters {
    const { updatedValue, min, max, hasInterval } = parameters;

    parameters[updatedValue] =
      this.convertValueFromPercentToNum(parameters[updatedValue], min, max);
    delete parameters.updatedValue;

    const { firstValue, secondValue } = this.validateValues(parameters);
    const firstValuePercent = this.convertValueToPercent(firstValue, min,  max);
    const secondValuePercent =
      hasInterval === true ? this.convertValueToPercent(secondValue, min,  max) : null;

    return { ...parameters, firstValue, secondValue, firstValuePercent, secondValuePercent };
  }

  private validateMinMax({ min, max }: IDefaultParameters): IDefaultParameters {
    return min > max
      ? { min: Math.round(Math.min(max, min)), max: Math.round(Math.max(max, min)) }
      : { min: Math.round(min), max: Math.round(max) };
  }

  private validateValues({ firstValue, secondValue,
    min, max, step, hasInterval }: IDefaultParameters): IDefaultParameters {
    let [first, second] = [firstValue, secondValue];

    first = first > min && first < max
      ? this.correctValueWithStep(first, step, min) : first;
    first = first > max ? max : first < min ? min : first;

    if (hasInterval === true) {
      second = second === null ? max : second;
      second = second !== max
        ? this.correctValueWithStep(second, step, min) : second;
      second = second > max ? max : second < min ? min : second;

      [first, second] = first > second
        ? [Math.min(first, second), Math.max(first, second)] : [first, second];
    }

    return { firstValue: first, secondValue: second };
  }

  private validateStepValue(value: number): number {
    return value < 1 ? 1 : Math.round(value);
  }

  private correctValueWithStep(value: number, step: number, min: number): number {
    return Math.round((value - min) / step) * step + min;
  }

  private convertValueToPercent(value: number, min: number, max: number): number {
    return ((value - min) * 100) / (max - min);
  }

  private convertValueFromPercentToNum(value: number, min: number, max: number): number {
    return Math.round(min + (value * (max - min)) / 100);
  }
}
