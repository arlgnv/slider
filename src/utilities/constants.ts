import IDefaultParameters from '../plugin/Interfaces/Model/IDefaultParameters';

export const DEFAULT_PARAMETERS: Partial<IDefaultParameters>[] = [
  { firstValue: 10, max: 20, hasScale: true, hasTip: true },
  { hasInterval: true, hasTip: true, theme: 'red' },
  { min: -1, max: 10, step: 3, isVertical: true, hasScale: true },
];
