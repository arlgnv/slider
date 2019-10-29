import EventEmitter from '../EventEmitter/EventEmitter';
import IModel from '../Interfaces/Model/IModel';
import IParameters from '../Interfaces/IParameters';
import IPositionsPercent from '../Interfaces/IPositionsPercent';

export default class Model extends EventEmitter implements IModel {
  private state: IParameters;

  constructor(parameters: IParameters) {
    super();

    this.state = this.validateParameters(parameters);
  }

  public updateState(parameters: IParameters | IPositionsPercent): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });

    this.notify('updateState', this.state); // console.log(this.state);
  }

  public getState(): IParameters {
    return this.state;
  }

  private validateParameters(parameters: IParameters | IPositionsPercent): IParameters {
    let {
      firstValue, secondValue, firstValuePercent, secondValuePercent,
      min, max, step, theme, hasInterval, hasTip, isVertical, onChange,
    } = parameters;

    const validatedMinMax = this.validateMinMax(min, max);
    min = validatedMinMax.min;
    max = validatedMinMax.max;

    step = this.validateStepValue(step);
    theme = this.validateThemeValue(theme);
    isVertical = this.validateBooleanType(isVertical);
    hasTip = this.validateBooleanType(hasTip);
    hasInterval = this.validateBooleanType(hasInterval);
    onChange = this.validateFunctionValue(onChange);

    const values = this.validateValues(parameters);
    firstValue = values.firstValue;
    firstValuePercent = this.convertValueToPercent(firstValue, min, max);
    secondValue = values.secondValue;
    secondValuePercent = hasInterval ? this.convertValueToPercent(secondValue, min, max) : null;

    return {
      firstValue, secondValue, firstValuePercent, secondValuePercent,
      min, max, step, theme, hasInterval, hasTip, isVertical, onChange,
    };
  }

  private validateMinMax(minValue: number, maxValue: number): IParameters {
    const values: IParameters = {};

    values.min = typeof minValue !== 'number' ? 0 : Math.round(minValue);
    values.max = typeof maxValue !== 'number' ? 100 : Math.round(maxValue);

    if (values.min > values.max) {
      const min = Math.min(values.max, values.min);
      const max = Math.max(values.max, values.min);

      values.min = min;
      values.max = max;
    }

    return values;
  }

  private validateValues(parameters: IParameters | IPositionsPercent): IParameters {
    const { firstValue, secondValue, min, max, step } = parameters;
    const values: IParameters = {};

    if (parameters.hasInterval) {
      values.firstValue = typeof firstValue !== 'number' ? min : firstValue;
      values.secondValue = typeof secondValue !== 'number' ? max : secondValue;

      values.firstValue = 'firstPositionPercent' in parameters
        ? this.convertValueFromPercentToNum(parameters.firstPositionPercent, min, max)
        : values.firstValue;

      values.secondValue = 'secondPositionPercent' in parameters
        ? this.convertValueFromPercentToNum(parameters.secondPositionPercent, min, max)
        : values.secondValue;

      if (values.firstValue > min && values.firstValue < max) {
        values.firstValue = this.correctValueWithStep(values.firstValue, step, min);
      }

      if (values.firstValue < min) values.firstValue = min;
      if (values.firstValue > values.secondValue) values.firstValue = values.secondValue;

      if (values.secondValue > min && values.secondValue < max) {
        values.secondValue = this.correctValueWithStep(values.secondValue, step, min);
      }

      if (values.secondValue < values.firstValue) values.secondValue = values.firstValue;
      if (values.secondValue > max) values.secondValue = max;

      if (values.firstValue > values.secondValue) {
        const min = Math.min(values.firstValue, values.secondValue);
        const max = Math.max(values.firstValue, values.secondValue);

        values.firstValue = min;
        values.secondValue = max;
      }
    }

    if (!parameters.hasInterval) {
      values.firstValue = typeof firstValue !== 'number' ? min : firstValue;

      if ('firstPositionPercent' in parameters) {
        values.firstValue =
          this.convertValueFromPercentToNum(parameters.firstPositionPercent, min, max);
      }

      const isValueInRange = values.firstValue > min && values.firstValue < max;
      if (isValueInRange) {
        values.firstValue = this.correctValueWithStep(values.firstValue, step, min);
      }

      if (values.firstValue < min) values.firstValue = min;
      if (values.firstValue > max) values.firstValue = max;

      values.secondValue = null;
    }

    return values;
  }

  private validateStepValue(value: number): number {
    const isStepInvalid = typeof value !== 'number' || value < 1;

    return isStepInvalid ? 1 : value;
  }

  private validateThemeValue(theme: string): string {
    const isThemeInvalid = theme !== 'aqua' && theme !== 'red';

    return isThemeInvalid ? 'aqua' : theme;
  }

  private validateBooleanType(value: boolean): boolean {
    return typeof value !== 'boolean' ? false : value;
  }

  private validateFunctionValue(value: Function): null | Function {
    return typeof value !== 'function' ? null : value;
  }

  private correctValueWithStep(value: number, step: number, min: number): number {
    return (Math.round((value - min) / step) * step + min);
  }

  private convertValueToPercent(value: number, min: number, max: number): number {
    return ((value - min) * 100) / (max - min);
  }

  private convertValueFromPercentToNum(value: number, min: number, max: number): number {
    return Math.round(min + (value * (max - min)) / 100);
  }
}
