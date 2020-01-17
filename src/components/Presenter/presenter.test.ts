window.$ = require('jquery');
import Presenter from './Presenter';
import { DEFAULT_CONFIG } from '../constants';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Приложение корректно инициализируется', (): void => {
    new Presenter($('.js-anchor'), DEFAULT_CONFIG);

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });
});

describe('Обновление', (): void => {
  test('Приложение корректно обновляется', (): void => {
    const app = new Presenter($('.js-anchor'), { ...DEFAULT_CONFIG, hasTip: true });

    expect($('.range-slider__runner').attr('style')).toEqual('left: 0%');
    expect($('.range-slider__tip').text()).toEqual('0');

    app.update({ firstValue: 50, hasScale: true });

    expect($('.range-slider__runner').attr('style')).toEqual('left: 50%');
    expect($('.range-slider__tip').text()).toEqual('50');
    expect($('.range-slider__scale').length).toEqual(1);
  });
});
