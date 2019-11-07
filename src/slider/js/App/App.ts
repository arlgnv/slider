import Model from '../Model/Model';
import SliderView from '../View/SliderView';
import Presenter from '../Presenter/Presenter';
import IApp from '../Interfaces/App/IApp';
import IParameters from '../Interfaces/IParameters';

export default class App implements IApp {
  private model: Model;
  private view: SliderView;

  constructor(anchorElement: JQuery, parameters: IParameters) {
    this.model = new Model(parameters);
    this.view = new SliderView(anchorElement, this.model.getState());
    new Presenter(this.model, this.view);
  }

  update(parameters: IParameters = {}): void {
    this.model.updateState({ ...parameters, condition: 'afterUpdateState' });
  }
}
