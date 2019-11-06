import IParameters from '../IParameters';

export default interface ISliderView {
  updateView(parameters: IParameters, changed?: IParameters): void;
}
