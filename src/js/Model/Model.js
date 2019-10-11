/* eslint-disable no-underscore-dangle */

import EventEmitter from '../EventEmitter/EventEmitter';

export default class Model extends EventEmitter {
  constructor(settings = {}) {
    super();

    this.state = settings;
  }

  get ratio() {
    return this._ratio;
  }

  set ratio(dividend) {
    this._ratio = dividend / (this.state.max - this.state.min);
  }

  updateState(data) {
    this.state = { ...this.state, data };
  }

  transformPositionToValue(position) {
    let value = this.getValueFromPosition(position);

    if (this.isValueProper(value)) value = this.correctValueWithStep(value);

    value = this.correctValueWithEdges(value);

    this.updateState({ from: value });

    this.notify('updateState', value);
  }

  getValueFromPosition(position) {
    return this.state.min + Math.round(position / this.ratio);
  }

  isValueProper(value) {
    return value > this.state.min && value < this.state.max;
  }

  correctValueWithStep(value) {
    return Math.round((value - this.state.min) / this.state.step) * this.state.step + this.state.min;
  }

  correctValueWithEdges(value) {
    let correctedValue = value;

    if (value < this.state.min) correctedValue = this.state.min;
    if (value > this.state.max) correctedValue = this.state.max;

    return correctedValue;
  }

  getPositionFromValue(value) {
    return Math.round((value - this.state.min) * this.ratio);
  }
}
