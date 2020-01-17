window.$ = require('jquery');
import Slider from './Slider';
import { DEFAULT_CONFIG } from '../../constants';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Инициализируется дефолтный вид', (): void => {
    new Slider($('.js-anchor'), DEFAULT_CONFIG);

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });

  test('Инициализируется вид с подсказкой', (): void => {
    new Slider($('.js-anchor'), { ...DEFAULT_CONFIG, hasTip: true });

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(1);
    expect($('.range-slider__scale').length).toEqual(0);
  });

  test('Инициализируется вид со шкалой', (): void => {
    new Slider($('.js-anchor'), { ...DEFAULT_CONFIG, hasScale: true });

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(1);
  });

  test('Инициализируется вид с двумя бегунками', (): void => {
    new Slider($('.js-anchor'), { ...DEFAULT_CONFIG, hasInterval: true });

    expect($('.range-slider__runner').length).toEqual(2);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });
});

describe('Обновление слайдера', (): void => {
  test('Корректно обновляется тема слайдера', (): void => {
    const slider = new Slider($('.js-anchor'), DEFAULT_CONFIG);

    expect($('.range-slider').hasClass('range-slider_theme_aqua')).toEqual(true);
    expect($('.range-slider').hasClass('range-slider_theme_red')).toEqual(false);

    slider.updateSlider({ ...DEFAULT_CONFIG, theme: 'red' });

    expect($('.range-slider').hasClass('range-slider_theme_aqua')).toEqual(false);
    expect($('.range-slider').hasClass('range-slider_theme_red')).toEqual(true);
  });

  test('Корректно обновляется вид слайдера', (): void => {
    const slider = new Slider($('.js-anchor'), DEFAULT_CONFIG);

    expect($('.range-slider').hasClass('range-slider_direction_vertical')).toEqual(false);

    slider.updateSlider({ ...DEFAULT_CONFIG, isVertical: true });

    expect($('.range-slider').hasClass('range-slider_direction_vertical')).toEqual(true);
  });
});
