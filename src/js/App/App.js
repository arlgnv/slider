/* eslint-disable no-underscore-dangle */

import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import InputView from '../View/InputView';
import Presenter from '../Presenter/Presenter';

export default class App {
  constructor(input, parameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(new InputView(input), this.model.getState());
    this.presenter = new Presenter(this.model, this.view);
  }

  update(data = {}) {
    this.presenter.onStart(data);
  }
}
