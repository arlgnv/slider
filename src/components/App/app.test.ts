window.$ = require('jquery');
import App from './App';
import { IRegularParameters } from '../Interfaces/Model/IModel';

const defaultConfig: IRegularParameters = {
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

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Приложение корректно инициализируется', (): void => {
    new App($('.js-anchor'), defaultConfig);

    expect($('.range-slider__runner').length).toEqual(1);
    expect($('.range-slider__progress-bar').length).toEqual(1);
    expect($('.range-slider__tip').length).toEqual(0);
    expect($('.range-slider__scale').length).toEqual(0);
  });
});

describe('Обновление', (): void => {
  test('Приложение корректно обновляется', (): void => {
    const app = new App($('.js-anchor'), { ...defaultConfig, hasTip: true });

    expect($('.range-slider__runner').attr('style')).toEqual('left: 0%');
    expect($('.range-slider__tip').text()).toEqual('0');

    app.update({ firstValue: 50, hasScale: true });

    expect($('.range-slider__runner').attr('style')).toEqual('left: 50%');
    expect($('.range-slider__tip').text()).toEqual('50');
    expect($('.range-slider__scale').length).toEqual(1);
  });
});
