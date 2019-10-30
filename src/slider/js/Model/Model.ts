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
      firstValue, secondValue, firstValuePercent, secondValuePercent, onChange,
      min, max, step, theme, hasInterval, hasTip, hasScale, scaleValues, scaleValue, isVertical,
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
    hasScale = this.validateBooleanType(hasScale);
    scaleValues = hasScale ? this.getScaleValues(min, max, step) : null;

    const values = this.validateValues(parameters);
    firstValue = values.firstValue;
    firstValuePercent = this.convertValueToPercent(firstValue, min, max);
    secondValue = hasInterval ? values.secondValue : null;
    secondValuePercent = hasInterval ? this.convertValueToPercent(secondValue, min, max) : null;

    scaleValue = null;

    return {
      firstValue, secondValue, firstValuePercent, secondValuePercent, onChange,
      min, max, step, theme, hasInterval, hasTip, hasScale, scaleValues, scaleValue, isVertical,
    };
  }

  private validateMinMax(minValue: number, maxValue: number): IParameters {
    const values: IParameters = {};

    values.min = typeof minValue !== 'number' ? 0 : Math.round(minValue);
    values.max = typeof maxValue !== 'number' ? 100 : Math.round(maxValue);

    if (values.min > values.max) {
      const [min, max] = [Math.min(values.max, values.min), Math.max(values.max, values.min)];

      values.min = min;
      values.max = max;
    }

    return values;
  }

  private validateValues(parameters: IParameters | IPositionsPercent): IParameters {
    const { firstValue, secondValue, min, max, step } = parameters;
    const values: IParameters = {};

    values.firstValue = typeof firstValue !== 'number' ? min : Math.round(firstValue);

    values.firstValue = 'firstPositionPercent' in parameters
      ? this.convertValueFromPercentToNum(parameters.firstPositionPercent, min, max)
      : values.firstValue;

    values.firstValue = values.firstValue !== min && values.firstValue !== max
      ? this.correctValueWithStep(values.firstValue, step, min)
      : values.firstValue;

    values.firstValue = values.firstValue < min ? min : values.firstValue;
    values.firstValue = values.firstValue > max ? max : values.firstValue;

    if (parameters.hasInterval) {
      values.secondValue = typeof secondValue !== 'number' ? max : secondValue;

      values.secondValue = 'secondPositionPercent' in parameters
        ? this.convertValueFromPercentToNum(parameters.secondPositionPercent, min, max)
        : values.secondValue;

      values.secondValue = values.secondValue !== max
        ? this.correctValueWithStep(values.secondValue, step, min) : values.secondValue;

      values.secondValue = values.secondValue < min ? min : values.secondValue;
      values.secondValue = values.secondValue > max ? max : values.secondValue;

      if (values.firstValue > values.secondValue) {
        const min = Math.min(values.firstValue, values.secondValue);
        const max = Math.max(values.firstValue, values.secondValue);

        values.firstValue = min;
        values.secondValue = max;
      }
    }

    if (parameters.scaleValue !== null) {
      if (parameters.hasInterval) {
        const isFirstValueNearer =
          (Math.max(values.firstValue, parameters.scaleValue) -
          Math.min(values.firstValue, parameters.scaleValue))
          < (Math.max(values.secondValue, parameters.scaleValue) -
          Math.min(values.secondValue, parameters.scaleValue));

        if (isFirstValueNearer) values.firstValue = parameters.scaleValue;
        else values.secondValue = parameters.scaleValue;
      }

      if (!parameters.hasInterval) {
        values.firstValue = parameters.scaleValue;
      }
    }

    return values;
  }

  private validateStepValue(value: number): number {
    const isStepInvalid = typeof value !== 'number' || value < 1;

    return isStepInvalid ? 1 : Math.round(value);
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
    return Math.round((Math.round((value - min) / step) * step + min));
  }

  private convertValueToPercent(value: number, min: number, max: number): number {
    return ((value - min) * 100) / (max - min);
  }

  private convertValueFromPercentToNum(value: number, min: number, max: number): number {
    return Math.round(min + (value * (max - min)) / 100);
  }

  private getScaleValues(min: number, max: number, step: number): object {
    let values = { [min]: 0 };

    for (let i: number = min + step; i < max; i += step) {
      values = { ...values, ...{ [i]: this.convertValueToPercent(i, min, max) } };
    }

    return { ...values, ...{ [max]: 100 } };
  }
}
