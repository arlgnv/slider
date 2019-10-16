/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import EventEmitter from '../EventEmitter/EventEmitter';

export default class Model extends EventEmitter {
  constructor(settings = {}) {
    super();

    this._state = this._correctSettings(settings);
    this._ratio = { from: null, to: null };
  }

  onStart({ fromRatioDividend, toRatioDividend = null }) {
    this.setRatio(fromRatioDividend, 'from');
    const positions = { from: this._getPositionFromValue(this._state.from, 'from') };

    if (toRatioDividend) {
      this.setRatio(toRatioDividend, 'to');
      positions.to = this._getPositionFromValue(this._state.to, 'to');
    }

    this.notify('start', positions);
  }

  setRatio(dividend, type) {
    this._ratio[type] = dividend / (this._state.max - this._state.min);
  }

  updateState(data) {
    const valueType = 'from' in data ? 'from' : 'to';
    const position = data[valueType];

    let value = this._getValueFromPosition(position, valueType);
    if (this._isValueProper(value)) value = this._correctValueWithStep(value);
    value = this._correctValueWithEdges(value, valueType);

    this._state[valueType] = value;

    const positions = { [valueType]: this._getPositionFromValue(value, valueType) };
    const newData = { ...this._state };
    newData.positions = positions;

    this.notify('updateState', newData);
  }

  getState() {
    return this._state;
  }

  _getValueFromPosition(position, ratioType) {
    return this._state.min + Math.round(position / this._ratio[ratioType]);
  }

  _isValueProper(value) {
    return value !== this._state.min
      && value !== this._state.max
      && value !== this._state.from
      && value !== this._state.to;
  }

  _correctValueWithStep(value) {
    return Math.round((value - this._state.min) / this._state.step)
      * this._state.step + this._state.min;
  }

  _correctValueWithEdges(value, type) {
    let correctedValue = value;

    if (this._state.hasInterval) {
      if (type === 'from') {
        if (value < this._state.min) correctedValue = this._state.min;
        if (value > this._state.to) correctedValue = this._state.to;
      }

      if (type === 'to') {
        if (value > this._state.max) correctedValue = this._state.max;
        if (value < this._state.from) correctedValue = this._state.from;
      }
    }

    if (!this._state.hasInterval) {
      if (value < this._state.min) correctedValue = this._state.min;
      if (value > this._state.max) correctedValue = this._state.max;
    }

    return correctedValue;
  }

  _getPositionFromValue(value, ratioType) {
    return Math.round((value - this._state.min) * this._ratio[ratioType]);
  }

  _correctSettings(settings) {
    const parameters = settings;

    if (this._isNumValueInvalid(parameters.min)) parameters.min = 0;
    if (this._isNumValueInvalid(parameters.from)) parameters.from = parameters.min;
    if (this._isNumValueInvalid(parameters.max)) parameters.max = 100;

    if (parameters.max < parameters.min) {
      const min = Math.min(parameters.max, parameters.min);
      const max = Math.max(parameters.max, parameters.min);

      parameters.min = min;
      parameters.max = max;
    }

    if (this._isStepInvalid(parameters.step)) parameters.step = 1;

    if (this._isBooleanValueInvalid(parameters.isVertical)) parameters.isVertical = false;
    if (this._isBooleanValueInvalid(parameters.hasTip)) parameters.hasTip = false;
    if (this._isBooleanValueInvalid(parameters.hasInterval)) parameters.hasInterval = false;

    const isThemeInvalid = parameters.theme !== 'aqua' && parameters.theme !== 'red';
    if (isThemeInvalid) parameters.theme = 'aqua';

    if (parameters.hasInterval) {
      if (this._isNumValueInvalid(parameters.to)) parameters.to = parameters.max;

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

    if (this._isFunctionValueInvalid(parameters.onChange)) parameters.onChange = null;

    return parameters;
  }

  _isNumValueInvalid(value) {
    return typeof value !== 'number';
  }

  _isStepInvalid(value) {
    return typeof value !== 'number' || value < 1;
  }

  _isBooleanValueInvalid(value) {
    return typeof value !== 'boolean';
  }

  _isFunctionValueInvalid(value) {
    return typeof value !== 'function';
  }
}
