import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import InputView from '../View/InputView';
import Presenter from '../Presenter/Presenter';
import IParameters from '../Interfaces/IParameters';

export default class App {
  private model: Model;
  private view: SliderView;
  private presenter: Presenter;

  constructor(input: HTMLInputElement, parameters: IParameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(new InputView(input), this.model.getState());
    this.presenter = new Presenter(this.model, this.view);
  }

  update(data: IParameters = {}): void {
    this.model.updateState(data);
  }
}
