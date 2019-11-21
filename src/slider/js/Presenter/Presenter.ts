import Model from '../Model/Model';
import SliderView from '../View/Slider/SliderView';
import IPresenter from '../Interfaces/Presenter/IPresenter';
import IDefaultParameters from '../Interfaces/IDefaultParameters';
import IPercentParameters from '../Interfaces/IPercentParameters';

export default class Presenter implements IPresenter {
  constructor(private model: Model, private view: SliderView) {
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
