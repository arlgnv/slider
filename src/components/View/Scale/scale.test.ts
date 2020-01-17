window.$ = require('jquery');
import Scale from './Scale';
import { DEFAULT_CONFIG } from '../../constants';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Шкала корректно инициализируется', (): void => {
    new Scale($('.js-anchor'), DEFAULT_CONFIG);
    const marks = $('.range-slider__scale').children();

    expect(marks.first().text()).toEqual('0');
    expect(marks.last().text()).toEqual('100');
  });
});

describe('Обновление шкалы', (): void => {
  test('Шкала корректно обновляется', (): void => {
    const scale = new Scale($('.js-anchor'), DEFAULT_CONFIG);
    scale.updateScale({ ...DEFAULT_CONFIG, max: 10 });
    const marks = $('.range-slider__scale').children();

    expect(marks.first().text()).toEqual('0');
    expect(marks.last().text()).toEqual('10');
    expect(marks.length).toEqual(11);
  });
});
