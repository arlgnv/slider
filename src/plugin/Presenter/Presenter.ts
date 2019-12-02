import Model from '../Model/Model';
import Slider from '../View/Slider/Slider';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IDefaultParameters from '../Interfaces/Model/IDefaultParameters';
import IPercentParameters from '../Interfaces/View/IPercentParameters';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: Slider) {
    this.model = model;
    this.view = view;

    this.initSubscribes();
  }

  public initSubscribes(): void {
    this.view.subscribe('dispatchedParameters', this.dispatchState);
    this.model.subscribe('updatedState', this.updateState);
  }

  private dispatchState =
    (parameters: IPercentParameters): void => this.model.dispatchState({ ...parameters, kind: 'valuePercentUpdated' })

  private updateState =
    (parameters: IDefaultParameters): void => this.view.updateSlider(parameters)
}
