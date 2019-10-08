/* eslint-disable import/extensions */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* global jQuery */

import App from './App/App';

(function ($) {
  $.fn.rangeSlider = function (parameters) {
    const settings = $.extend(
      {
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
      },
      parameters,
    );

    return this.each(function () {
      $.data(this, { rangeSlider: new App(this, settings) });
    });
  };
}(jQuery));
