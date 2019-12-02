window.$ = require('jquery');
import Slider from './Slider';
import IDefaultParameters from '../../Interfaces/Model/IDefaultParameters';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

const defaultConfig: IDefaultParameters = {
  kind: 'stateUpdated',
  firstValue: 0,
  firstValuePercent: 0,
  min: 0,
  max: 100,
  step: 1,
  hasInterval: false,
  hasTip: false,
  hasScale: false,
  isVertical: false,
  theme: 'aqua',
  secondValue: null,
  secondValuePercent: null,
  onChange: null,
};

describe('Инициализация', (): void => {
  test('Инициализируется дефолтный вид', (): void => {
    new Slider($('.js-anchor'), defaultConfig);

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });

  test('Инициализируется вид с подсказкой', (): void => {
    new Slider($('.js-anchor'), { ...defaultConfig, hasTip: true });

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(1);
    expect($('.range-slider__scale').length).toEqual(0);
  });

  test('Инициализируется вид со шкалой', (): void => {
    new Slider($('.js-anchor'), { ...defaultConfig, hasScale: true });

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(1);
  });

  test('Инициализируется вид с двумя бегунками', (): void => {
    new Slider($('.js-anchor'), { ...defaultConfig, hasInterval: true });

    expect($('.range-slider__runner').length).toEqual(2);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });
});

describe('Обновление слайдера', (): void => {
  test('Корректно обновляется тема слайдера', (): void => {
    const slider = new Slider($('.js-anchor'), defaultConfig);

    expect($('.range-slider').hasClass('range-slider_theme_aqua')).toEqual(true);
    expect($('.range-slider').hasClass('range-slider_theme_red')).toEqual(false);

    slider.updateSlider({...defaultConfig, theme: 'red'});

    expect($('.range-slider').hasClass('range-slider_theme_aqua')).toEqual(false);
    expect($('.range-slider').hasClass('range-slider_theme_red')).toEqual(true);
  });

  test('Корректно обновляется вид слайдера', (): void => {
    const slider = new Slider($('.js-anchor'), defaultConfig);

    expect($('.range-slider').hasClass('range-slider_direction_vertical')).toEqual(false);

    slider.updateSlider({...defaultConfig, isVertical: true});

    expect($('.range-slider').hasClass('range-slider_direction_vertical')).toEqual(true);
  });
});