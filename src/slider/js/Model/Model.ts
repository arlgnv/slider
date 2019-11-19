import Observer from '../Observer/Observer';
import IModel from '../Interfaces/Model/IModel';
import IFullParameters from '../Interfaces/IFullParameters';
import IPercentParameters from '../Interfaces/IPercentParameters';
import IRegularParameters from '../Interfaces/IRegularParameters';

export default class Model extends Observer implements IModel {
  private state: IFullParameters;

  constructor(parameters: IRegularParameters) {
    super();

    this.state = this.validateParameters(parameters);
  }

  public dispatchState(parameters: IRegularParameters | IPercentParameters): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });
    this.notify('updateState', this.state);
  }

  public getState(): IFullParameters {
    return this.state;
  }

  private validateParameters(parameters: IRegularParameters | IPercentParameters): IFullParameters {
    switch (parameters.kind) {
      case 'valuePercentUpdated':
        return this.validateParametersAfterUpdatePercent(parameters);
      case 'stateUpdated':
        return this.validateParametersAfterUpdateState(parameters);
    }
  }

  private validateParametersAfterUpdateState(parameters: IRegularParameters): IFullParameters {
    const { step } = this.validateStep(parameters);
    const { min, max } = this.validateMinMax(parameters);

    return { ...parameters, ...this.validateValues({ ...parameters, step, min, max }),
      min, max, step };
  }

  private validateParametersAfterUpdatePercent(parameters: IPercentParameters): IFullParameters {
    const { lastUpdatedOnPercent, percent, min, max } = parameters;

    return {
      ...parameters,
      ...this.validateValues({
        ...parameters,
        [lastUpdatedOnPercent]: this.convertValueFromPercentToNum(percent, min, max)}) };
  }

  private validateMinMax({ min, max }: IFullParameters): IFullParameters {
    return min > max
      ? { min: Math.round(Math.min(max, min)), max: Math.round(Math.max(max, min)) }
      : { min: Math.round(min), max: Math.round(max) };
  }

  private validateValues({ firstValue, secondValue,
    min, max, step, hasInterval }: IFullParameters): IFullParameters {
    const newValues: IFullParameters = {};

    if (firstValue >= max) {
      newValues.firstValue = max;
    } else if (firstValue <= min) {
      newValues.firstValue = min;
    } else {
      const newFirstValue = Math.round((firstValue - min) / step) * step + min;
      newValues.firstValue = newFirstValue >= max ? max : newFirstValue;
    }

    newValues.secondValue = newValues.secondValuePercent = null;

    if (hasInterval) {
      if (secondValue === null) {
        newValues.secondValue = max;
      } else {
        if (secondValue >= max) {
          newValues.secondValue = max;
        } else if (secondValue <= min) {
          newValues.secondValue = min;
        } else {
          const newSecondValue = Math.round((secondValue - min) / step) * step + min;
          newValues.secondValue = newSecondValue >= max ? max : newSecondValue;
        }
      }

      if (newValues.firstValue > newValues.secondValue) {
        const minValue = Math.min(newValues.firstValue, newValues.secondValue);
        const maxValue = Math.max(newValues.firstValue, newValues.secondValue);
        const [newFirstValue, newSecondValue] = [minValue, maxValue];

        newValues.firstValue = newFirstValue;
        newValues.secondValue = newSecondValue;
      }

      newValues.secondValuePercent = this.calculateValuePercent(newValues.secondValue, min,  max);
    }

    newValues.firstValuePercent = this.calculateValuePercent(newValues.firstValue, min,  max);

    return newValues;
  }

  private validateStep({ step }: IFullParameters): IFullParameters {
    return { step: step < 1 ? 1 : Math.round(step) };
  }

  private calculateValuePercent(value: number, min: number, max: number): number {
    return (value - min) * 100 / (max - min);
  }

  private convertValueFromPercentToNum(percent: number, min: number, max: number): number {
    return min + (percent * (max - min)) / 100;
  }
}
