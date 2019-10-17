/* eslint-disable no-return-assign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */

import EventEmitter from '../EventEmitter/EventEmitter';

export default class Model extends EventEmitter {
  constructor(parameters = {}) {
    super();

    this._state = this._correctParameters(parameters);
    this._ratio = { from: null, to: null };
  }

  updateState(data = {}, onMouseMove) {
    let outcomingData;

    if (onMouseMove) {
      this._setRatio(data.ratio);

      const valueType = Object.keys(data)[0];
      const position = Object.values(data)[0]; // console.log(data);

      this._state[valueType] = this._transformPositionToValue(position, valueType);

      outcomingData = { ...this.getState() };
      outcomingData.positions = {};

      outcomingData.positions[valueType] = this._getPositionFromValue(outcomingData[valueType], valueType);
    }

    if (!onMouseMove) {
      this._state = this._correctParameters({ ...this.getState(), ...data });
      this._setRatio(data.ratio);

      outcomingData = { ...this.getState() };
      outcomingData.positions = {};

      if (this._state.hasInterval) {
        outcomingData.positions.from = this._getPositionFromValue(this._state.from, 'from');
        outcomingData.positions.to = this._getPositionFromValue(this._state.to, 'to');
      }

      if (!this._state.hasInterval) {
        outcomingData.positions.from = this._getPositionFromValue(this._state.from, 'from');
      }
    }

    this.notify('updateState', outcomingData);
  }

  getState() {
    return this._state;
  }

  _setRatio(data) {
    Object.entries(data).forEach((it) => this._ratio[it[0]] = it[1] / (this._state.max - this._state.min));
  }

  _transformPositionToValue(position, type) {
    let value = this._getValueFromPosition(position, type);
    if (this._isValueProper(value)) value = this._correctValueWithStep(value);
    value = this._correctValueWithEdges(value, type);

    return value;
  }

  _getValueFromPosition(position, type) {
    return this._state.min + Math.ceil(position / this._ratio[type]);
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

  _getPositionFromValue(value, type) {
    return Math.trunc((value - this._state.min) * this._ratio[type]);
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
