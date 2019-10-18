/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import EventEmitter from '../EventEmitter/EventEmitter';

export default class Model extends EventEmitter {
  constructor(parameters = {}) {
    super();

    this._state = this._correctParameters(parameters);
  }

  updateState(data) {
    if (data.isPercent) {
      const valueType = 'from' in data ? 'from' : 'to';

      data[valueType] = Math.round((this._state.min + (data[valueType] * (this._state.max - this._state.min)) / 100));
    }

    this._state = this._correctParameters({ ...this._state, ...data });

    if (this._isValueInRange(this._state.from)) {
      this._state.from = this._correctValueWithStep(this._state.from);
    }

    if (this._isValueInRange(this._state.to)) {
      this._state.to = this._correctValueWithStep(this._state.to);
    }

    this._state = this._correctParameters(this._state);

    const newData = { ...this._state };
    this._convertValuesToPercents(newData);

    this.notify('updateState', newData);
  }

  getState() {
    return this._state;
  }

  _isValueInRange(value) {
    return value > this._state.min && value < this._state.max;
  }

  _correctValueWithStep(value) {
    return Math.round((value - this._state.min) / this._state.step)
      * this._state.step + this._state.min;
  }

  _convertValuesToPercents(data) {
    data.from = ((data.from - this._state.min) * 100) / (this._state.max - this._state.min);

    if (this._state.hasInterval) {
      data.to = ((data.to - this._state.min) * 100) / (this._state.max - this._state.min);
    }
  }

  _correctParameters(parameters) {
    const fixedParameters = parameters;

    if (this._isNumValueInvalid(fixedParameters.min)) fixedParameters.min = 0;
    if (this._isNumValueInvalid(fixedParameters.from)) fixedParameters.from = fixedParameters.min;
    if (this._isNumValueInvalid(fixedParameters.max)) fixedParameters.max = 100;

    if (fixedParameters.max < fixedParameters.min) {
      const min = Math.min(fixedParameters.max, fixedParameters.min);
      const max = Math.max(fixedParameters.max, fixedParameters.min);

      fixedParameters.min = min;
      fixedParameters.max = max;
    }

    if (this._isStepInvalid(fixedParameters.step)) fixedParameters.step = 1;

    if (this._isBooleanValueInvalid(fixedParameters.isVertical)) fixedParameters.isVertical = false;
    if (this._isBooleanValueInvalid(fixedParameters.hasTip)) fixedParameters.hasTip = false;
    if (this._isBooleanValueInvalid(fixedParameters.hasInterval)) fixedParameters.hasInterval = false;

    const isThemeInvalid = fixedParameters.theme !== 'aqua' && fixedParameters.theme !== 'red';
    if (isThemeInvalid) fixedParameters.theme = 'aqua';

    if (fixedParameters.hasInterval) {
      if (this._isNumValueInvalid(fixedParameters.to)) fixedParameters.to = fixedParameters.max;

      const isFromOutOfRange = fixedParameters.from < fixedParameters.min || fixedParameters.from > fixedParameters.max;
      if (isFromOutOfRange) fixedParameters.from = fixedParameters.min;

      const isToOutOfRange = fixedParameters.to < fixedParameters.min || fixedParameters.to > fixedParameters.max;
      if (isToOutOfRange) fixedParameters.to = fixedParameters.max;

      if (fixedParameters.from > fixedParameters.to) {
        const max = Math.max(fixedParameters.from, fixedParameters.to);
        const min = Math.min(fixedParameters.from, fixedParameters.to);

        fixedParameters.from = min;
        fixedParameters.to = max;
      }
    }

    if (!fixedParameters.hasInterval) {
      if (fixedParameters.from < fixedParameters.min) fixedParameters.from = fixedParameters.min;
      if (fixedParameters.from > fixedParameters.max) fixedParameters.from = fixedParameters.max;

      fixedParameters.to = null;
    }

    if (this._isFunctionValueInvalid(fixedParameters.onChange)) fixedParameters.onChange = null;

    return fixedParameters;
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
