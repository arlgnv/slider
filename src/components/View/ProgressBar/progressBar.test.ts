window.$ = require('jquery');
import ProgressBar from './ProgressBar';
import { DEFAULT_CONFIG } from '../../constants';

beforeEach((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Прогресс-бар корректно инициализируется с одним ползунком', (): void => {
    new ProgressBar($('.js-anchor'), DEFAULT_CONFIG);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 100%;');
  });

  test('Прогресс-бар корректно инициализируется с двумя ползунками', (): void => {
    new ProgressBar($('.js-anchor'), { ...DEFAULT_CONFIG, hasInterval: true, secondValuePercent: 30 });

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 70%;');
  });
});

describe('Обновление прогресс-бара', (): void => {
  test('Положение корректно обновляется в случае с одним ползунком', (): void => {
    const bar = new ProgressBar($('.js-anchor'), DEFAULT_CONFIG);
    bar.updateProgressBar(30, null);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 70%;');

    bar.updateProgressBar(100, null);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 0%;');
  });

  test('Положение корректно обновляется в случае с двумя ползунками', (): void => {
    const bar = new ProgressBar($('.js-anchor'), { ...DEFAULT_CONFIG, hasInterval: true, secondValuePercent: 30 });
    bar.updateProgressBar(0, 100);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 0%; right: 0%;');

    bar.updateProgressBar(20, 60);

    expect($('.range-slider__progress-bar').attr('style')).toEqual('left: 20%; right: 40%;');
  });
});
