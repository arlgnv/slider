import Observer from '../Observer/Observer';
import { IModel, IDefaultParameters, IPercentParameters, IRegularParameters } from '../Interfaces/Model/IModel';
import { PERCENT_MAX, STEP_VALUE_DEFAULT } from '../constants';

class Model extends Observer implements IModel {
  private state: IDefaultParameters;

  constructor(parameters: IRegularParameters) {
    super();

    this.state = this.validateParameters(parameters);
  }

  public dispatchState(parameters: IRegularParameters | IPercentParameters): void {
    this.state = this.validateParameters({ ...this.state, ...parameters });

    this.notify('updatedState', this.state);
  }

  public getState(): IDefaultParameters {
    return this.state;
  }

  private validateParameters(parameters: IRegularParameters | IPercentParameters): IDefaultParameters {
    switch (parameters.kind) {
      case 'valuePercentUpdated':
        return this.validateParametersWithUpdatedPercent(parameters);
      case 'stateUpdated':
        return this.validateParametersWithUpdatedState(parameters);
    }
  }

  private validateParametersWithUpdatedState(parameters: IRegularParameters): IDefaultParameters {
    const { step } = this.validateStep(parameters);
    const { min, max } = this.validateMinMax(parameters);
    const { firstValue, secondValue } = this.validateValues({ ...parameters, step, min, max });
    const { firstValuePercent, secondValuePercent } = this.calculateValuesPercent({
      ...parameters,
      firstValue,
      secondValue,
      min,
      max,
    });

    return { ...parameters, firstValue, secondValue, firstValuePercent, secondValuePercent, min, max, step };
  }

  private validateParametersWithUpdatedPercent(parameters: IPercentParameters): IDefaultParameters {
    const { firstValue, secondValue } = this.validateValues(parameters);
    const { firstValuePercent, secondValuePercent } = this.calculateValuesPercent({
      ...parameters,
      firstValue,
      secondValue,
    });

    return { ...parameters, firstValue, secondValue, firstValuePercent, secondValuePercent };
  }

  private validateValues(parameters: IDefaultParameters): IDefaultParameters {
    return parameters.hasInterval
      ? {
          ...parameters,
          ...this.validateIntervalValues(parameters),
        }
      : {
          ...parameters,
          firstValue: this.validateSingleValue(parameters, 'firstValue'),
          secondValue: null,
        };
  }

  private validateSingleValue(parameters: IDefaultParameters, valueType: string): number {
    const { kind, percent, max, min, step } = parameters;

    if (kind === 'valuePercentUpdated') {
      const convertedValue = this.convertPercentToValue(percent, min, max);

      if (convertedValue >= max) return max;
      if (convertedValue <= min) return min;

      const newValue = Math.round((convertedValue - min) / step) * step + min;
      return newValue >= max ? max : newValue;
    }

    if (kind === 'stateUpdated') {
      const value = parameters[valueType];

      if (value >= max || value === null) return max;
      if (value <= min) return min;

      const newValue = Math.round((value - min) / step) * step + min;
      return newValue >= max ? max : newValue;
    }
  }

  private validateIntervalValues(parameters: IDefaultParameters): IDefaultParameters {
    const { kind } = parameters;

    if (kind === 'valuePercentUpdated') {
      const { lastUpdatedOnPercent, percent, firstValuePercent, secondValuePercent } = parameters;

      if (lastUpdatedOnPercent === 'firstValue') {
        const firstValue = this.validateSingleValue(parameters, 'firstValue');
        const { secondValue } = parameters;

        return firstValue > secondValue
          ? { ...parameters, secondValue, firstValue: secondValue }
          : { ...parameters, firstValue, secondValue };
      }

      if (lastUpdatedOnPercent === 'secondValue') {
        const { firstValue } = parameters;
        const secondValue = this.validateSingleValue(parameters, 'secondValue');

        return firstValue > secondValue
          ? { ...parameters, firstValue, secondValue: firstValue }
          : { ...parameters, firstValue, secondValue };
      }

      if (lastUpdatedOnPercent === 'either') {
        const isSecondValueNearer =
          Math.abs(percent - firstValuePercent) > Math.abs(percent - secondValuePercent) ||
          (percent > firstValuePercent && percent > secondValuePercent);

        if (isSecondValueNearer) {
          const { firstValue } = parameters;
          const secondValue = this.validateSingleValue(parameters, 'secondValue');

          return { ...parameters, firstValue, secondValue };
        }

        const firstValue = this.validateSingleValue(parameters, 'firstValue');
        const { secondValue } = parameters;

        return { ...parameters, firstValue, secondValue };
      }
    }

    if (kind === 'stateUpdated') {
      const firstValue = this.validateSingleValue(parameters, 'firstValue');
      const secondValue = this.validateSingleValue(parameters, 'secondValue');

      return firstValue > secondValue
        ? {
            ...parameters,
            firstValue: Math.min(firstValue, secondValue),
            secondValue: Math.max(firstValue, secondValue),
          }
        : { ...parameters, firstValue, secondValue };
    }
  }

  private validateMinMax(parameters: IDefaultParameters): IDefaultParameters {
    const { min, max } = parameters;

    return {
      ...parameters,
      min: min > max ? Math.round(Math.min(max, min)) : min,
      max: min > max ? Math.round(Math.max(max, min)) : max,
    };
  }

  private validateStep(parameters: IDefaultParameters): IDefaultParameters {
    const { step } = parameters;

    return {
      ...parameters,
      step: step < STEP_VALUE_DEFAULT ? STEP_VALUE_DEFAULT : Math.round(step),
    };
  }

  private calculateValuesPercent(parameters: IDefaultParameters): IDefaultParameters {
    const { hasInterval, firstValue, secondValue, min, max } = parameters;

    return {
      ...parameters,
      firstValuePercent: ((firstValue - min) * PERCENT_MAX) / (max - min),
      secondValuePercent: hasInterval ? ((secondValue - min) * PERCENT_MAX) / (max - min) : null,
    };
  }

  private convertPercentToValue(percent: number, min: number, max: number): number {
    return min + (percent * (max - min)) / PERCENT_MAX;
  }
}

export default Model;
