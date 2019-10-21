/* eslint-disable no-underscore-dangle */

export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('moveRunner', this._handlerMoveRunner.bind(this));

    this.model.subscribe('updateState', this._handlerModelUpdateState.bind(this));

    this.onStart();
  }

  _handlerMoveRunner(data) {
    const newData = { ...data };
    newData.isPercent = true;

    this.model.updateState(newData);
  }

  _handlerModelUpdateState(data) {
    this.view.reDrawView(data);
  }

  onStart(data = {}) {
    this.model.updateState(data);
  }
}
