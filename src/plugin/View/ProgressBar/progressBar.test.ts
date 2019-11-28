window.$ = require('jquery');
import ProgressBarView from './ProgressBarView';
import IDefaultParameters from '../../Interfaces/IDefaultParameters';

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
  test('Прогресс-бар корректно инициализируется с одним ползунком', (): void => {
    new ProgressBarView($('.js-anchor'), defaultConfig);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 100%;');
  });

  test('Прогресс-бар корректно инициализируется с двумя ползунками', (): void => {
    new ProgressBarView($('.js-anchor'), {...defaultConfig, hasInterval: true, secondValuePercent: 30});

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 70%;');
  });
});

describe('Обновление прогресс-бара', (): void => {
  test('Положение корректно обновляется в случае с одним ползунком', (): void => {
    const bar = new ProgressBarView($('.js-anchor'), defaultConfig);
    bar.updateProgressBar(30, null);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 70%;');

    bar.updateProgressBar(100, null);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 0%;');
  });

  test('Положение кбновляется в случае с двумя ползунками', (): void => {
    const bar = new ProgressBarView($('.js-anchor'), {...defaultConfig, hasInterval: true, secondValuePercent: 30});
    bar.updateProgressBar(0, 100);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 0%;');

    bar.updateProgressBar(20, 60);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 20%; right: 40%;');
  });
});