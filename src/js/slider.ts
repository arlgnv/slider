import App from './App/App';
import IParameters from './IParameters';

declare var jQuery: any;

(function ($) {
  $.fn.rangeSlider = function (parameters: IParameters = {}) {
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
})(jQuery);
