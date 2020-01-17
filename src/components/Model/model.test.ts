import Model from './Model';
import { DEFAULT_CONFIG } from '../constants';

describe('Инициализация', (): void => {
  test('Инициализируется корректное состояние модели', (): void => {
    const model = new Model(DEFAULT_CONFIG);
    const state = model.getState();

    expect(Object.getOwnPropertyNames(state).length)
      .toEqual(Object.getOwnPropertyNames(DEFAULT_CONFIG).length);
    expect(state.kind).toEqual(DEFAULT_CONFIG.kind);
    expect(state.max).toEqual(DEFAULT_CONFIG.max);
    expect(state.hasScale).toEqual(DEFAULT_CONFIG.hasScale);
    expect(state.theme).toEqual(DEFAULT_CONFIG.theme);
    expect(state.onChange).toEqual(DEFAULT_CONFIG.onChange);
  });
});

describe('Обновление модели', (): void => {
  test('Модель обновляется', (): void => {
    const model = new Model(DEFAULT_CONFIG);
    const state = model.getState();
    model.dispatchState({ ...state, kind: 'stateUpdated', theme: 'red' });
    const newState = model.getState();

    expect(state.theme).toEqual('aqua');
    expect(newState.theme).toEqual('red');
  });
});

describe('Валидирование параметров', (): void => {
  test('Step = 1 если step < 0', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, step: 0 });
    const state = model.getState();

    expect(state.step).toEqual(1);
  });

  test('Min <=> Max меняются местами если min > max', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, min: 10, max: 5 });
    const state = model.getState();

    expect(state.min).toEqual(5);
    expect(state.max).toEqual(10);
  });

  test('FirstValue = min если firstValue < min', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, min: 0, firstValue: -1 });
    const state = model.getState();

    expect(state.firstValue).toEqual(state.min);
    expect(state.firstValue).toEqual(0);
  });

  test('FirstValue = max если firstValue > max', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, max: 30, firstValue: 31 });
    const state = model.getState();

    expect(state.firstValue).toEqual(state.max);
    expect(state.firstValue).toEqual(30);
  });

  test('Значение правильно корректируется в зависимости от шага', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, step: 3, firstValue: 4 });
    const state = model.getState();
    model.dispatchState({ ...state, kind: 'stateUpdated', firstValue: 5 });
    const newState = model.getState();

    expect(state.firstValue).toEqual(3);
    expect(newState.firstValue).toEqual(6);
  });

  test('SecondValue = null если hasInterval = false', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, hasInterval: false, secondValue: 31 });
    const state = model.getState();

    expect(state.secondValue).toEqual(null);
  });

  test('SecondValue = min если secondValue < min и hasInterval = true', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, min: 0, hasInterval: true, secondValue: -1 });
    const state = model.getState();

    expect(state.secondValue).toEqual(state.min);
    expect(state.secondValue).toEqual(0);
  });

  test('SecondValue = max если secondValue > max и hasInterval = true', (): void => {
    const model = new Model({ ...DEFAULT_CONFIG, max: 30, hasInterval: true, secondValue: 31 });
    const state = model.getState();

    expect(state.secondValue).toEqual(state.max);
    expect(state.secondValue).toEqual(30);
  });

  test('FirstValue <=> SecondValue меняются местами если firstValue > secondValue и hasInterval = true', (): void => {
    const model =
      new Model({ ...DEFAULT_CONFIG, hasInterval: true, firstValue: 21, secondValue: 20 });
    const state = model.getState();

    expect(state.firstValue).toEqual(20);
    expect(state.secondValue).toEqual(21);
  });
});
