/* eslint-disable no-multi-spaces */
import { createSliderTemplate, correctSettings } from './utilities.js';
import Model from './mvc/model.js';
import View from './mvc/view.js';
import Controller from './mvc/controller.js';

export default class App {
  constructor(input, settings) {
    this.startState = correctSettings(settings);

    input.insertAdjacentHTML('beforeBegin', createSliderTemplate(this.startState));

    this.model = new Model(this.startState);
    this.view = new View(input, input.previousElementSibling);
    this.controller = new Controller(this.model, this.view);

    this.init();
  }

  init() {
    this.view.changeValue(this.startState.from);

    const handleFromPosition = this.controller.getHandlePositionFromValue(this.startState.from);
    this.view.changeHandlePosition(handleFromPosition, this.view.handleFrom);

    const tipFromPosition = -((this.view.tipFrom.offsetWidth - this.view.handleFrom.offsetWidth) / 2);
    this.view.changeTipPosition(tipFromPosition, this.view.tipFrom);

    let progressBarRightEdge =      this.view.range.offsetWidth
      - (parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2);
    this.view.changeProgressBarFilling(0, progressBarRightEdge);

    if (this.startState.range) {
      this.view.changeValue(this.startState.from, this.startState.to);

      const handleToPosition = this.controller.getHandlePositionFromValue(this.startState.to);
      this.view.changeHandlePosition(handleToPosition, this.view.handleTo);

      const tipToPosition = -((this.view.tipTo.offsetWidth - this.view.handleTo.offsetWidth) / 2);
      this.view.changeTipPosition(tipToPosition, this.view.tipTo);

      const progressBarLeftEdge = parseFloat(this.view.handleFrom.style.left) + this.view.handleFrom.offsetWidth / 2;
      progressBarRightEdge =        this.view.range.offsetWidth - (parseFloat(this.view.handleTo.style.left) + this.view.handleTo.offsetWidth / 2);

      this.view.changeProgressBarFilling(progressBarLeftEdge, progressBarRightEdge);
    }
  }

  update(obj) {
    if (obj.from) this.controller.updateApplication(obj.from, this.view.handleFrom);
    if (obj.to && this.model.state.range) {
      this.controller.updateApplication(obj.to, this.view.handleTo);
    }
    if (obj.min) this.model.state.min = obj.min;
    if (obj.max) this.model.state.max = obj.max;
    if (obj.step) this.model.state.step = obj.step;

    if (obj.hideTip === true) {
      this.model.state.hideTip = true;
      this.view.tipFrom.classList.add('lrs__tip_hidden');
      this.view.tipTo.classList.add('lrs__tip_hidden');
    }

    if (obj.hideTip === false) {
      this.model.state.hideTip = false;
      this.view.tipFrom.classList.remove('lrs__tip_hidden');
      this.view.tipTo.classList.remove('lrs__tip_hidden');
    }
  }
}
