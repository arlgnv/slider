import App from "./app/app";

(function($) {
    "use strict";

    $.fn.rangeSlider = function(parameters) {
        const settings = $.extend(
            {
                value: 0, // начальное значение
                min: 10, // минимальное значение
                max: 100, // максимальное значение
                step: 1, // размер шага

                range: false, // возможность выбора диапазона
                view: "horizontal", // расположение слайдера
                hideTip: false, // скрыть подсказку над бегунком
                theme: "aqua" // цветовая схема
            },
            parameters
        );

        return new App(this[0], settings);
    };
})(jQuery);
