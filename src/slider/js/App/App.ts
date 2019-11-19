import Model from '../Model/Model';
import SliderView from '../View/Slider/SliderView';
import Presenter from '../Presenter/Presenter';
import IApp from '../Interfaces/App/IApp';
import IDefaultParameters from '../Interfaces/IDefaultParameters';
import IRegularParameters from '../Interfaces/IRegularParameters';

export default class App implements IApp {
  private model: Model;
  private view: SliderView;

  constructor(anchorElement: JQuery, parameters: IRegularParameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(anchorElement, this.model.getState());
    new Presenter(this.model, this.view);
  }

  update(parameters: IDefaultParameters = {}): void {
    this.model.dispatchState({ ...parameters, kind: 'stateUpdated' });
  }
}
