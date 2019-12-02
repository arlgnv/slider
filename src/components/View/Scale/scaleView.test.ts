window.$ = require('jquery');
import Scale from './Scale';
import { IDefaultParameters } from '../../Interfaces/Model/IModel';

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
  test('Шкала корректно инициализируется', (): void => {
    new Scale($('.js-anchor'), defaultConfig);
    const marks = $('.range-slider__scale').children();

    expect(marks.first().text()).toEqual('0');
    expect(marks.last().text()).toEqual('100');
  });
});

describe('Обновление шкалы', (): void => {
  test('Шкала корректно обновляется', (): void => {
    const scale = new Scale($('.js-anchor'), defaultConfig);
    scale.updateScale({...defaultConfig, max: 10});
    const marks = $('.range-slider__scale').children();

    expect(marks.first().text()).toEqual('0');
    expect(marks.last().text()).toEqual('10');
    expect(marks.length).toEqual(11);
  });
});