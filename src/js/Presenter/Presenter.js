/* eslint-disable no-underscore-dangle */

export default class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.subscribe('tryToUpdateModel', this._handlerTryToUpdateModel.bind(this));

    this.model.subscribe('updateState', this._handlerModelUpdateState.bind(this));

    this._handlerTryToUpdateModel();
  }

  _handlerTryToUpdateModel({ data = {}, onMouseMove = false } = {}) {
    const newData = data;
    const ratio = { ...this.view.getRunnersRangeMovements() };

    newData.ratio = ratio;

    this.model.updateState(newData, onMouseMove);
  }

  _handlerModelUpdateState(data) {
    if (data.onChange) {
      data.onChange(data.hasInterval ? `${data.from} - ${data.to}` : `${data.from}`);
    }

    this.view.reDrawView(data);
  }
}
