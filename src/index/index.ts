import './index.scss';
import '../slider/js/slider';
import SliderDemo from './SliderDemo';

const parameters =
  {
    0: { firstValue: 10, max: 20, hasScale: true },
    1: { hasInterval: true, hasTip: true, theme: 'red' },
    2: { min: -1, max: 10, step: 3, isVertical: true, hasScale: true },
  };

const $sliders = $('.js-slider');
$sliders.each(function (i) { new SliderDemo($(this), parameters[i]); });
