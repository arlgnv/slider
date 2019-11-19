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
  $.fn.rangeSlider = function (parameters: IDefaultParameters = {}): JQuery {
    const defaultParameters: IRegularParameters = {
      kind: 'stateUpdated',
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
