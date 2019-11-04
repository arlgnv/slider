// tslint:disable:max-line-length

import EventEmitter from '../EventEmitter/EventEmitter';
import IModel from '../Interfaces/Model/IModel';
import IParameters from '../Interfaces/IParameters';
import IFullParameters from '../Interfaces/IFullParameters';
import { IRunnerParameters, instanceOfIRunnerParameters } from '../Interfaces/IRunnerParameters';
import { IScaleParameters, instanceOfIScaleParameters } from '../Interfaces/IScaleParameters';

export default class Model extends EventEmitter implements IModel {
  private state: IFullParameters;

  constructor(parameters: IParameters) {
    super(); // console.log(this.state);

    this.state = this.validateParameters(parameters);
  }

  public updateState(parameters: IParameters | IRunnerParameters | IScaleParameters): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });

    this.notify('updateState', this.state);
  }

  public getState(): IParameters {
    return this.state;
  }

  private validateParameters(parameters: IParameters | IRunnerParameters | IScaleParameters): IFullParameters {
    let { firstValue, secondValue, min, max,  hasInterval,
      step, theme, hasTip, hasScale, isVertical, onChange } = <IParameters>parameters;

    if (instanceOfIRunnerParameters(parameters)) {
      const { firstPositionPercent, secondPositionPercent } = parameters;

      firstValue = 'firstPositionPercent' in parameters
        ? this.convertValueFromPercentToNum(firstPositionPercent, min, max) : firstValue;
      secondValue = 'secondPositionPercent' in parameters
        ? this.convertValueFromPercentToNum(secondPositionPercent, min, max) : secondValue;

      [firstValue, secondValue] =
        this.validateValues({ firstValue, secondValue, min, max, step, hasInterval });
    } else if (instanceOfIScaleParameters(parameters)) {
      const { scaleValue } = parameters;

      if (hasInterval) {
        const isFirstValueNearer =
        (Math.max(firstValue, scaleValue) - Math.min(firstValue, scaleValue))
          < (Math.max(secondValue, scaleValue) - Math.min(secondValue, scaleValue));

        if (isFirstValueNearer) firstValue = scaleValue;
        else secondValue = scaleValue;
      } else firstValue = scaleValue;
    } else {
      [min, max] = this.validateMinMax({ min, max });
      step = this.validateStepValue(step);
      theme = this.validateThemeValue(theme);
      isVertical = this.validateBooleanType(isVertical);
      hasTip = this.validateBooleanType(hasTip);
      hasInterval = this.validateBooleanType(hasInterval);
      onChange = this.validateFunctionValue(onChange);
      hasScale = this.validateBooleanType(hasScale);
      [firstValue, secondValue] =
        this.validateValues({ firstValue, secondValue, min, max, step, hasInterval });
    }

    const firstValuePercent = this.convertValueToPercent(firstValue, min,  max);
    const secondValuePercent = hasInterval ? this.convertValueToPercent(secondValue, min,  max) : null;
    const scaleValues = hasScale ? this.getScaleValues(min, max, step) : null;

    return {firstValue, secondValue, firstValuePercent, secondValuePercent,
      min, max, step, theme, hasInterval, hasTip, hasScale, scaleValues, isVertical, onChange };
  }

  private validateMinMax(minMax: IParameters): number[] {
    let { min, max } = minMax;

    min = typeof min !== 'number' ? 0 : Math.round(min);
    max = typeof max !== 'number' ? 100 : Math.round(max);

    return min > max ? [Math.min(max, min), Math.max(max, min)] : [min, max];
  }

  private validateValues(parameters: IParameters): number[] {
    let { firstValue, secondValue } = parameters;
    const { min, max, step, hasInterval } = parameters;

    firstValue = typeof firstValue !== 'number' ? min : Math.round(firstValue);

    firstValue = firstValue !== min && firstValue !== max
      ? this.correctValueWithStep(firstValue, step, min) : firstValue;

    firstValue = firstValue < min ? min : firstValue;
    firstValue = firstValue > max ? max : firstValue;

    if (hasInterval) {
      secondValue = typeof secondValue !== 'number' ? max : Math.round(secondValue);

      secondValue = secondValue !== max
        ? this.correctValueWithStep(secondValue, step, min) : secondValue;

      secondValue = secondValue < min ? min : secondValue;
      secondValue = secondValue > max ? max : secondValue;

      [firstValue, secondValue] = firstValue > secondValue
        ? [Math.min(firstValue, secondValue), Math.max(firstValue, secondValue)]
        : [firstValue, secondValue];
    } else secondValue = null;

    return [firstValue, secondValue];
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

  private getScaleValues(min: number, max: number, step: number): {[key: string]: number} {
    let values = { [min]: 0 };

    for (let i: number = min + step; i < max; i += step) {
      values = { ...values, ...{ [i]: this.convertValueToPercent(i, min, max) } };
    }

    return { ...values, ...{ [max]: 100 } };
  }
}
