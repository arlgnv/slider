window.$ = require('jquery');
import Tip from './Tip';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Корректно инициализируется', (): void => {
    new Tip($('.js-anchor'), 10);

    expect($('.range-slider__tip').length).toEqual(1);
    expect($('.range-slider__tip').text()).toEqual('10');
  });
});

describe('Обновление подсказки', (): void => {
  test('Текст подсказки корректно обновляется', (): void => {
    const tip = new Tip($('.js-anchor'), 10);
    tip.updateTip(20);

    expect($('.range-slider__tip').text()).toEqual('20');
  });
});
