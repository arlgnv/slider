import App from "./app/app";

;(function($) {
  "use strict";

  $.fn.rangeSlider = function(parameters) {
    const settings = $.extend(
      {
        min: 0,
        max: 100,
        step: 1,
        from: 0,
        range: false,
        view: "horizontal",
        hideTip: true,
        theme: "aqua"
      },
      parameters
    );

    return this.each(function() {
      $.data(this, { "rangeSlider": new App(this, settings) });
    });
  };
})(jQuery);
