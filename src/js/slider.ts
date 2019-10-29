window.$ = require('jquery');
import App from './App/App';
import IParameters from './Interfaces/IParameters';

declare global {
  interface Window {
    $: JQueryStatic;
  }

  interface JQuery {
    rangeSlider(parameters?: IParameters): JQuery<HTMLElement>;
  }
}

(function ($: JQueryStatic): void {
  $.fn.rangeSlider = function (parameters: IParameters = {}): JQuery<HTMLElement> {
    const basicParameters: IParameters = {
      firstValue: 0,
      firstValuePercent: null,
      min: 0,
      max: 100,
      step: 1,
      hasInterval: false,
      secondValue: null,
      secondValuePercent: null,
      isVertical: false,
      hasTip: false,
      theme: 'aqua',
      onChange: null,
    };

    return this.each(function (): void {
      $.data(this, 'rangeSlider', new App(this, { ...basicParameters, ...parameters }));
    });
  };
})(window.$);
