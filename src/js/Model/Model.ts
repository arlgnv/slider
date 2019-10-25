import EventEmitter from '../EventEmitter/EventEmitter';
import IParameters from '../IParameters';

export default class Model extends EventEmitter {
  private state: IParameters;

  constructor(parameters: IParameters = {}) {
    super();

    this.state = this.correctParameters(parameters);
  }

  updateState(data: IParameters, onMouseMove?: boolean): void {
    if (onMouseMove) {
      const valueType = 'from' in data ? 'from' : 'to';

      data[valueType] = Math.round(
        this.state.min + (data[valueType] * (this.state.max - this.state.min)) / 100,
      );
    }

    this.state = this.correctParameters({ ...this.state, ...data });

    const isFromInRange = this.state.from > this.state.min && this.state.from < this.state.max;
    if (isFromInRange) this.state.from = this.correctValueWithStep(this.state.from);

    const isToInRange =
      this.state.to > this.state.min &&
      this.state.to < this.state.max &&
      this.state.hasInterval;
    if (isToInRange) this.state.to = this.correctValueWithStep(this.state.to);

    this.state = this.correctParameters(this.state);

    const newData = { ...this.state };
    newData.from = this.convertValueToPercent(newData.from, newData.min, newData.max);

    if (newData.hasInterval) {
      newData.to = this.convertValueToPercent(newData.to, newData.min, newData.max);
    }

    this.notify('updateState', newData);
  }

  getState(): IParameters {
    return this.state;
  }

  private correctValueWithStep(value: number): number {
    return (
      Math.round((value - this.state.min) / this.state.step) * this.state.step + this.state.min
    );
  }

  private convertValueToPercent(value: number, min: number, max: number): number {
    return ((value - min) * 100) / (max - min);
  }

  private correctParameters(parameters: IParameters): IParameters {
    if (this.isNotNumber(parameters.min)) parameters.min = 0;
    if (this.isNotNumber(parameters.from)) parameters.from = parameters.min;
    if (this.isNotNumber(parameters.max)) parameters.max = 100;

    if (parameters.max < parameters.min) {
      const min = Math.min(parameters.max, parameters.min);
      const max = Math.max(parameters.max, parameters.min);

      parameters.min = min;
      parameters.max = max;
    }

    const isStepInvalid = this.isNotNumber(parameters.step) || parameters.step < 1;
    if (isStepInvalid) parameters.step = 1;

    if (this.isNotBoolean(parameters.isVertical)) parameters.isVertical = false;
    if (this.isNotBoolean(parameters.hasTip)) parameters.hasTip = false;
    if (this.isNotBoolean(parameters.hasInterval)) parameters.hasInterval = false;

    const isThemeInvalid = parameters.theme !== 'aqua' && parameters.theme !== 'red';
    parameters.theme = isThemeInvalid ? 'aqua' : parameters.theme;

    if (parameters.hasInterval) {
      if (this.isNotNumber(parameters.to)) parameters.to = parameters.max;

      const isFromOutOfRange = parameters.from < parameters.min || parameters.from > parameters.max;
      if (isFromOutOfRange) parameters.from = parameters.min;

      const isToOutOfRange = parameters.to < parameters.min || parameters.to > parameters.max;
      if (isToOutOfRange) parameters.to = parameters.max;

      if (parameters.from > parameters.to) {
        const max = Math.max(parameters.from, parameters.to);
        const min = Math.min(parameters.from, parameters.to);

        parameters.from = min;
        parameters.to = max;
      }
    }

    if (!parameters.hasInterval) {
      if (parameters.from < parameters.min) parameters.from = parameters.min;
      if (parameters.from > parameters.max) parameters.from = parameters.max;

      parameters.to = null;
    }

    if (this.isNotFunction(parameters.onChange)) parameters.onChange = null;

    return parameters;
  }

  private isNotNumber(value: number): boolean {
    return typeof value !== 'number';
  }

  private isNotBoolean(value: boolean): boolean {
    return typeof value !== 'boolean';
  }

  private isNotFunction(value: Function): boolean {
    return typeof value !== 'function';
  }
}
