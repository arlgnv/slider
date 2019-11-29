window.$ = require('jquery');
import TipView from './TipView';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});


describe('Инициализация', (): void => {
  test('Корректно инициализируется', (): void => {
    new TipView($('.js-anchor'), 10);

    expect($('.range-slider__tip').length).toEqual(1);
    expect($('.range-slider__tip').text()).toEqual('10');
  });
});

describe('Обновление подсказки', (): void => {
  test('Текст подсказки корректно обновляется', (): void => {
    const tip = new TipView($('.js-anchor'), 10);
    tip.updateTip(20);

    expect($('.range-slider__tip').text()).toEqual('20');
  });
});