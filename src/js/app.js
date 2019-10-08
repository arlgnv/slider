/* eslint-disable import/extensions */

import correctSettings from './utilities.js';
import templateFunction from '../templates/sliderTemplate.hbs';
import Model from './model.js';
import View from './view.js';
import Presenter from './presenter.js';

export default class App {
  constructor(input, settings) {
    input.classList.add('hidden-input');
    input.insertAdjacentHTML('beforeBegin', templateFunction(settings));

    this.model = new Model(correctSettings(settings));
    this.view = new View(input);
    this.presenter = new Presenter(this.model, this.view);
  }

  update(obj) {
    const correctedSettings = correctSettings({ ...this.model.state, ...obj });

    if (correctedSettings.hasInterval !== this.model.state.hasInterval) {
      if (!this.view.handleTo && correctedSettings.hasInterval) {
        this.view.slider.insertAdjacentHTML('beforeend', '<span class="lrs__handle lrs__handle_to"></span>');
        this.view.handleTo = this.view.slider.querySelector('.lrs__handle_to');
        this.view.addEventListeners();
      }

      if (!this.view.tipTo && correctedSettings.hasInterval && correctedSettings.hasTip) {
        this.view.handleTo.insertAdjacentHTML('afterend', '<span class="lrs__tip lrs__tip_to"></span>');
        this.view.tipTo = this.view.slider.querySelector('.lrs__tip_to');
      }

      if (correctedSettings.hasInterval) {
        this.view.handleTo.classList.remove('lrs__handle_hidden');

        if (correctedSettings.hasTip) {
          this.view.tipTo.classList.remove('lrs__tip_hidden');
        }
      }

      if (!correctedSettings.hasInterval) {
        this.view.handleTo.classList.add('lrs__handle_hidden');

        if (correctedSettings.hasTip) {
          this.view.tipTo.classList.add('lrs__tip_hidden');
        }
      }

      this.model.state.hasInterval = correctedSettings.hasInterval;
    }

    if (correctedSettings.hasTip !== this.model.state.hasTip) {
      if (correctedSettings.hasTip && !this.view.tipFrom) {
        this.view.handleFrom.insertAdjacentHTML('afterend', '<span class="lrs__tip lrs__tip_from"></span>');
        this.view.tipFrom = this.view.slider.querySelector('.lrs__tip_from');
      }

      if (!correctedSettings.hasTip && this.view.tipFrom) {
        this.view.tipFrom.classList.add('lrs__tip_hidden');
      }

      if (correctedSettings.hasTip && this.view.tipFrom) {
        this.view.tipFrom.classList.remove('lrs__tip_hidden');
      }

      if (correctedSettings.hasTip && correctedSettings.hasInterval && !this.view.tipTo) {
        this.view.handleTo.insertAdjacentHTML('afterend', '<span class="lrs__tip lrs__tip_to"></span>');
        this.view.tipTo = this.view.slider.querySelector('.lrs__tip_to');
      }

      if (!correctedSettings.hasTip && correctedSettings.hasInterval && this.view.tipTo) {
        this.view.tipTo.classList.add('lrs__tip_hidden');
      }

      if (correctedSettings.hasTip && correctedSettings.hasInterval && this.view.tipTo) {
        this.view.tipTo.classList.remove('lrs__tip_hidden');
      }
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
    this.presenter.onStart();
  }
}
