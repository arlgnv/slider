interface IModel {
  dispatchState(parameters: IRegularParameters | IPercentParameters): void;
  getState(): IDefaultParameters;
}

interface IDefaultParameters {
  kind: 'stateUpdated' | 'valuePercentUpdated';
  firstValue: number;
  secondValue: number | null;
  min: number;
  max: number;
  step: number;
  hasInterval: boolean;
  hasTip: boolean;
  hasScale: boolean;
  isVertical: boolean;
  theme: 'aqua' | 'red';
  onChange: Function | null;
  firstValuePercent: number;
  secondValuePercent: number | null;
  percent?: number;
  lastUpdatedOnPercent?: 'firstValue' | 'secondValue' | 'either';
}

interface IPercentParameters extends IDefaultParameters {
  kind: 'valuePercentUpdated';
  percent: number;
  lastUpdatedOnPercent: 'firstValue' | 'secondValue' | 'either';
}

interface IRegularParameters extends IDefaultParameters {
  kind: 'stateUpdated';
}

export { IModel, IDefaultParameters, IPercentParameters, IRegularParameters };
