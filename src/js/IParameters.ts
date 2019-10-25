export default interface IParameters {
  from?: number;
  to?: null | number;
  min?: number;
  max?: number;
  step?: number;

  hasInterval?: boolean;
  isVertical?: boolean;
  hasTip?: boolean;

  theme?: string;

  onChange?: null | Function;
}
