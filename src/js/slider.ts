import App from './App/App';
import IParameters from './IParameters';

declare global {
  const $: any;
}

(function ($: any): void {
  $.fn.rangeSlider = function (parameters: any = {}) {
    const basicParameters: IParameters = {
      min: 0,
      max: 100,
      step: 1,
      from: 0,
      hasInterval: false,
      to: null,
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
