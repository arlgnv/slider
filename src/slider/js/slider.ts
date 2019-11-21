window.$ = require('jquery');
import App from './App/App';
import IDefaultParameters from './Interfaces/IDefaultParameters';
import IRegularParameters from './Interfaces/IRegularParameters';

declare global {
  interface Window {
    $: JQueryStatic;
  }

  interface JQuery {
    rangeSlider(parameters?: IDefaultParameters): JQuery;
  }
}

(function ($: JQueryStatic): void {
  $.fn.rangeSlider = function (defaultParameters: Partial<IDefaultParameters> = {}): JQuery {
    const defaultConfig: IRegularParameters = {
      kind: 'stateUpdated',
      firstValue: 0,
      firstValuePercent: 0,
      min: 0,
      max: 100,
      step: 1,
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
