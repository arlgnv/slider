window.$ = require('jquery');
import App from './App/App';
import IParameters from './Interfaces/IParameters';

declare global {
  interface Window {
    $: JQueryStatic;
  }

  interface JQuery {
    rangeSlider(parameters?: IParameters): JQuery;
  }
}

(function ($: JQueryStatic): void {
  $.fn.rangeSlider = function (parameters: IParameters = {}): JQuery {
    const defaultParameters: IParameters = {
      firstValue: 0,
      min: 0,
      max: 100,
      step: 1,
      hasInterval: false,
      hasTip: false,
      hasScale: false,
      isVertical: false,
      theme: 'aqua',
      secondValue: null,
      onChange: null,
    };

    return this.each(function (): void {
      $.data(this, 'rangeSlider', new App($(this), { ...defaultParameters, ...parameters }));
    });
  };
})(window.$);
