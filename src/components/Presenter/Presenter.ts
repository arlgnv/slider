import Model from '../Model/Model';
import Slider from '../View/Slider/Slider';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import { IDefaultParameters, IRegularParameters, IPercentParameters } from '../Interfaces/Model/IModel';

class Presenter implements IPresenter {
  private model: Model;
  private view: Slider;

  constructor(anchorElement: JQuery, parameters: IRegularParameters) {
    this.model = new Model(parameters);
    this.view = new Slider(anchorElement, this.model.getState());

    this.init(this.model.getState());
  }

  public update(parameters: Partial<IDefaultParameters> = {}): void {
    this.model.dispatchState({ ...this.model.getState(), ...parameters, kind: 'stateUpdated' });
  }

  private init(parameters: IDefaultParameters): void {
    this.initSubscribes();

    const { onChange } = parameters;

    if (onChange) {
      onChange(parameters);
    }
  }

  private initSubscribes(): void {
    this.view.subscribe('dispatchedParameters', this.dispatchState);
    this.model.subscribe('updatedState', this.updateState);
  }

  private dispatchState =
    (parameters: IPercentParameters): void => this.model.dispatchState({ ...parameters, kind: 'valuePercentUpdated' })

  private updateState = (parameters: IDefaultParameters): void => {
    const { onChange } = parameters;

    if (onChange) {
      onChange(parameters);
    }

    this.view.updateSlider(parameters);
  }
}

export default Presenter;
