window.$ = require('jquery');
import Presenter from './Presenter/Presenter';
import { IDefaultParameters } from './Interfaces/Model/IModel';
import { DEFAULT_CONFIG } from './constants';

declare global {
  interface Window {
    $: JQueryStatic;
  }

  interface JQuery {
    rangeSlider(parameters?: Partial<IDefaultParameters>): JQuery;
  }
}

$.fn.rangeSlider = function (defaultParameters: Partial<IDefaultParameters>): JQuery {
  $.data($(this).get(0), 'rangeSlider', new Presenter($(this), { ...DEFAULT_CONFIG, ...defaultParameters, kind: 'stateUpdated' }));

  return this;
};
