window.$ = require('jquery');
import Runner from './Runner';
import { DEFAULT_CONFIG } from '../../constants';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Первый ползунок корректно инициализируется', (): void => {
    new Runner($('.js-anchor'), DEFAULT_CONFIG, 'firstValue');

    expect($('.range-slider__runner').attr('style')).toEqual('left: 0%');
  });

  test('Второй ползунок корректно инициализируется', (): void => {
    new Runner($('.js-anchor'), { ...DEFAULT_CONFIG, secondValuePercent: 100 }, 'secondValue');

    expect($('.range-slider__runner').attr('style')).toEqual('left: 100%');
  });

  test('Если hasTip = true инициализируется подсказка', (): void => {
    new Runner($('.js-anchor'), { ...DEFAULT_CONFIG, hasTip: true }, 'firstValue');

    expect($('.range-slider__runner .range-slider__tip').text()).toEqual('0');
  });
});

describe('Обновление ползунка', (): void => {
  test('Положение корректно обновляется', (): void => {
    const runner = new Runner($('.js-anchor'), DEFAULT_CONFIG, 'firstValue');
    runner.updateRunner({ ...DEFAULT_CONFIG, firstValuePercent: 50 });

    expect($('.range-slider__runner').attr('style')).toEqual('left: 50%');
  });

  test('Если hasTip = true подсказка обновляется', (): void => {
    const runner = new Runner($('.js-anchor'), { ...DEFAULT_CONFIG, hasTip: true }, 'firstValue');
    runner.updateRunner({ ...DEFAULT_CONFIG, hasTip: true, firstValue: 30 });

    expect($('.range-slider__runner .range-slider__tip').text()).toEqual('30');
  });
});
