import Observer from '../Observer/Observer';
import IModel from '../Interfaces/Model/IModel';
import IFullParameters from '../Interfaces/IFullParameters';
import IRegularParameters from '../Interfaces/IRegularParameters';
import IPercentParameters from '../Interfaces/IPercentParameters';

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
        return this.validateParametersWithUpdatedPercent(parameters);
      case 'stateUpdated':
        return this.validateParametersWithUpdatedState(parameters);
    }
  }

  private validateParametersWithUpdatedState(parameters: IRegularParameters): IFullParameters {
    const { step } = this.validateStep(parameters);
    const { min, max } = this.validateMinMax(parameters);
    const { firstValue, secondValue } = this.validateValues({ ...parameters, step, min, max });
    const { firstValuePercent, secondValuePercent } =
      this.calculateValuesPercent({ ...parameters, firstValue, secondValue, min, max });

    return { ...parameters, firstValue, secondValue, firstValuePercent, secondValuePercent,
      min, max, step };
  }

  private validateParametersWithUpdatedPercent(parameters: IPercentParameters): IFullParameters {
    const { firstValue, secondValue } = this.validateValues(parameters);
    const { firstValuePercent, secondValuePercent } =
      this.calculateValuesPercent({ ...parameters, firstValue, secondValue });

    return { ...parameters, firstValue, secondValue, firstValuePercent, secondValuePercent };
  }

  private validateValues(parameters: IFullParameters): IFullParameters {
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

  private validateSingleValue(parameters: IFullParameters, valueType: string): number {
    const { kind, lastUpdatedOnPercent, percent, max, min, step } = parameters;

    if (kind === 'valuePercentUpdated') {
      if (lastUpdatedOnPercent === valueType) {
        const convertedValue = this.convertPercentToValue(percent, min, max);
        const newValue = Math.round((convertedValue - min) / step) * step + min;
        return newValue >= max ? max : newValue;
      }

      return parameters[valueType];
    }

    if (kind === 'stateUpdated') {
      const value = parameters[valueType];

      if (value >= max || value === null) return max;
      if (value <= min) return min;

      const newValue = Math.round((value - min) / step) * step + min;
      return newValue >= max ? max : newValue;
    }
  }

  private validateIntervalValues(parameters: IFullParameters): IFullParameters {
    const firstValue = this.validateSingleValue(parameters, 'firstValue');
    const secondValue = this.validateSingleValue(parameters, 'secondValue');

    return {
      ...parameters,
      firstValue: firstValue > secondValue ? Math.min(firstValue, secondValue) : firstValue,
      secondValue: firstValue > secondValue ? Math.max(firstValue, secondValue) : secondValue,
    };
  }

  private validateMinMax(parameters: IFullParameters): IFullParameters {
    const { min, max } = parameters;

    return {
      ...parameters,
      min: min > max ? Math.round(Math.min(max, min)) : min,
      max: min > max ? Math.round(Math.max(max, min)) : max,
    };
  }

  private validateStep(parameters: IFullParameters): IFullParameters {
    const { step } = parameters;

    return {
      ...parameters,
      step: step < 1 ? 1 : Math.round(step),
    };
  }

  private calculateValuesPercent(parameters: IFullParameters): IFullParameters {
    const { hasInterval, firstValue, secondValue, min, max } = parameters;

    return {
      ...parameters,
      firstValuePercent: (firstValue - min) * 100 / (max - min),
      secondValuePercent: hasInterval ? (secondValue - min) * 100 / (max - min) : null,
    };
  }

  private convertPercentToValue(percent: number, min: number, max: number): number {
    return min + (percent * (max - min)) / 100;
  }
}
