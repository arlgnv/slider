import Model from '../Model/Model';
import SliderView from '../View/Slider/SliderView';
import Presenter from '../Presenter/Presenter';
import IApp from '../Interfaces/App/IApp';
import IDefaultParameters from '../Interfaces/IDefaultParameters';

export default class App implements IApp {
  private model: Model;
  private view: SliderView;

  constructor(anchorElement: JQuery, parameters: IDefaultParameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(anchorElement, this.model.getState());
    new Presenter(this.model, this.view);
  }

  update(parameters: IDefaultParameters = {}): void {
    this.model.updateState({ ...parameters, condition: 'updated' });
  }
}
