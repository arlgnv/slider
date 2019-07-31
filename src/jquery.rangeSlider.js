import App from "./app/app";

(function($) {
    "use strict";

    $.fn.rangeSlider = function(options) {
        const settings = $.extend(
            {
                value: 0, // начальное значение
                min: 0, // минимальное значение
                max: 100, // максимальное значение
                step: 1, // размер шага

                range: false, // возможность выбора диапазона
                view: "horizontal", // расположение слайдера
                hideTip: true, // скрыть подсказку над бегунком
                theme: "aqua" // цветовая схема
            },
            options
        );

        return new App(this[0], settings);
    };
})(jQuery);
