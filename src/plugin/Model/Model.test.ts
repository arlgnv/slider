import Model from './Model';
import IRegularParameters from '../Interfaces/IRegularParameters';

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

describe('Инициализация', (): void => {
  test('Инициализируется корректное состояние модели', (): void => {
    const model = new Model(defaultConfig);
    const state = model.getState();

    expect(Object.getOwnPropertyNames(state).length)
      .toEqual(Object.getOwnPropertyNames(defaultConfig).length);
    expect(state.kind).toEqual(defaultConfig.kind);
    expect(state.max).toEqual(defaultConfig.max);
    expect(state.hasScale).toEqual(defaultConfig.hasScale);
    expect(state.theme).toEqual(defaultConfig.theme);
    expect(state.onChange).toEqual(defaultConfig.onChange);
  });
});

describe('Обновление модели', (): void => {
  test('Модель обновляется', (): void => {
    const model = new Model(defaultConfig);
    const state = model.getState();
    model.dispatchState({ ...state, kind: 'stateUpdated', theme: 'red' });
    const newState = model.getState();

    expect(state.theme).toEqual('aqua');
    expect(newState.theme).toEqual('red');
  });
});

describe('Валидирование состояния', (): void => {
  test('Step = 1 если step < 0', (): void => {
    const model = new Model({ ...defaultConfig, step: 0 });
    const state = model.getState();

    expect(state.step).toEqual(1);
  });

  test('Min <=> Max меняются местами если min > max', (): void => {
    const model = new Model({ ...defaultConfig, min: 10, max: 5 });
    const state = model.getState();

    expect(state.min).toEqual(5);
    expect(state.max).toEqual(10);
  });

  test('FirstValue = min если firstValue < min', (): void => {
    const model = new Model({ ...defaultConfig, min: 0, firstValue: -1 });
    const state = model.getState();

    expect(state.firstValue).toEqual(state.min);
    expect(state.firstValue).toEqual(0);
  });

  test('FirstValue = max если firstValue > max', (): void => {
    const model = new Model({ ...defaultConfig, max: 30, firstValue: 31 });
    const state = model.getState();

    expect(state.firstValue).toEqual(state.max);
    expect(state.firstValue).toEqual(30);
  });

  test('SecondValue = null если hasInterval = false', (): void => {
    const model = new Model({ ...defaultConfig, hasInterval: false, secondValue: 31 });
    const state = model.getState();

    expect(state.secondValue).toEqual(null);
  });

  test('SecondValue = min если secondValue < min и hasInterval = true', (): void => {
    const model = new Model({ ...defaultConfig, min: 0, hasInterval: true, secondValue: -1 });
    const state = model.getState();

    expect(state.secondValue).toEqual(state.min);
    expect(state.secondValue).toEqual(0);
  });

  test('SecondValue = max если secondValue > max и hasInterval = true', (): void => {
    const model = new Model({ ...defaultConfig, max: 30, hasInterval: true, secondValue: 31 });
    const state = model.getState();

    expect(state.secondValue).toEqual(state.max);
    expect(state.secondValue).toEqual(30);
  });

  test('FirstValue <=> SecondValue меняются местами если firstValue > secondValue и hasInterval = true', (): void => {
    const model =
      new Model({ ...defaultConfig, hasInterval: true, firstValue: 21, secondValue: 20 });
    const state = model.getState();

    expect(state.firstValue).toEqual(20);
    expect(state.secondValue).toEqual(21);
  });
});
