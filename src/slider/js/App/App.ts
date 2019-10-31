import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import Presenter from '../Presenter/Presenter';
import IApp from '../Interfaces/App/IApp';
import IParameters from '../Interfaces/IParameters';

export default class App implements IApp {
  private model: Model;
  private view: SliderView;
  private presenter: Presenter;

  constructor(anchorElement: HTMLElement, parameters: IParameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(anchorElement, this.model.getState());
    this.presenter = new Presenter(this.model, this.view);
  }

  update(data: IParameters = {}): void {
    this.model.updateState(data);
  }
}
