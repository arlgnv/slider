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

describe('Constructor', (): void => {
  test('Устанавливает корректное состояние модели', (): void => {
    const model = new Model(defaultConfig);
    const state = model.getState();

    expect(Object.getOwnPropertyNames(state).length).toEqual(14);
    expect(state.kind).toEqual('stateUpdated');
    expect(state.max).toEqual(100);
    expect(state.hasScale).toEqual(false);
    expect(state.theme).toEqual('aqua');
    expect(state.onChange).toEqual(null);
  });
});

describe('updatingModel', (): void => {
  test('Корректно обновляет модель', (): void => {
    const model = new Model(defaultConfig);
    const state = model.getState();
    model.dispatchState({ ...state, kind: 'stateUpdated', theme: 'red' });
    const newState = model.getState();

    expect(state.theme).toEqual('aqua');
    expect(newState.theme).toEqual('red');
  });
});
