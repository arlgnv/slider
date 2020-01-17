import { IRegularParameters } from './Interfaces/Model/IModel';

const FIRST_VALUE_DEFAULT = 0;
const FIRST_VALUE_PERCENT_DEFAULT = 0;
const MIN_VALUE_DEFAULT = 0;
const MAX_VALUE_DEFAULT = 100;
const STEP_VALUE_DEFAULT = 1;
const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

const DEFAULT_CONFIG: IRegularParameters = {
  kind: 'stateUpdated',
  firstValue: FIRST_VALUE_DEFAULT,
  firstValuePercent: FIRST_VALUE_PERCENT_DEFAULT,
  min: MIN_VALUE_DEFAULT,
  max: MAX_VALUE_DEFAULT,
  step: STEP_VALUE_DEFAULT,
  hasInterval: false,
  hasTip: false,
  hasScale: false,
  isVertical: false,
  theme: 'aqua',
  secondValue: null,
  secondValuePercent: null,
  onChange: null,
};

export {
  FIRST_VALUE_DEFAULT,
  FIRST_VALUE_PERCENT_DEFAULT,
  MIN_VALUE_DEFAULT,
  MAX_VALUE_DEFAULT,
  PERCENT_MIN,
  PERCENT_MAX,
  STEP_VALUE_DEFAULT,
  DEFAULT_CONFIG,
 };
