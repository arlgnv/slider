/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import EventEmitter from '../EventEmitter/EventEmitter';

export default class Model extends EventEmitter {
  constructor(settings = {}) {
    super();

    this.state = this.correctSettings(settings);
  }

  get ratio() {
    return this._ratio;
  }

  set ratio(dividend) {
    this._ratio = dividend / (this.state.max - this.state.min);
  }

  correctSettings(settings) {
    const parameters = settings;

    parameters.min = parseFloat(parameters.min);
    const isMinInvalid = Number.isNaN(parameters.min);
    if (isMinInvalid) parameters.min = 0;

    parameters.from = parseFloat(parameters.from);
    const isFromInvalid = Number.isNaN(parameters.from);
    if (isFromInvalid) parameters.from = parameters.min;

    parameters.max = parseFloat(parameters.max);
    const isMaxInvalid = Number.isNaN(parameters.max);
    if (isMaxInvalid) parameters.max = 100;

    if (parameters.max < parameters.min) {
      const min = Math.min(parameters.max, parameters.min);
      const max = Math.max(parameters.max, parameters.min);

      parameters.min = min;
      parameters.max = max;
    }

    parameters.step = parseFloat(parameters.step);
    const isStepInvalid = Number.isNaN(parameters.step) || parameters.step < 1;
    if (isStepInvalid) parameters.step = 1;

    const isThemeInvalid = parameters.theme !== 'aqua' && parameters.theme !== 'red';
    if (isThemeInvalid) parameters.theme = 'aqua';

    const isVerticalInvalid = parameters.isVertical !== false && parameters.isVertical !== true;
    if (isVerticalInvalid) parameters.isVertical = false;

    const isTipInvalid = parameters.hasTip !== false && parameters.hasTip !== true;
    if (isTipInvalid) parameters.hasTip = false;

    const isIntervalInvalid = parameters.hasInterval !== true && parameters.hasInterval !== false;
    if (isIntervalInvalid) parameters.hasInterval = false;

    if (parameters.hasInterval) {
      parameters.to = parseFloat(parameters.to);
      const isToInvalid = Number.isNaN(parameters.to);
      if (isToInvalid) parameters.to = parameters.max;

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
    }

    const isOnChangeInvalid = typeof parameters.onChange !== 'function';
    if (isOnChangeInvalid) parameters.onChange = null;

    return parameters;
  }

  updateState(data) {
    this.state = { ...this.state, ...data };

    if (this.state.onChange) this.state.onChange(this.state.hasInterval ? `${this.state.from} - ${this.state.to}` : `${this.state.from}`);

    this.notify('updateState', data);
  }

  getValueFromPosition(position) {
    return this.state.min + Math.round(position / this.ratio);
  }

  isValueProper(value) {
    return value !== this.state.min
      && value !== this.state.max
      && value !== this.state.from
      && value !== this.state.to;
  }

  correctValueWithStep(value) {
    return Math.round((value - this.state.min) / this.state.step)
      * this.state.step + this.state.min;
  }

  correctValueWithEdges(value, type) {
    let correctedValue = value;

    if (this.state.hasInterval) {
      if (type === 'from') {
        if (value < this.state.min) correctedValue = this.state.min;
        if (value > this.state.to) correctedValue = this.state.to;
      }

      if (type === 'to') {
        if (value > this.state.max) correctedValue = this.state.max;
        if (value < this.state.from) correctedValue = this.state.from;
      }
    }

    if (!this.state.hasInterval) {
      if (value < this.state.min) correctedValue = this.state.min;
      if (value > this.state.max) correctedValue = this.state.max;
    }

    return correctedValue;
  }

  getPositionFromValue(value) {
    return Math.round((value - this.state.min) * this.ratio);
  }
}
