import App from './App/App';
import IParameters from './Interfaces/IParameters';

declare global {
  const $: any;
}

(function ($: any): void {
  $.fn.rangeSlider = function (parameters: object = {}) {
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

    return this.each(function () {
      $.data(this, { rangeSlider: new App(this, { ...basicParameters, ...parameters }) });
    });
  };
})($);
