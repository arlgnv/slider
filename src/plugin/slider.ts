window.$ = require('jquery');
import App from './App/App';
import IDefaultParameters from './Interfaces/IDefaultParameters';
import IRegularParameters from './Interfaces/IRegularParameters';
import {
  FIRST_VALUE_DEFAULT, FIRST_VALUE_PERCENT_DEFAULT,
  MIN_VALUE_DEFAULT, MAX_VALUE_DEFAULT, STEP_VALUE_DEFAULT } from './constants';

declare global {
  interface Window {
    $: JQueryStatic;
  }

  interface JQuery {
    rangeSlider(parameters?: Partial<IDefaultParameters>): JQuery;
  }
}

(function ($: JQueryStatic): void {
  $.fn.rangeSlider = function (defaultParameters: Partial<IDefaultParameters>): JQuery {
    const defaultConfig: IRegularParameters = {
      kind: 'stateUpdated',
      firstValue: FIRST_VALUE_DEFAULT,
      firstValuePercent: FIRST_VALUE_PERCENT_DEFAULT,
      min: MIN_VALUE_DEFAULT,
      max: MAX_VALUE_DEFAULT,
      step: STEP_VALUE_DEFAULT,
      hasInterval: false,
      hasTip: false,
      hasScale: false,
      isVertical: false,
      theme: 'aqua',
      secondValue: null,
      secondValuePercent: null,
      onChange: null,
    };

    const initialParameters: IRegularParameters = $.extend({}, defaultConfig, defaultParameters);

    return this.each(function (): void {
      $.data(this, 'rangeSlider', new App($(this), initialParameters));
    });
  };
})(window.$);
