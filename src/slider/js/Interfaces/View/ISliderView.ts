import IParameters from '../IParameters';

export default interface ISliderView {
  redrawView(parameters: IParameters, changed?: IParameters): void;
}
