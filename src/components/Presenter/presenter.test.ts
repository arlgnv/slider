window.$ = require('jquery');
import Presenter from './Presenter';
import Slider from '../View/Slider/Slider';
import Model from '../Model/Model';
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

beforeAll((): void => {
  $('body').html('<span class="js-anchor"></span>');
});

describe('Инициализация', (): void => {
  test('Презентер корректно инициализируется и подписывается на обновления', (): void => {
    const model = new Model(defaultConfig);
    const spyModelSubscribe = jest.spyOn(model, 'subscribe');
    const view = new Slider($('.js-anchor'), model.getState());
    const spyViewSubscribe = jest.spyOn(view, 'subscribe');
    new Presenter(model, view);
    
    expect(spyModelSubscribe).toHaveBeenCalledTimes(1);
    expect(spyViewSubscribe).toHaveBeenCalledTimes(1);
  });
});