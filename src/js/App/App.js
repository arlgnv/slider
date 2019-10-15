/* eslint-disable max-len */

import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import InputView from '../View/InputView';
import Presenter from '../Presenter/Presenter';

export default class App {
  constructor(input, settings) {
    this.model = new Model(settings);
    this.view = new SliderView(new InputView(input), this.model.state);
    this.presenter = new Presenter(this.model, this.view);

    this.presenter.onStart({ runnerFrom: this.view.runnerFrom, runnerTo: this.view.runnerTo });
  }

  update(obj) {
    const correctedSettings = this.model.correctSettings({ ...this.model.state, ...obj });

    if (correctedSettings.hasInterval !== this.model.state.hasInterval) {
      const isRunnerToNotExists = !this.view.runnerTo && correctedSettings.hasInterval;
      if (isRunnerToNotExists) {
        this.view.slider.insertAdjacentHTML('beforeend', '<span class="lrs__runner"></span>');
        [, this.view.runnerTo] = this.view.slider.querySelectorAll('.lrs__runner');
        this.view.addEventListeners();
      }

      const isTipToNotExists = !this.view.tipTo && correctedSettings.hasInterval && correctedSettings.hasTip;
      if (isTipToNotExists) {
        this.view.runnerTo.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');
        [, this.view.tipTo] = this.view.slider.querySelectorAll('.lrs__tip');
      }

      if (correctedSettings.hasInterval) {
        this.view.runnerTo.classList.remove('lrs__runner_hidden');

        if (correctedSettings.hasTip) {
          this.view.tipTo.classList.remove('lrs__tip_hidden');
        }
      }

      if (!correctedSettings.hasInterval) {
        this.view.runnerTo.classList.add('lrs__runner_hidden');

        if (correctedSettings.hasTip) {
          this.view.tipTo.classList.add('lrs__tip_hidden');
        }
      }

      this.model.state.hasInterval = correctedSettings.hasInterval;
    }

    if (correctedSettings.hasTip !== this.model.state.hasTip) {
      const isTipFromNotExists = !this.view.tipFrom && correctedSettings.hasTip;
      if (isTipFromNotExists) {
        this.view.runnerFrom.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');
        [this.view.tipFrom] = this.view.slider.querySelectorAll('.lrs__tip');
      }

      const isTipFromNeedToBeHidden = this.view.tipFrom && !correctedSettings.hasTip;
      if (isTipFromNeedToBeHidden) this.view.tipFrom.classList.add('lrs__tip_hidden');

      const isTipFromNeedToBeShowed = this.view.tipFrom && correctedSettings.hasTip;
      if (isTipFromNeedToBeShowed) this.view.tipFrom.classList.remove('lrs__tip_hidden');

      const isTipToNotExists = !this.view.tipTo && correctedSettings.hasTip && correctedSettings.hasInterval;
      if (isTipToNotExists) {
        this.view.runnerTo.insertAdjacentHTML('afterend', '<span class="lrs__tip"></span>');
        [, this.view.tipTo] = this.view.slider.querySelectorAll('.lrs__tip');
      }

      const isTipToNeedToBeHidden = this.view.tipTo && !correctedSettings.hasTip && correctedSettings.hasInterval;
      if (isTipToNeedToBeHidden) this.view.tipTo.classList.add('lrs__tip_hidden');

      const isTipToNeedToBeShowed = this.view.tipTo && correctedSettings.hasTip && correctedSettings.hasInterval;
      if (isTipToNeedToBeShowed) this.view.tipTo.classList.remove('lrs__tip_hidden');
    }

    if (correctedSettings.theme !== this.model.state.theme) {
      if (correctedSettings.theme === 'aqua') {
        this.view.slider.classList.remove('lrs_theme_red');
        this.view.slider.classList.add('lrs_theme_aqua');
      }

      if (correctedSettings.theme === 'red') {
        this.view.slider.classList.remove('lrs_theme_aqua');
        this.view.slider.classList.add('lrs_theme_red');
      }
    }

    if (correctedSettings.isVertical !== this.model.state.isVertical) {
      if (correctedSettings.isVertical) {
        this.view.slider.classList.add('lrs_direction_vertical');
      }

      if (!correctedSettings.isVertical) {
        this.view.slider.classList.remove('lrs_direction_vertical');
      }
    }

    this.model.state = correctedSettings;
    this.presenter.onStart({ runnerFrom: this.view.runnerFrom, runnerTo: this.view.runnerTo });
  }
}
